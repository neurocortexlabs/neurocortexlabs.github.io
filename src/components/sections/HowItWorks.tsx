import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { revealClass, useInView } from '@/hooks/useInView'
import { steps, type Step } from '@/content/steps'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="hairline scroll-mt-24 border-t py-24 sm:py-32">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="How the research works"
            title="Three steps, and none of them are &ldquo;follow your passion.&rdquo;"
            lead="The method is deliberately boring. Boring methods are the ones that survive contact with a real career."
          />
        </Reveal>

        <ol className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {/* The thread connecting the steps — desktop only, purely decorative. */}
          <div
            aria-hidden="true"
            className="via-signal-400/40 absolute top-7 right-8 left-8 hidden h-px bg-gradient-to-r from-transparent to-transparent lg:block"
          />

          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} delay={index * 120} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function StepCard({ step, delay }: { step: Step; delay: number }) {
  const { ref, inView } = useInView<HTMLLIElement>()

  return (
    <li
      ref={ref}
      className={revealClass(inView, 'relative')}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <div className="flex items-center gap-4">
        <span className="border-signal-400/30 bg-ink-950 text-signal-400 relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border font-mono text-sm">
          {step.index}
        </span>
        <h3 className="font-display text-ink-50 text-3xl">{step.title}</h3>
      </div>

      <p className="text-ink-100 mt-6 text-lg leading-snug">{step.summary}</p>
      <p className="text-ink-400 mt-3 leading-relaxed">{step.detail}</p>
    </li>
  )
}
