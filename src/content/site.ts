export const site = {
  name: 'Neurocortex Labs',
  shortName: 'Neurocortex',
  tagline: 'Research where your skills do the most good.',
  description:
    'Neurocortex Labs is a nonprofit research group. We study how ordinary skills map onto work that helps people — and we give that research away free.',
  email: 'hello@neurocortexlabs.org',
  foundedYear: 2026,
} as const

export const navLinks = [
  { label: 'Mission', href: '#mission' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Focus areas', href: '#focus-areas' },
  { label: 'Cortex', href: '#cortex' },
] as const

export const footerLinks = [
  {
    heading: 'Research',
    links: [
      { label: 'Focus areas', href: '#focus-areas' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Cortex assistant', href: '#cortex' },
      { label: 'Get updates', href: '#signup' },
    ],
  },
  {
    heading: 'Organization',
    links: [
      { label: 'Mission', href: '#mission' },
      { label: 'Contact', href: `mailto:${site.email}` },
      {
        label: 'Source on GitHub',
        href: 'https://github.com/aaronhhsi/neurocortex-labs',
      },
    ],
  },
] as const
