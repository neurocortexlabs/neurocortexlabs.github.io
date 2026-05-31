export type FocusAreaIcon = 'climate' | 'health' | 'education' | 'shelter' | 'civic' | 'justice'
export type FocusAreaAccent = 'signal' | 'synapse' | 'ember'

export type FocusArea = {
  id: string
  icon: FocusAreaIcon
  accent: FocusAreaAccent
  title: string
  description: string
  skills: string[]
}

export const focusAreas: FocusArea[] = [
  {
    id: 'climate',
    icon: 'climate',
    accent: 'signal',
    title: 'Climate & energy',
    description:
      'The build-out is bottlenecked on paperwork and people, not physics. Permitting, interconnection queues, and field crews are where projects stall.',
    skills: ['project scheduling', 'GIS', 'regulatory writing', 'field ops'],
  },
  {
    id: 'health',
    icon: 'health',
    accent: 'synapse',
    title: 'Public health',
    description:
      'Most of the system runs on data nobody owns. Departments need people who can make records legible before they need another dashboard.',
    skills: ['data cleaning', 'SQL', 'epidemiology', 'community outreach'],
  },
  {
    id: 'education',
    icon: 'education',
    accent: 'ember',
    title: 'Education access',
    description:
      'The material exists. Getting it to students who need it — in the right language, on the device they actually have — is the unsolved part.',
    skills: ['curriculum design', 'accessibility', 'translation', 'tutoring ops'],
  },
  {
    id: 'shelter',
    icon: 'shelter',
    accent: 'signal',
    title: 'Housing & food security',
    description:
      'Warehouse-scale logistics problems run by teams of six. Anyone who has managed inventory or routing is more useful here than they know.',
    skills: ['logistics', 'inventory', 'case management', 'grant writing'],
  },
  {
    id: 'civic',
    icon: 'civic',
    accent: 'synapse',
    title: 'Civic technology',
    description:
      'Benefits people are entitled to go unclaimed because the form is confusing. Service design and plain-language writing move real numbers.',
    skills: ['service design', 'plain language', 'legacy systems', 'user research'],
  },
  {
    id: 'justice',
    icon: 'justice',
    accent: 'ember',
    title: 'Rights & justice',
    description:
      'Advocacy work is drowning in documents. Records analysis and careful, secure handling of sensitive material are chronically short-staffed.',
    skills: ['records analysis', 'paralegal ops', 'infosec', 'translation'],
  },
]
