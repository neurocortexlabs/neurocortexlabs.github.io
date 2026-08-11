import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { site } from '@/content/site'

const ENDPOINT = import.meta.env.VITE_INTAKE_ENDPOINT

const ACCEPTED = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt']
const MAX_BYTES = 5 * 1024 * 1024

type Status = 'idle' | 'submitting' | 'success' | 'error'

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} kB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * The intake form: a résumé, plus the things a résumé never captures.
 *
 * The second field is the point of the whole exercise. A résumé lists job
 * titles, and job titles are exactly what hides the transferable skill — so the
 * form asks separately for what someone can do that their work history does not
 * show.
 */
export function Start() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0] ?? null
    if (!picked) {
      setFile(null)
      setFileError(null)
      return
    }

    const extension = picked.name.slice(picked.name.lastIndexOf('.')).toLowerCase()
    if (!ACCEPTED.includes(extension)) {
      setFile(null)
      setFileError(`That is a ${extension || 'unknown'} file. Use ${ACCEPTED.join(', ')}.`)
      return
    }
    if (picked.size > MAX_BYTES) {
      setFile(null)
      setFileError(`That file is ${formatSize(picked.size)}. The limit is 5 MB.`)
      return
    }

    setFileError(null)
    setFile(picked)
  }

  function clearFile() {
    setFile(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ENDPOINT) return

    const body = new FormData(event.currentTarget)
    setStatus('submitting')
    try {
      const response = await fetch(ENDPOINT, { method: 'POST', body })
      if (!response.ok) throw new Error(`Intake failed with status ${response.status}`)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="shell">
        <div className="border-signal-400/30 bg-signal-400/10 max-w-2xl rounded-2xl border px-6 py-5">
          <h2 className="font-display text-ink-50 text-2xl">That is with us.</h2>
          <p className="text-ink-300 mt-2 leading-relaxed">
            We will come back to you with roles and sectors that fit what you can actually do.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="shell">
      <Reveal>
        <SectionHeading
          eyebrow="Try it now"
          title="Tell us what you can do."
          lead="Send your résumé if you have one, and — more usefully — everything it leaves out. We will map it against the sectors that are short of exactly that."
        />
      </Reveal>

      <Reveal delay={100}>
        {/* Stated before the fields rather than after, so nobody types a
            history of their working life into something that discards it. */}
        {!ENDPOINT ? (
          <p
            role="status"
            className="border-ember-400/30 bg-ember-400/10 text-ember-200 mt-10 max-w-2xl rounded-2xl border px-5 py-4 text-sm leading-relaxed"
          >
            <span className="font-medium">This form is a preview.</span> Cortex is not live yet, so
            there is nowhere to send this and the submit button is disabled. Nothing you type or
            attach here leaves your browser. To reach us in the meantime, email{' '}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-8">
          <div>
            <label htmlFor="intake-resume" className="text-ink-100 block text-sm font-medium">
              Your résumé <span className="text-ink-500 font-normal">— optional</span>
            </label>
            <p className="text-ink-500 mt-1 text-sm">
              {ACCEPTED.join(', ')}, up to 5 MB. Plain text is fine.
            </p>

            <input
              ref={inputRef}
              id="intake-resume"
              name="resume"
              type="file"
              accept={ACCEPTED.join(',')}
              onChange={handleFile}
              aria-describedby={fileError ? 'intake-resume-error' : undefined}
              className="file:bg-ink-800 file:text-ink-100 hover:file:bg-ink-700 text-ink-400 mt-3 block w-full cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
            />

            {file ? (
              <p className="hairline text-ink-300 mt-3 flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm">
                <span className="truncate">{file.name}</span>
                <span className="text-ink-600 shrink-0 font-mono text-xs">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-ink-500 hover:text-ink-100 ml-auto shrink-0 text-xs underline underline-offset-4"
                >
                  Remove
                </button>
              </p>
            ) : null}

            {fileError ? (
              <p id="intake-resume-error" role="alert" className="text-ember-300 mt-3 text-sm">
                {fileError}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="intake-skills" className="text-ink-100 block text-sm font-medium">
              What can you do that your résumé does not show?
            </label>
            <p className="text-ink-500 mt-1 text-sm leading-relaxed">
              This is the part we actually need. Languages, things you organise for other people,
              software you taught yourself, what you fix when it breaks, what people ask you for.
            </p>
            <textarea
              id="intake-skills"
              name="skills"
              rows={6}
              placeholder="I run the logistics for a 200-person food drive every year. I read Tagalog. I am the person everyone sends the broken spreadsheet to."
              className="hairline bg-ink-900/70 text-ink-100 placeholder:text-ink-600 focus:border-signal-400/50 mt-3 w-full rounded-2xl border px-4 py-3 text-[0.9375rem] leading-relaxed transition-colors outline-none"
            />
          </div>

          <div>
            <label htmlFor="intake-email" className="text-ink-100 block text-sm font-medium">
              Where should we reply?
            </label>
            <input
              id="intake-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="hairline bg-ink-900/70 text-ink-100 placeholder:text-ink-600 focus:border-signal-400/50 mt-3 h-11 w-full max-w-sm rounded-full border px-5 text-[0.9375rem] transition-colors outline-none"
            />
          </div>

          <div className="hairline flex flex-wrap items-center gap-4 border-t pt-6">
            <Button type="submit" disabled={!ENDPOINT || status === 'submitting'}>
              {!ENDPOINT
                ? 'Not accepting submissions yet'
                : status === 'submitting'
                  ? 'Sending…'
                  : 'Send it over'}
            </Button>
            <p className="text-ink-600 text-xs leading-relaxed">
              We will never sell this, and never pass it to a recruiter.
            </p>
          </div>

          {status === 'error' ? (
            <p role="alert" className="text-ember-300 text-sm">
              That did not go through. Email us instead at{' '}
              <a href={`mailto:${site.email}`} className="underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          ) : null}
        </form>
      </Reveal>
    </div>
  )
}
