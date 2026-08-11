import type { CortexRegionId } from '@/components/brain/geometry'
import type { ViewId } from '@/hooks/useHashView'

/**
 * The brain *is* the site's navigation, so every interactive region has to earn
 * its mapping twice: it must be where that region actually sits, and what that
 * region actually does has to rhyme with the view it opens.
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
  /** What this region does, and why it maps to the view. */
  role: string
  /** View this region opens, or null for structures that are not navigation. */
  view: ViewId | null
  /** Short label for the view. */
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
    id: 'prefrontal',
    name: 'Prefrontal cortex',
    role: 'Identity and self-knowledge — who we are and why',
    view: 'about',
    section: 'About us',
    color: '#c4b5fd', // synapse-300
  },
  {
    kind: 'cortex',
    id: 'frontal',
    name: 'Frontal lobe',
    role: 'Intent and initiative — turning judgment into action',
    view: 'mission',
    section: 'Mission',
    color: '#38dcc2', // signal-400
  },
  {
    kind: 'cortex',
    id: 'parietal',
    name: 'Parietal lobe',
    role: 'Integrating separate signals into one map',
    view: 'how-it-works',
    section: 'How it works',
    color: '#a78bfa', // synapse-400
  },
  {
    kind: 'cortex',
    id: 'temporal',
    name: 'Temporal lobe',
    role: 'Memory and meaning — everything you already know',
    view: 'focus-areas',
    section: 'Focus areas',
    color: '#f8b95c', // ember-400
  },
  {
    kind: 'cortex',
    id: 'occipital',
    name: 'Occipital lobe',
    role: 'Sight — seeing what was there the whole time',
    view: 'cortex',
    section: 'Cortex',
    color: '#b6f7ea', // signal-200
  },
  {
    kind: 'structure',
    id: 'cerebellum',
    name: 'Cerebellum',
    role: 'Practised skill, running without supervision',
    view: null,
    section: null,
    color: '#6d7da4', // ink-400
    // Tucked under the occipital rather than behind it — pushed much further
    // back and it bulges past the rear profile and reads as a growth.
    shape: {
      center: [-0.55, -0.47, 0.25],
      radius: [0.3, 0.22, 0.23],
      mirrored: true,
    },
  },
  {
    kind: 'structure',
    id: 'stem',
    name: 'Brain stem',
    role: 'Everything that keeps going without being asked',
    view: null,
    section: null,
    color: '#6d7da4', // ink-400
    shape: {
      center: [-0.32, -0.68, 0],
      radius: [0.12, 0.28, 0.13],
      mirrored: false,
    },
  },
]

/** Only the regions that navigate — used for the fallback and screen-reader nav. */
export const navigableRegions = brainRegions.filter(
  (region): region is BrainRegion & { view: ViewId; section: string } =>
    region.view !== null && region.section !== null,
)
