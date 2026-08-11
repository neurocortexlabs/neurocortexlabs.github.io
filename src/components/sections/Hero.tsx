import { BrainStage } from '@/components/brain/BrainStage'

export function Hero() {
  return (
    <section className="relative isolate flex h-full flex-col items-center overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-signal-500/10 animate-drift absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full blur-[120px]" />
        <div className="bg-synapse-500/10 animate-drift absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full blur-[120px] [animation-delay:-8s]" />
        <div className="from-ink-950/0 to-ink-950 absolute inset-0 bg-linear-to-b" />
      </div>

      <p className="eyebrow shrink-0 px-6 text-center">Nonprofit &middot; Independent research</p>

      {/* Nothing scrolls, so the brain simply takes whatever the eyebrow and
          headline leave behind — which is most of the window. */}
      <div className="mt-4 flex min-h-32 w-full min-w-0 flex-1 px-4 sm:px-8">
        <BrainStage />
      </div>

      {/*
        One line from lg up. The size is tied to viewport width rather than a
        clamp on font size, because what has to fit is the *sentence*: at
        roughly 18em for these 44 characters, 5.3vw keeps it on one line at any
        width, and the cap stops it becoming a billboard on an ultrawide.
        Below lg there is no width to do that with, so it wraps instead.
      */}
      <h1 className="font-display text-ink-50 mt-6 shrink-0 px-6 text-center text-[clamp(2rem,6.5vw,3rem)] leading-[1.04] tracking-[-0.03em] text-balance lg:text-[min(5.3vw,5.5rem)] lg:leading-[1] lg:whitespace-nowrap">
        Research where your skills{' '}
        <span className="from-signal-300 via-signal-400 to-synapse-400 bg-linear-to-r bg-clip-text text-transparent italic">
          do the most good
        </span>
        .
      </h1>
    </section>
  )
}
