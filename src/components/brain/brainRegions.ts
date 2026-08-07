import type { CortexRegionId } from '@/components/brain/geometry'

/**
 * The brain doubles as the site's navigation, so every interactive lobe has to
 * earn its mapping twice: it must be where that lobe actually sits, and what
 * that lobe actually does has to rhyme with the section it opens.
 *
 * Axes: +x anterior (front), +y superior (up), +z right. One unit ≈ half the
 * length of the organ; the camera framing in BrainScene assumes this.
 *
 * Cortical regions have no geometry of their own — they are sectors carved out
 * of the shared cerebrum surface in geometry.ts. Only the cerebellum and brain
 * stem, which really are separate masses, carry their own shape.
 */

export type LobeShape = {
  center: [number, number, number]
  /** Ellipsoid radii, before the shared fold field displaces the surface. */
  radius: [number, number, number]
  /** Mirrored onto the left hemisphere. False for midline structures. */
  mirrored: boolean
}

type RegionBase = {
  /** Anatomical name, shown on hover. */
  name: string
  /** What this region does, and why it maps to the section. */
  role: string
  /** Section anchor, or null for structures that are not navigation. */
  href: string | null
  /** Nav label of the target section. */
  section: string | null
  /** Hex from the Tailwind palette in index.css — kept in sync by hand. */
  color: string
}

export type BrainRegion = RegionBase &
  (
    | { kind: 'cortex'; id: CortexRegionId; shape?: undefined }
    | { kind: 'structure'; id: string; shape: LobeShape }
  )

export const brainRegions: BrainRegion[] = [
  {
    kind: 'cortex',
    id: 'frontal',
    name: 'Frontal lobe',
    role: 'Judgment and planning — deciding what is worth doing',
    href: '#mission',
    section: 'Mission',
    color: '#38dcc2', // signal-400
  },
  {
    kind: 'cortex',
    id: 'parietal',
    name: 'Parietal lobe',
    role: 'Integrating separate signals into one map',
    href: '#how-it-works',
    section: 'How it works',
    color: '#a78bfa', // synapse-400
  },
  {
    kind: 'cortex',
    id: 'temporal',
    name: 'Temporal lobe',
    role: 'Memory and meaning — everything you already know',
    href: '#focus-areas',
    section: 'Focus areas',
    color: '#f8b95c', // ember-400
  },
  {
    kind: 'cortex',
    id: 'occipital',
    name: 'Occipital lobe',
    role: 'Sight — seeing what was there the whole time',
    href: '#cortex',
    section: 'Cortex',
    color: '#b6f7ea', // signal-200
  },
  {
    kind: 'structure',
    id: 'cerebellum',
    name: 'Cerebellum',
    role: 'Practised skill, running without supervision',
    href: null,
    section: null,
    color: '#6d7da4', // ink-400
    shape: {
      center: [-0.66, -0.52, 0.26],
      radius: [0.34, 0.24, 0.24],
      mirrored: true,
    },
  },
  {
    kind: 'structure',
    id: 'stem',
    name: 'Brain stem',
    role: 'Everything that keeps going without being asked',
    href: null,
    section: null,
    color: '#6d7da4', // ink-400
    shape: {
      center: [-0.2, -0.72, 0],
      radius: [0.12, 0.3, 0.13],
      mirrored: false,
    },
  },
]

/** Only the regions that navigate — used for the legend and the a11y fallback. */
export const navigableRegions = brainRegions.filter(
  (region): region is BrainRegion & { href: string; section: string } =>
    region.href !== null && region.section !== null,
)
