import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

const PRINCIPLES = [
  { label: 'Free', detail: 'Every report, for anyone, forever.' },
  { label: 'Open', detail: 'Methods and data published in full.' },
  { label: 'Independent', detail: 'No recruiters. No sponsored roles.' },
]

/**
 * The value proposition the splash hero no longer has room for. Everything
 * here used to live under the headline; the brain took that space, so the
 * argument for reading on starts one scroll down instead.
 */
export function Overview() {
  return (
    <section id="overview" className="hairline scroll-mt-24 border-t py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <p className="text-ink-200 max-w-3xl text-xl leading-relaxed sm:text-2xl">
            Most people never find out which problems their skills could actually solve. We study
            the connection between what you already know how to do and the work the world needs
            doing — then hand you the map.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#signup">Get early access</ButtonLink>
            <ButtonLink href="#how-it-works" variant="outline">
              How the research works
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="hairline mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.label} className="bg-ink-900/40 px-6 py-5 backdrop-blur-sm">
                <dt className="font-display text-ink-50 text-2xl">{principle.label}</dt>
                <dd className="text-ink-400 mt-1 text-sm leading-relaxed">{principle.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
