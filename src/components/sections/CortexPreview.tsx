import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Logomark } from '@/components/ui/Logomark'

type Message = { from: 'you' | 'cortex'; text: string }

/**
 * An illustration of the kind of exchange Cortex is being built for — not a
 * real transcript, and labelled as a preview everywhere it appears.
 */
const TRANSCRIPT: Message[] = [
  {
    from: 'you',
    text: "I've spent nine years doing warehouse inventory. I don't know what that's good for outside of retail.",
  },
  {
    from: 'cortex',
    text: 'More than you would think. Regional food bank networks run the same problem on harder settings — supply that arrives unannounced, stock that expires, and a workforce that changes every week.',
  },
  {
    from: 'cortex',
    text: 'Three roles map almost directly onto what you already do. Want me to walk through them, or start with what the day-to-day actually looks like?',
  },
]

const CAPABILITIES = [
  'Asks about what you have actually done, not what your résumé says',
  'Pulls from our published research rather than making things up',
  'Names specific roles, sectors and the gap you would need to close',
  'Free to use, with no account required',
]

export function CortexPreview() {
  return (
    <section id="cortex">
      <div className="shell">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="In development"
              title={
                <>
                  Meet <span className="text-signal-300 italic">Cortex</span>.
                </>
              }
              lead="The three-step method works, but reading about a method is not the same as being walked through one. Cortex is an assistant that does the walking."
            />

            <ul className="mt-8 space-y-4">
              {CAPABILITIES.map((capability) => (
                <li key={capability} className="flex gap-3">
                  <CheckIcon />
                  <span className="text-ink-300 leading-relaxed">{capability}</span>
                </li>
              ))}
            </ul>

            <p className="hairline text-ink-500 mt-8 border-t pt-6 text-sm leading-relaxed">
              Cortex is not live yet. The conversation below is an illustration of what we are
              building, not a recording of a real session.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <ChatPreview />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ChatPreview() {
  return (
    <div className="hairline bg-ink-900/50 overflow-hidden rounded-3xl border shadow-2xl shadow-black/40">
      <div className="hairline flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Logomark className="h-5 w-5" />
          <span className="text-ink-200 text-sm font-medium">Cortex</span>
        </div>
        <span className="border-ember-400/30 bg-ember-400/10 text-ember-300 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] tracking-wider uppercase">
          Preview
        </span>
      </div>

      <div className="space-y-4 p-5">
        {TRANSCRIPT.map((message, index) => (
          <Bubble key={index} message={message} />
        ))}

        <div className="flex justify-start">
          <div className="bg-ink-800/70 flex items-center gap-1.5 rounded-2xl rounded-bl-md px-4 py-3.5">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="bg-signal-300 animate-node-pulse h-1.5 w-1.5 rounded-full"
                style={{ animationDelay: `${dot * 0.4}s`, animationDuration: '2s' }}
              />
            ))}
            <span className="sr-only">Cortex is typing</span>
          </div>
        </div>
      </div>

      <div className="hairline border-t p-4">
        <div className="bg-ink-950/60 hairline flex items-center gap-3 rounded-full border px-5 py-3">
          <span className="text-ink-600 flex-1 text-sm">Cortex is not accepting messages yet</span>
          <span className="bg-ink-800 text-ink-600 flex h-8 w-8 items-center justify-center rounded-full">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </div>
  )
}

function Bubble({ message }: { message: Message }) {
  const fromYou = message.from === 'you'

  return (
    <div className={`flex ${fromYou ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          fromYou
            ? 'bg-signal-400/15 text-ink-100 rounded-br-md'
            : 'bg-ink-800/70 text-ink-300 rounded-bl-md'
        }`}
      >
        <span className="sr-only">{fromYou ? 'You: ' : 'Cortex: '}</span>
        {message.text}
      </p>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-signal-400 mt-1 h-4 w-4 shrink-0"
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M10 15.5v-11" />
      <path d="m5.5 9 4.5-4.5L14.5 9" />
    </svg>
  )
}
