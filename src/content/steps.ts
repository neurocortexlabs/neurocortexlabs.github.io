export type Step = {
  id: string
  index: string
  title: string
  summary: string
  detail: string
}

export const steps: Step[] = [
  {
    id: 'inventory',
    index: '01',
    title: 'Inventory',
    summary: 'Start with what you can actually do.',
    detail:
      'Not your job title — the underlying capabilities. Scheduling around constraints. Explaining hard things to tired people. Keeping a fragile system running. Titles hide these; we pull them out.',
  },
  {
    id: 'map',
    index: '02',
    title: 'Map',
    summary: 'Match those capabilities against real unmet need.',
    detail:
      'We maintain research on what each impact sector is short of, in the language of skills rather than postings. Your inventory gets matched against that, including the fields you would never have thought to look at.',
  },
  {
    id: 'route',
    index: '03',
    title: 'Route',
    summary: 'Leave with a next step, not a feeling.',
    detail:
      'Specific roles, the kinds of organizations that hire for them, what the work is really like day to day, and an honest read on the distance between where you are and where you would need to be.',
  },
]
