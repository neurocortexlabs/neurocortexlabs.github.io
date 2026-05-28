import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  className?: string
}

export function SectionHeading({ eyebrow, title, lead, className = '' }: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-section mt-5">{title}</h2>
      {lead ? <p className="text-ink-400 mt-6 text-lg leading-relaxed">{lead}</p> : null}
    </div>
  )
}
