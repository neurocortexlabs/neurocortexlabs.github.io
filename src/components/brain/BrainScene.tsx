import { useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  AdditiveBlending,
  Color,
  MathUtils,
  type BufferGeometry,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
  type PerspectiveCamera,
  type Points,
  type PointsMaterial,
} from 'three'
import { brainRegions, type BrainRegion } from '@/components/brain/brainRegions'
import {
  buildCerebrum,
  buildStructure,
  cerebrumCenter,
  structureCenter,
} from '@/components/brain/geometry'

/** Shared base colour for every region — a cool mauve-slate that reads as tissue. */
const TISSUE = new Color('#413a4f')

/**
 * Base-colour drift toward the region's accent. Minor — the resting tint you
 * actually see comes from REST_GLOW below, since emissive adds straight to
 * outgoing light and easily out-shouts a near-black diffuse colour.
 */
const REGION_TINT = 0.06

/**
 * Emissive at rest, and on hover.
 *
 * REST_GLOW is the real dial for "how colour-coded is the brain when nobody is
 * touching it". Around 0.08 each lobe reads as its own balloon; near zero the
 * organ is uniform tissue and the mapping lives entirely in hover, the caption
 * and the legend. This sits low on purpose — enough to hint the parts are
 * distinct, not enough to stop it looking like one brain.
 */
const REST_GLOW = 0.035
// Past roughly 0.5 the emissive swamps the diffuse shading and the lobe turns
// into a flat coloured cutout with no facets left — bright, but it stops
// looking like part of the object.
const HOVER_GLOW = 0.4

/**
 * How far a hovered region lifts off the surface.
 *
 * Kept tiny because cortical lobes are sectors of one shared surface: scaling
 * one about the organ's centre pushes it through its neighbours, and the
 * triangulated boundary shows up as a jagged step. At 1.2% it reads as a
 * gentle swell; at 3% it looks broken.
 */
const HOVER_LIFT = 1.012

/**
 * How far the pointer may travel between press and release and still count as
 * a click rather than an orbit, in CSS pixels.
 *
 * Without this, every drag to turn the brain also navigates: OrbitControls
 * consumes the movement, but the mesh still sees a press and a release and
 * fires a click, so the page jumps to a section mid-rotation.
 */
const DRAG_SLOP = 6

type PressRef = { x: number; y: number } | null

/** Point overlay density. Far coarser than the shaded mesh — see Lobe. */
const POINT_DETAIL = 3

/** Breathing room left around the organ once it has been fitted to the canvas. */
const FIT_MARGIN = 0.97

export type BrainSceneProps = {
  hovered: string | null
  onHover: (id: string | null) => void
  onSelect: (view: string) => void
  reducedMotion: boolean
  /** Mobile and low-power devices get a coarser mesh. */
  quality: 'low' | 'high'
  /** Stop rendering when the canvas is not on screen. */
  active: boolean
}

export default function BrainScene({
  hovered,
  onHover,
  onSelect,
  reducedMotion,
  quality,
  active,
}: BrainSceneProps) {
  // The folds only resolve once facets get small; below detail 4 the
  // high-frequency terms alias into noise instead of reading as gyri.
  const detail = quality === 'high' ? 5 : 4

  // Hovering holds the organ still. Reading a label on a target that is
  // drifting out from under the cursor is its own small annoyance, and the
  // pause is what makes the thing feel like it is responding to you.
  const paused = hovered !== null

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'never'}
      // Near-lateral. A brain is most recognisable in profile; swing too far
      // toward the front and the silhouette stops reading as anything.
      camera={{ position: [0.9, 0.4, 3.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onHover(null)}
    >
      {/* A neutral key does the shaping. The coloured lights are rim and fill
          only, kept weak on purpose — crank them and every lobe turns into a
          saturated balloon instead of tissue. */}
      {/* Ambient carries the walls of the longitudinal fissure. Drop it much
          below this and the midline goes black, which reads as a hole rather
          than a groove. */}
      <ambientLight intensity={0.68} color="#93a2c4" />
      <directionalLight position={[2.5, 3.5, 4]} intensity={1.9} color="#eef2ff" />
      <pointLight position={[-3, 0.5, 1.5]} intensity={8} color="#38dcc2" distance={12} />
      <pointLight position={[2.5, -1.5, -2.5]} intensity={8} color="#a78bfa" distance={12} />
      <pointLight position={[0.5, -2.5, 2]} intensity={4} color="#f8b95c" distance={10} />

      <Brain
        detail={detail}
        hovered={hovered}
        onHover={onHover}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
        paused={paused}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion && !paused}
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        // Keep the viewer roughly level with the organ — looking at it from
        // directly above or below just reads as an unidentifiable lump.
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
        // The organ is recentred onto the origin by FitToView, so that is what
        // the camera should orbit around.
        target={[0, 0, 0]}
      />
    </Canvas>
  )
}

