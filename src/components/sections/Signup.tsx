import { useState, type FormEvent } from 'react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/content/site'

const ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function Signup() {
  return (
    <section id="signup" className="hairline scroll-mt-24 border-t py-24 sm:py-32">
      <div className="shell">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl">
            {/* Gradient hairline: a bright border drawn as a masked background. */}
            <div
              aria-hidden="true"
              className="from-signal-400/40 via-synapse-400/30 to-ember-400/20 absolute inset-0 -z-10 bg-linear-to-br"
            />
            <div className="bg-ink-950 absolute inset-px -z-10 rounded-[calc(1.5rem-1px)]" />
            <div
              aria-hidden="true"
              className="bg-signal-500/10 absolute -top-32 left-1/3 -z-10 h-80 w-80 rounded-full blur-[100px]"
            />

            <div className="px-8 py-14 text-center sm:px-14 sm:py-20">
              <p className="eyebrow">Get the research</p>
              <h2 className="text-section mx-auto mt-5 max-w-2xl">
                We will tell you when Cortex opens.
              </h2>
              <p className="text-ink-400 mx-auto mt-6 max-w-xl text-lg leading-relaxed">
                One email when the assistant goes live, and one when we publish something worth your
                time. Nothing else, and never a list we sell.
              </p>

              <div className="mx-auto mt-10 max-w-md">
                {ENDPOINT ? <SignupForm endpoint={ENDPOINT} /> : <MailtoFallback />}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function SignupForm({ endpoint }: { endpoint: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const email = new FormData(form).get('email')

    if (typeof email !== 'string' || !email) return

    setStatus('submitting')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!response.ok) throw new Error(`Signup failed with status ${response.status}`)
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="border-signal-400/30 bg-signal-400/10 text-signal-200 rounded-2xl border px-6 py-4 text-sm">
        You are on the list. We will be in touch when there is something to say.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="signup-email" className="sr-only">
          Email address
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          disabled={status === 'submitting'}
          className="hairline bg-ink-900/70 text-ink-100 placeholder:text-ink-600 focus:border-signal-400/50 h-11 flex-1 rounded-full border px-5 text-[0.9375rem] transition-colors outline-none disabled:opacity-60"
        />
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Signing up…' : 'Keep me posted'}
        </Button>
      </div>

      {status === 'error' ? (
        <p role="alert" className="text-ember-300 mt-4 text-sm">
          That did not go through. Email us instead at{' '}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      ) : null}
    </form>
  )
}

/**
 * Pages is static hosting, so with no form endpoint configured there is nothing
 * honest to submit to. A mailto keeps the call to action real.
 */
function MailtoFallback() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonLink href={`mailto:${site.email}?subject=Keep%20me%20posted%20about%20Cortex`}>
        Email us to join the list
      </ButtonLink>
      <p className="text-ink-600 font-mono text-xs">{site.email}</p>
    </div>
  )
}
