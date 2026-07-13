import { ButtonLink } from '@/components/ui/Button'
import { NeuralField } from '@/components/ui/NeuralField'

const PRINCIPLES = [
  { label: 'Free', detail: 'Every report, for anyone, forever.' },
  { label: 'Open', detail: 'Methods and data published in full.' },
  { label: 'Independent', detail: 'No recruiters. No sponsored roles.' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient layers, back to front: colour wash, constellation, grain-free vignette. */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-signal-500/12 animate-drift absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full blur-[120px]" />
        <div className="bg-synapse-500/12 animate-drift absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full blur-[120px] [animation-delay:-8s]" />
        <div className="from-ink-950 via-ink-950/40 to-ink-950 absolute inset-0 bg-linear-to-b" />
      </div>

      <NeuralField className="-z-10 opacity-70" />

      <div className="shell relative py-24 sm:py-32 lg:py-40">
        <p className="eyebrow">Nonprofit &middot; Independent research</p>

        <h1 className="text-hero mt-7 max-w-5xl">
          Research where your skills{' '}
          <span className="from-signal-300 via-signal-400 to-synapse-400 bg-linear-to-r bg-clip-text text-transparent italic">
            do the most good
          </span>
          .
        </h1>

        <p className="text-ink-300 mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl">
          Most people never find out which problems their skills could actually solve. We study the
          connection between what you already know how to do and the work the world needs doing —
          then hand you the map.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="#signup">Get early access</ButtonLink>
          <ButtonLink href="#how-it-works" variant="outline">
            How the research works
          </ButtonLink>
        </div>

        <dl className="hairline mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <div key={principle.label} className="bg-ink-900/40 px-6 py-5 backdrop-blur-sm">
              <dt className="font-display text-ink-50 text-2xl">{principle.label}</dt>
              <dd className="text-ink-400 mt-1 text-sm leading-relaxed">{principle.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