type BrainProps = {
  detail: number
  hovered: string | null
  onHover: (id: string | null) => void
  onSelect: (view: string) => void
  reducedMotion: boolean
  paused: boolean
}

function Brain({ detail, hovered, onHover, onSelect, reducedMotion, paused }: BrainProps) {
  const group = useRef<Group>(null)

  // Shared across every region on purpose: a drag that starts on one lobe and
  // releases over another must still be recognised as a drag.
  const pressRef = useRef<PressRef>(null)

  // Both hemispheres are built once and split into lobes here, rather than each
  // lobe building its own sphere — that is what keeps the surface continuous.
  const hemispheres = useMemo(
    () =>
      [1, -1].map((sign) => ({
        sign,
        shaded: buildCerebrum(detail, sign),
        dots: buildCerebrum(POINT_DETAIL, sign),
      })),
    [detail],
  )

  /**
   * Separate vertical and horizontal extents, measured rather than hardcoded so
   * they keep up when the lobe shapes are retuned.
   *
   * Not a bounding sphere. The brain is a third longer than it is tall, and the
   * camera only ever orbits around Y, so its on-screen height never exceeds the
   * Y extent while its width swings up to the largest radius in the XZ plane.
   * Fitting one sphere to both would size the whole thing by its longest axis
   * and leave a band of dead space above and below it.
   */
  const bounds = useMemo(() => {
    let top = -Infinity
    let bottom = Infinity
    let horizontal = 0

    for (const { shaded } of hemispheres) {
      for (const geometry of shaded.values()) {
        const position = geometry.attributes.position
        for (let i = 0; i < position.count; i += 1) {
          const y = position.getY(i)
          if (y > top) top = y
          if (y < bottom) bottom = y
          horizontal = Math.max(horizontal, Math.hypot(position.getX(i), position.getZ(i)))
        }
      }
    }

    for (const region of brainRegions) {
      if (region.kind !== 'structure') continue
      const [x, y, z] = region.shape.center
      const [rx, ry, rz] = region.shape.radius
      // Folds can push a structure a little past its nominal radius.
      top = Math.max(top, y + ry * 1.2)
      bottom = Math.min(bottom, y - ry * 1.2)
      horizontal = Math.max(horizontal, Math.hypot(Math.abs(x) + rx * 1.2, Math.abs(z) + rz * 1.2))
    }

    // Measure the half-extent about the organ's own middle, and shift that
    // middle onto the camera target. The brain hangs well below the origin —
    // the stem reaches much further down than the crown reaches up — so
    // measuring |y| from the origin describes a box a tenth taller than the
    // brain, and every pixel of that phantom height came out of its size.
    return {
      centerY: (top + bottom) / 2,
      // The idle drift tilts the group slightly, which borrows a little height.
      vertical: ((top - bottom) / 2) * 1.05,
      horizontal,
    }
  }, [hemispheres])

  // A slight drift reads as a specimen on a stand rather than a floating ball.
  // It stops with the rotation, so a hovered lobe is genuinely still.
  useFrame((state) => {
    if (!group.current || reducedMotion || paused) return
    const t = state.clock.elapsedTime
    group.current.rotation.z = Math.sin(t * 0.25) * 0.03
    group.current.position.y = Math.sin(t * 0.4) * 0.02
  })

  return (
    <FitToView bounds={bounds}>
    <group ref={group} rotation={[0.08, 0, -0.06]}>
      {hemispheres.map(({ sign, shaded, dots }) =>
        brainRegions
          .filter((region) => region.kind === 'cortex')
          .map((region) => {
            const geometry = shaded.get(region.id)
            const pointGeometry = dots.get(region.id)
            if (!geometry || !pointGeometry) return null
            return (
              <Part
                key={`${region.id}-${sign}`}
                region={region}
                geometry={geometry}
                pointGeometry={pointGeometry}
                position={cerebrumCenter()}
                isHovered={hovered === region.id}
                onHover={onHover}
                onSelect={onSelect}
                pressRef={pressRef}
              />
            )
          }),
      )}

      {brainRegions
        .filter((region) => region.kind === 'structure')
        .map((region) =>
          (region.shape.mirrored ? [1, -1] : [1]).map((sign) => (
            <Structure
              key={`${region.id}-${sign}`}
              region={region}
              sign={sign}
              detail={detail - 1}
              isHovered={hovered === region.id}
              onHover={onHover}
              onSelect={onSelect}
              pressRef={pressRef}
            />
          )),
        )}
    </group>
    </FitToView>
  )
}

/**
 * Scales the organ so it just fills the canvas, at whatever size and shape the
 * browser window leaves for it.
 *
 * The extents are worst-case across every rotation the controls allow, not the
 * current silhouette. Fitting the outline you can see right now would be
 * bigger, but the brain turns, and anything sized to one angle clips at another.
 */
