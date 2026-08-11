import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Signup } from '@/components/sections/Signup'
import { site } from '@/content/site'

const PRINCIPLES = [
  { label: 'Free', detail: 'Every report, for anyone, forever.' },
  { label: 'Open', detail: 'Methods and data published in full.' },
  { label: 'Independent', detail: 'No recruiters. No sponsored roles.' },
]

/**
 * Everything about the organization rather than the research: the pitch, the
 * principles, how to reach us, and the mailing list. It hangs off the
 * prefrontal cortex, which is as close as anatomy gets to a sense of self.
 */
export function About() {
  return (
    <div className="shell">
      <Reveal>
        <SectionHeading
          eyebrow="About us"
          title="A research group, not a job board."
          lead="Most people never find out which problems their skills could actually solve. We study the connection between what you already know how to do and the work the world needs doing — then hand you the map."
        />
      </Reveal>

      <Reveal delay={100}>
        <dl className="hairline mt-12 grid max-w-3xl gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div key={principle.label} className="bg-ink-900/40 px-6 py-5">
              <dt className="font-display text-ink-50 text-2xl">{principle.label}</dt>
              <dd className="text-ink-400 mt-1 text-sm leading-relaxed">{principle.detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={160}>
        <div className="hairline mt-14 grid gap-10 border-t pt-10 sm:grid-cols-2">
          <div>
            <h3 className="font-sans text-ink-500 text-xs font-medium tracking-[0.18em] uppercase">
              Contact
            </h3>
            <a
              href={`mailto:${site.email}`}
              className="text-signal-400 hover:text-signal-300 mt-3 inline-block font-mono text-sm transition-colors"
            >
              {site.email}
            </a>
            <p className="text-ink-500 mt-3 text-sm leading-relaxed">
              For anything sensitive, email us rather than opening an issue.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-ink-500 text-xs font-medium tracking-[0.18em] uppercase">
              Built in the open
            </h3>
            <a
              href="https://github.com/neurocortexlabs/neurocortexlabs.github.io"
              className="text-ink-300 hover:text-ink-50 mt-3 inline-block text-sm transition-colors"
            >
              Source on GitHub
            </a>
            <p className="text-ink-500 mt-3 text-sm leading-relaxed">
              © {site.foundedYear} {site.name}. Research published free, for anyone.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-16">
        <Signup />
      </div>
    </div>
  )
}
