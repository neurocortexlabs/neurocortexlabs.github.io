import { Suspense, lazy, useCallback, useState } from 'react'
import { NeuralField } from '@/components/ui/NeuralField'
import { brainRegions, navigableRegions } from '@/components/brain/brainRegions'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// three.js is by far the heaviest thing on the site. Keeping it behind a lazy
// boundary means the headline, copy and CTAs paint on the initial bundle and
// the scene arrives afterwards, rather than holding up first paint.
const BrainScene = lazy(() => import('@/components/brain/BrainScene'))

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

function detectQuality(): 'low' | 'high' {
  const cores = navigator.hardwareConcurrency ?? 4
  return window.innerWidth < 768 || cores <= 4 ? 'low' : 'high'
}

export function BrainStage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [supportsWebGL] = useState(detectWebGL)
  const [quality] = useState(detectQuality)
  const reducedMotion = usePrefersReducedMotion()

  // Not `once` — the render loop should stop once the hero is scrolled past.
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    rootMargin: '200px',
    threshold: 0,
  })

  const handleSelect = useCallback((href: string) => {
    const target = document.querySelector(href)
    if (!target) return
    // Mirror what an anchor would do, so the position stays shareable.
    window.history.pushState(null, '', href)
    target.scrollIntoView({ block: 'start' })
  }, [])

  const active = brainRegions.find((region) => region.id === hovered) ?? null

  return (
    <div ref={ref} className="flex w-full flex-col items-center">
      <div className="relative aspect-square w-full max-w-[min(80vw,32rem)] sm:max-w-[min(60vw,36rem)]">
        {/* Ambient wash behind the organ so it never floats on flat black. */}
        <div
          aria-hidden="true"
          className="bg-signal-500/12 absolute inset-[12%] rounded-full blur-[80px]"
        />

        {supportsWebGL ? (
          <Suspense fallback={<NeuralField className="opacity-40" />}>
            <BrainScene
              hovered={hovered}
              onHover={setHovered}
              onSelect={handleSelect}
              reducedMotion={reducedMotion}
              quality={quality}
              active={inView}
            />
          </Suspense>
        ) : (
          <NeuralField className="opacity-60" />
        )}
      </div>

      {/* Fixed height: the caption changes on every hover and must not shove
          the legend and headline around while it does. */}
      <p
        aria-live="polite"
        className="text-ink-400 mt-6 flex min-h-12 max-w-md items-center justify-center px-4 text-center text-sm leading-relaxed"
      >
        {active ? (
          <span>
            <span className="text-ink-100">{active.name}</span>
            <span className="text-ink-600"> — </span>
            {active.role}
          </span>
        ) : (
          <span className="text-ink-500">
            {supportsWebGL
              ? 'Every lobe opens a part of the site. Drag to turn it.'
              : 'Every lobe opens a part of the site.'}
          </span>
        )}
      </p>

      {/* The legend is the accessible path to the same navigation: real links,
          keyboard reachable, and the only version that exists without WebGL.
          Hovering a chip lights the matching lobe, so the two stay in sync. */}
      <ul className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {navigableRegions.map((region) => {
          const isActive = hovered === region.id
          return (
            <li key={region.id}>
              <a
                href={region.href}
                onMouseEnter={() => setHovered(region.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(region.id)}
                onBlur={() => setHovered(null)}
                className={`hairline ease-out-soft flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition duration-200 ${
                  isActive
                    ? 'border-ink-100/25 bg-ink-100/5 text-ink-50'
                    : 'text-ink-400 hover:text-ink-100'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full transition-transform duration-200"
                  style={{
                    backgroundColor: region.color,
                    boxShadow: isActive ? `0 0 12px ${region.color}` : 'none',
                    transform: isActive ? 'scale(1.35)' : 'scale(1)',
                  }}
                />
                {region.section}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