function FitToView({
  bounds,
  children,
}: {
  bounds: { vertical: number; horizontal: number; centerY: number }
  children: ReactNode
}) {
  const size = useThree((state) => state.size)
  const camera = useThree((state) => state.camera)

  const scale = useMemo(() => {
    if (!bounds.vertical || !bounds.horizontal || !size.height) return 1
    const perspective = camera as PerspectiveCamera
    // Zoom is disabled, so orbiting never changes this.
    const distance = perspective.position.length()
    const halfHeight = distance * Math.tan((perspective.fov * Math.PI) / 360)
    const halfWidth = halfHeight * (size.width / size.height)
    return Math.min(halfHeight / bounds.vertical, halfWidth / bounds.horizontal) * FIT_MARGIN
  }, [camera, size.width, size.height, bounds])

  return (
    <group scale={scale}>
      <group position={[0, -bounds.centerY, 0]}>{children}</group>
    </group>
  )
}

function Structure({
  region,
  sign,
  detail,
  isHovered,
  onHover,
  onSelect,
  pressRef,
}: {
  region: Extract<BrainRegion, { kind: 'structure' }>
  sign: number
  detail: number
  isHovered: boolean
  onHover: (id: string | null) => void
  onSelect: (view: string) => void
  pressRef: RefObject<PressRef>
}) {
  const geometry = useMemo(
    () => buildStructure(region.shape, detail, sign),
    [region.shape, detail, sign],
  )
  const pointGeometry = useMemo(
    () => buildStructure(region.shape, POINT_DETAIL, sign),
    [region.shape, sign],
  )

  return (
    <Part
      region={region}
      geometry={geometry}
      pointGeometry={pointGeometry}
      position={structureCenter(region.shape, sign)}
      isHovered={isHovered}
      onHover={onHover}
      onSelect={onSelect}
      pressRef={pressRef}
    />
  )
}

type PartProps = {
  region: BrainRegion
  geometry: BufferGeometry
  pointGeometry: BufferGeometry
  position: [number, number, number]
  isHovered: boolean
  onHover: (id: string | null) => void
  onSelect: (view: string) => void
  pressRef: RefObject<PressRef>
}

function Part({
  region,
  geometry,
  pointGeometry,
  position,
  isHovered,
  onHover,
  onSelect,
  pressRef,
}: PartProps) {
  const mesh = useRef<Mesh>(null)
  const points = useRef<Points>(null)

  const { base, accent } = useMemo(() => {
    const accentColor = new Color(region.color)
    // The cerebellum and stem are small, tucked underneath and lit by almost
    // nothing, so they need a lighter base or they vanish and leave only their
    // point overlay floating in the dark. Their accent is a muted slate, so
    // mixing this far lightens without saturating.
    const tint = region.kind === 'structure' ? 0.4 : REGION_TINT
    return { base: TISSUE.clone().lerp(accentColor, tint), accent: accentColor }
  }, [region.color, region.kind])

  useFrame((_, delta) => {
    if (!mesh.current) return
    const material = mesh.current.material as MeshStandardMaterial
    const targetGlow = isHovered ? HOVER_GLOW : REST_GLOW
    const targetScale = isHovered ? HOVER_LIFT : 1

    // Frame-rate independent easing — a raw lerp factor would make the
    // transition speed depend on the display's refresh rate.
    const k = 1 - Math.exp(-delta * 9)
    material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, targetGlow, k)
    mesh.current.scale.setScalar(MathUtils.lerp(mesh.current.scale.x, targetScale, k))

    if (points.current) {
      const dots = points.current.material as PointsMaterial
      dots.opacity = MathUtils.lerp(dots.opacity, isHovered ? 0.9 : 0.22, k)
      points.current.scale.copy(mesh.current.scale)
    }
  })

  const interactive = region.view !== null

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(region.id)
        if (interactive) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = ''
      }}
      onPointerDown={(event) => {
        pressRef.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY }
      }}
      onClick={(event) => {
        event.stopPropagation()
        const start = pressRef.current
        pressRef.current = null
        if (!region.view) return
        if (start) {
          const dx = event.nativeEvent.clientX - start.x
          const dy = event.nativeEvent.clientY - start.y
          if (Math.hypot(dx, dy) > DRAG_SLOP) return // an orbit, not a click
        }
        onSelect(region.view)
      }}
    >
      <meshStandardMaterial
        color={base}
        emissive={accent}
        emissiveIntensity={REST_GLOW}
        roughness={0.78}
        metalness={0.04}
        flatShading
      />

      {/* A far coarser copy of the same surface drawn as glowing vertices. It
          makes the organ read as scanned rather than sculpted, and lets each
          region carry its accent in light instead of pigment — so the mass can
          stay neutral tissue. Additive and depth-write-free so the dots read as
          light on the surface rather than beads sitting on it. */}
      <points ref={points} geometry={pointGeometry} raycast={() => null}>
        <pointsMaterial
          size={0.013}
          color={accent}
          transparent
          opacity={0.22}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </mesh>
  )
}
