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
const CEREBRUM = {
  center: [0, 0.02, 0.38] as [number, number, number],
  radius: [1.02, 0.7, 0.36] as [number, number, number],
}

/** Cortical regions, in the order faces get sorted into them. */
export type CortexRegionId = 'frontal' | 'parietal' | 'temporal' | 'occipital'

/**
 * Which lobe a point on the cerebral surface belongs to.
 *
 * Boundaries are planes in the sagittal profile, which is roughly how the real
 * landmarks run: the temporal lobe sits below a forward-tilting line (the
 * lateral sulcus), and the remaining arc splits front to back.
 */
function classify(x: number, y: number): CortexRegionId {
  if (x > -0.45 && y < -0.14 - 0.1 * x) return 'temporal'
  if (x > 0.26) return 'frontal'
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
  const displaced = new Vector3()

  // IcosahedronGeometry is non-indexed, so vertices arrive three at a time and
  // every consecutive triple is one face.
  const points: number[][] = []
  for (let i = 0; i < position.count; i += 1) {
    unit.fromBufferAttribute(position, i).normalize()
    displace(unit, CEREBRUM.center, CEREBRUM.radius, sign, displaced)
    points.push([displaced.x, displaced.y, displaced.z])
  }
  source.dispose()

  const buckets = new Map<CortexRegionId, number[]>([
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
    if (bucket) bucket.push(...a, ...b, ...c)
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

/** Where a hemisphere's cerebrum mesh should be placed. */
export function cerebrumCenter(sign: number): [number, number, number] {
  return [CEREBRUM.center[0], CEREBRUM.center[1], CEREBRUM.center[2] * sign]
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

  geometry.computeVertexNormals()
  return geometry
}

/** World-space centre of a standalone structure. */
export function structureCenter(shape: LobeShape, sign = 1): [number, number, number] {
  return [shape.center[0], shape.center[1], shape.center[2] * sign]
}
