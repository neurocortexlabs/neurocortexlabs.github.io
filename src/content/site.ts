export const site = {
  name: 'Neurocortex Labs',
  shortName: 'Neurocortex',
  tagline: 'Research where your skills do the most good.',
  description:
    'Neurocortex Labs is a nonprofit research group. We study how ordinary skills map onto work that helps people — and we give that research away free.',
  email: 'hello@neurocortexlabs.org',
  foundedYear: 2026,
} as const

/**
 * These mirror the navigable brain regions in brainRegions.ts, and are the
 * pointer-and-keyboard route to the same views the lobes open.
 */
export const navLinks = [
  { label: 'About us', href: '#about' },
  { label: 'Mission', href: '#mission' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Focus areas', href: '#focus-areas' },
  { label: 'Cortex', href: '#cortex' },
] as const
