import { SectionHeading } from '@/components/ui/SectionHeading'
import { FocusIcon } from '@/components/ui/FocusIcon'
import { Reveal } from '@/components/ui/Reveal'
import { focusAreas, type FocusArea, type FocusAreaAccent } from '@/content/focusAreas'

/**
 * Accent classes are written out in full rather than interpolated — Tailwind
 * scans source text, so `text-${accent}-400` would never make it into the build.
 */
const ACCENTS: Record<FocusAreaAccent, { icon: string; glow: string; border: string }> = {
  signal: {
    icon: 'text-signal-400 bg-signal-400/10',
    glow: 'hover:shadow-[0_0_60px_-24px_var(--color-signal-400)]',
    border: 'hover:border-signal-400/35',
  },
  synapse: {
    icon: 'text-synapse-400 bg-synapse-400/10',
    glow: 'hover:shadow-[0_0_60px_-24px_var(--color-synapse-400)]',
    border: 'hover:border-synapse-400/35',
  },
  ember: {
    icon: 'text-ember-400 bg-ember-400/10',
    glow: 'hover:shadow-[0_0_60px_-24px_var(--color-ember-400)]',
    border: 'hover:border-ember-400/35',
  },
}

export function FocusAreas() {
  return (
    <section id="focus-areas">
      <div className="shell">
        <Reveal>
          <SectionHeading
            eyebrow="Focus areas"
            title="Where we have looked so far."
            lead="These are the sectors we have published on, not the limit of what we will look at. Each is short of people in ways that rarely show up in a job title — and so are plenty of fields not on this list yet."
          />
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {focusAreas.map((area, index) => (
            <FocusCard key={area.id} area={area} delay={(index % 3) * 100} />
          ))}
        </div>
      </div>

      <Reveal className="shell">
        <p className="text-ink-400 mt-10 max-w-2xl text-sm leading-relaxed">
          The method is not tied to this list. If your field is not here, that usually means nobody
          has written it up yet rather than that there is nothing to find —{' '}
          <a
            href="#start"
            className="text-signal-400 hover:text-signal-300 underline-offset-4 transition-colors hover:underline"
          >
            tell us what you can do
          </a>{' '}
          and we will go looking.
        </p>
      </Reveal>
    </section>
  )
}

/**
 * The reveal lives on a wrapper rather than the card itself: both effects want
 * to animate `translate`, and a 700ms reveal makes a hover lift feel broken.
 */
function FocusCard({ area, delay }: { area: FocusArea; delay: number }) {
  const accent = ACCENTS[area.accent]

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`hairline bg-ink-900/30 ease-out-soft h-full rounded-2xl border p-7 transition duration-300 hover:-translate-y-1 ${accent.border} ${accent.glow}`}
      >
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.icon}`}>
          <FocusIcon name={area.icon} className="h-5.5 w-5.5" />
        </span>

        <h3 className="font-display text-ink-50 mt-6 text-2xl">{area.title}</h3>
        <p className="text-ink-400 mt-3 leading-relaxed">{area.description}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {area.skills.map((skill) => (
            <li
              key={skill}
              className="hairline text-ink-400 rounded-full border px-2.5 py-1 font-mono text-xs"
            >
              {skill}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}
