import { BrainStage } from '@/components/brain/BrainStage'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-5rem)] flex-col items-center overflow-hidden py-8">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-signal-500/10 animate-drift absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full blur-[120px]" />
        <div className="bg-synapse-500/10 animate-drift absolute -top-24 -right-24 h-[30rem] w-[30rem] rounded-full blur-[120px] [animation-delay:-8s]" />
        <div className="from-ink-950/0 to-ink-950 absolute inset-0 bg-linear-to-b" />
      </div>

      <p className="eyebrow shrink-0 px-6 text-center">Nonprofit &middot; Independent research</p>

      {/*
        The brain claims every pixel the fixed elements around it do not, so it
        grows with the window rather than sitting in a fixed box, and it ignores
        the usual `shell` width cap for the same reason.

        `flex-1` alone is not enough: on a short window the leftover is smaller
        than the fixed 36rem box this replaced, so the brain would shrink as the
        window did. The floor guarantees it a share of the viewport regardless,
        and the hero simply grows past one screen when it has to — which the
        "Start here" cue already invites.
      */}
      <div className="mt-4 flex min-h-[max(15rem,min(64vh,50rem))] w-full min-w-0 flex-1 px-4 sm:px-8">
        <BrainStage />
      </div>

      <h1 className="text-hero mt-6 max-w-4xl shrink-0 px-6 text-center text-balance">
        Research where your skills{' '}
        <span className="from-signal-300 via-signal-400 to-synapse-400 bg-linear-to-r bg-clip-text text-transparent italic">
          do the most good
        </span>
        .
      </h1>

      <a
        href="#overview"
        className="text-ink-500 hover:text-ink-200 group mt-7 flex shrink-0 flex-col items-center gap-2 text-xs tracking-[0.18em] uppercase transition-colors"
      >
        Start here
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="ease-out-soft h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
        >
          <path d="M12 5v14" />
          <path d="m6 13 6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
