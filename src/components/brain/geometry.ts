import { BufferAttribute, BufferGeometry, IcosahedronGeometry, Vector3 } from 'three'
import type { LobeShape } from '@/components/brain/brainRegions'

/**
 * The cerebrum is one ellipsoid per hemisphere, not four overlapping ones.
 *
 * This is the whole trick. Building each lobe as its own sphere and letting
 * them intersect produces a bag of stones no matter how the centres are tuned —
 * the silhouette is a union of circles and it always looks like one. Deforming
 * a single surface and then *partitioning its faces* by region gives a
 * continuous organ whose lobes are colour regions, while still leaving each
 * region its own mesh to raycast against.
 */
// Note the z centre is 0 and the z radius is the organ's FULL half-width: each
// hemisphere is a whole ellipsoid spanning the midline, which the medial clamp
// below then slices in half.
//
// Offsetting the hemispheres apart instead — the obvious approach — does not
// work. An ellipsoid's cross-section shrinks toward its poles, so a fixed
// offset leaves a gap that widens the further you get from the equator, worst
// of all at the frontal pole. Head-on, that gap is a strip missing from the
// middle of the brain. Slicing a centred ellipsoid keeps the flat medial wall
// running the entire length, so the fissure stays a constant thin slot.
const CEREBRUM = {
  center: [0, 0.02, 0] as [number, number, number],
  radius: [0.95, 0.7, 0.75] as [number, number, number],
}

/**
 * How far each hemisphere reaches *past* the midline.
 *
 * Every vertex that would cross the midline is clamped to this plane, slicing
 * the centred ellipsoid in half and leaving a flat medial wall — which is what
 * stops two offset domes gaping apart toward the poles.
 *
 * The clamp used to sit on the fissure side of the midline, leaving a slot
 * between the two walls. Any slot at all is visible: the walls face inward and
 * are backface-culled, so it renders as a hard dark line, and even 0.008 units
 * came out as a two-pixel crack down the middle of the organ. Clamping past
 * the midline instead makes the halves interpenetrate slightly. The overlap is
 * buried inside solid geometry where nothing can see it, and there is no seam
 * left to antialias.
 */
const MEDIAL_OVERLAP = 0.012

/** Cortical regions, in the order faces get sorted into them. */
export type CortexRegionId = 'prefrontal' | 'frontal' | 'parietal' | 'temporal' | 'occipital'

/**
 * Which lobe a point on the cerebral surface belongs to.
 *
 * Boundaries are planes in the sagittal profile, which is roughly how the real
 * landmarks run: the temporal lobe sits below a forward-tilting line (the
 * lateral sulcus), and the remaining arc splits front to back. The prefrontal
 * cortex is the anterior tip of the frontal lobe, so it is carved off the front
 * rather than being a lobe of its own.
 */
function classify(x: number, y: number): CortexRegionId {
  if (x > -0.45 && y < -0.14 - 0.1 * x) return 'temporal'
  if (x > 0.58) return 'prefrontal'
  if (x > 0.18) return 'frontal'
  if (x < -0.46) return 'occipital'
  return 'parietal'
}

/**
 * Gyri and sulci, faked.
 *
 * A sum of sines rather than real noise: deterministic (identical every load,
 * nothing to seed), dependency-free, and evaluated in *world* space so folds
 * run continuously across the seam between hemispheres and structures.
 *
 * Each term mixes axes inside the sine. A product of three single-axis sines
 * gives isotropic lumps; tilting the wave produces the long diagonal ridges
 * that actually look like gyri. The high-frequency pair is the one doing the
 * visible work — wavelength near 0.3 units — and is why the mesh is subdivided
 * as far as it is.
 */
function fold(x: number, y: number, z: number): number {
  const gyri =
    0.052 * Math.sin(4.0 * x + 2.2 * y + 1.3) * Math.cos(3.6 * z - 0.6) +
    0.036 * Math.sin(9.0 * z + 3.1 * x) * Math.cos(8.0 * y + 0.4) +
    0.03 * Math.sin(19.0 * x + 7.0 * y) * Math.cos(17.0 * z + 0.4) +
    0.022 * Math.sin(21.0 * y + 9.0 * z)

  // The lateral sulcus: a real, deep groove that separates the temporal lobe.
  // Without it the underside of the cerebrum is a smooth curve and the temporal
  // region looks painted on rather than anatomical.
  const t = (y + 0.15 + 0.1 * x) / 0.09
  const sulcus = 0.085 * Math.exp(-(t * t))

  return gyri - sulcus
}

/**
 * Mirroring by negating z is a reflection, and a reflection reverses triangle
 * winding. Left-hand structures therefore come out inside-out: every face
 * points inward, backface culling removes the near surface, and you see
 * straight through to the inside of the far wall.
 *
 * It is easy to miss, because the mirrored half only betrays itself once the
 * camera swings around far enough to look at it directly.
 */
