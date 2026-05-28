import { SectionHeading } from '@/components/ui/SectionHeading'

const OUTPUTS = [
  'Skill-to-impact maps for common professional backgrounds',
  'Plain-language briefs on what each impact sector actually needs',
  'Role guides: what the work is, who hires for it, what it pays',
  'The gaps — where demand is loud and supply is thin',
]

export function Mission() {
  return (
    <section id="mission" className="hairline scroll-mt-24 border-t py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Mission"
          title={
            <>
              Good intentions are common.
              <br />
              Good information is <span className="text-ink-400 italic">not</span>.
            </>
          }
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div className="text-ink-300 space-y-6 text-lg leading-relaxed">
            <p>
              Ask someone who wants to do meaningful work where they should start, and the honest
              answer is usually a shrug. The sectors that need help most are the worst at explaining
              what help they need. So a logistics coordinator never learns that food banks are
              starving for exactly her skill set, and a database admin never learns that half the
              public health system runs on spreadsheets nobody can maintain.
            </p>
            <p>
              That gap is not a motivation problem. It is a research problem — and research is a
              thing that can be done once and shared with everyone.
            </p>
            <p className="text-ink-200">
              So that is what Neurocortex Labs does. We study how ordinary skills map onto work that
              helps people, and we publish everything we find, free, with the methods attached.
            </p>
          </div>

          <div className="hairline bg-ink-900/40 rounded-3xl border p-8">
            <h3 className="font-sans text-ink-500 text-xs font-medium tracking-[0.18em] uppercase">
              What we publish
            </h3>
            <ul className="mt-6 space-y-4">
              {OUTPUTS.map((output) => (
                <li key={output} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="bg-signal-400 mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  />
                  <span className="text-ink-300 leading-relaxed">{output}</span>
                </li>
              ))}
            </ul>
            <p className="hairline text-ink-500 mt-8 border-t pt-6 text-sm leading-relaxed">
              We are not a job board and we do not take placement fees. Nothing we publish is
              influenced by who is hiring.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
