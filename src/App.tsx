import { useEffect, useRef, type ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Mission } from '@/components/sections/Mission'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FocusAreas } from '@/components/sections/FocusAreas'
import { CortexPreview } from '@/components/sections/CortexPreview'
import { useHashView, type ViewId } from '@/hooks/useHashView'

type SectionId = Exclude<ViewId, 'home'>

const VIEWS: Record<SectionId, { title: string; render: () => ReactNode }> = {
  about: { title: 'About us', render: () => <About /> },
  mission: { title: 'Mission', render: () => <Mission /> },
  'how-it-works': { title: 'How it works', render: () => <HowItWorks /> },
  'focus-areas': { title: 'Focus areas', render: () => <FocusAreas /> },
  cortex: { title: 'Cortex', render: () => <CortexPreview /> },
}

export default function App() {
  const { view, go } = useHashView()

  // Escape backs out of any view, the same as it closes a dialog.
  useEffect(() => {
    if (view === 'home') return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') go('home')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, go])

  return (
    // The page itself never scrolls. Views swap in place, and a view that is
    // taller than the window scrolls inside its own panel.
    <div className="flex h-dvh flex-col overflow-hidden">
      <a
        href="#main"
        className="focus:bg-signal-400 focus:text-ink-950 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:px-5 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Header onHome={() => go('home')} />

      <main id="main" className="min-h-0 flex-1">
        {view === 'home' ? (
          <Hero />
        ) : (
          <SectionView key={view} view={view} onBack={() => go('home')} />
        )}
      </main>
    </div>
  )
}

function SectionView({ view, onBack }: { view: SectionId; onBack: () => void }) {
  const panel = useRef<HTMLDivElement>(null)

  // Swapping a view is a navigation, but no page load happens, so focus would
  // otherwise stay on whatever was clicked — leaving a screen reader stranded
  // in the old view. Keyed by view in App, so this runs on every change.
  useEffect(() => {
    panel.current?.focus()
  }, [])

  return (
    <div
      ref={panel}
      tabIndex={-1}
      aria-label={VIEWS[view].title}
      className="h-full overflow-y-auto outline-none"
    >
      <div className="shell pt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-ink-400 hover:text-ink-50 group ease-out-soft inline-flex items-center gap-2 text-sm transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <path d="m11 18-6-6 6-6" />
          </svg>
          Back to the brain
        </button>
      </div>

      <div className="pt-10 pb-24">{VIEWS[view].render()}</div>
    </div>
  )
}