function reverseWinding(position: BufferAttribute) {
  for (let f = 0; f < position.count; f += 3) {
    const x = position.getX(f + 1)
    const y = position.getY(f + 1)
    const z = position.getZ(f + 1)
    position.setXYZ(f + 1, position.getX(f + 2), position.getY(f + 2), position.getZ(f + 2))
    position.setXYZ(f + 2, x, y, z)
  }
}

function displace(
  unit: Vector3,
  center: [number, number, number],
  radius: [number, number, number],
  sign: number,
  out: Vector3,
): Vector3 {
  const x = unit.x * radius[0]
  const y = unit.y * radius[1]
  const z = unit.z * radius[2] * sign

  // Evaluate the fold field where this vertex sits in the finished head, not
  // where it sits in its own little mesh, or the pieces stop lining up.
  const scale = 1 + fold(x + center[0], y + center[1], z + center[2] * sign)
  return out.set(x * scale, y * scale, z * scale)
}

/**
 * Builds one hemisphere of the cerebrum and returns its faces grouped by lobe.
 *
 * Positions are local to the hemisphere's centre so the caller can place the
 * mesh by `cerebrumCenter` — which also means the hover scale grows a lobe
 * outward from the middle of the organ, lifting it off the surface.
 */
export function buildCerebrum(detail: number, sign: number): Map<CortexRegionId, BufferGeometry> {
  const source = new IcosahedronGeometry(1, detail)
  const position = source.attributes.position
  const unit = new Vector3()

  const [cx, cy, cz] = CEREBRUM.center
  const [rx, ry, rz] = CEREBRUM.radius

  // Positions are baked in world space here, not relative to a hemisphere
  // centre, so the medial clamp below can be expressed against the midline
  // plane directly. The meshes therefore sit at the origin.
  const points: number[][] = []
  for (let i = 0; i < position.count; i += 1) {
    unit.fromBufferAttribute(position, i).normalize()

    const lx = unit.x * rx
    const ly = unit.y * ry
    const lz = unit.z * rz * sign

    const scale = 1 + fold(lx + cx, ly + cy, lz + cz * sign)

    const wx = cx + lx * scale
    const wy = cy + ly * scale
    // Flatten the medial face just past the midline. Without this the
    // hemisphere domes inward and the two halves gape apart.
    const wz =
      sign > 0
        ? Math.max(cz * sign + lz * scale, -MEDIAL_OVERLAP)
        : Math.min(cz * sign + lz * scale, MEDIAL_OVERLAP)

    points.push([wx, wy, wz])
  }
  source.dispose()

  const buckets = new Map<CortexRegionId, number[]>([
    ['prefrontal', []],
    ['frontal', []],
    ['parietal', []],
    ['temporal', []],
    ['occipital', []],
  ])

  for (let f = 0; f < points.length; f += 3) {
    const a = points[f]
    const b = points[f + 1]
    const c = points[f + 2]

    // Classify by face centroid, not per vertex — a shared vertex would
    // otherwise have to belong to two lobes at once and leave holes.
    const cx = (a[0] + b[0] + c[0]) / 3
    const cy = (a[1] + b[1] + c[1]) / 3

    const bucket = buckets.get(classify(cx, cy))
    // Emit the mirrored hemisphere's faces reversed, so it is not inside-out.
    if (bucket) bucket.push(...(sign > 0 ? [...a, ...b, ...c] : [...a, ...c, ...b]))
  }

  const result = new Map<CortexRegionId, BufferGeometry>()
  for (const [id, verts] of buckets) {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3))
    geometry.computeVertexNormals()
    result.set(id, geometry)
  }
  return result
}

/**
 * Cerebrum vertices are baked in world space, so its meshes sit at the origin —
 * which also means a hovered lobe scales outward from the centre of the organ.
 */
export function cerebrumCenter(): [number, number, number] {
  return [0, 0, 0]
}

/**
 * Builds a standalone structure — the cerebellum and brain stem, which really
 * are separate masses rather than parts of the cortical sheet.
 */
export function buildStructure(shape: LobeShape, detail: number, sign = 1): BufferGeometry {
  const geometry = new IcosahedronGeometry(1, detail)
  const position = geometry.attributes.position
  const unit = new Vector3()
  const displaced = new Vector3()

  for (let i = 0; i < position.count; i += 1) {
    unit.fromBufferAttribute(position, i).normalize()
    displace(unit, shape.center, shape.radius, sign, displaced)
    position.setXYZ(i, displaced.x, displaced.y, displaced.z)
  }

  if (sign < 0) reverseWinding(position as BufferAttribute)

  geometry.computeVertexNormals()
  return geometry
}

/** World-space centre of a standalone structure. */
export function structureCenter(shape: LobeShape, sign = 1): [number, number, number] {
  return [shape.center[0], shape.center[1], shape.center[2] * sign]
}
