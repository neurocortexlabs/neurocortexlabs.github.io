import { Suspense, lazy, useCallback, useState } from 'react'
import { NeuralField } from '@/components/ui/NeuralField'
import { navigableRegions } from '@/components/brain/brainRegions'
import { useInView } from '@/hooks/useInView'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

// three.js is by far the heaviest thing on the site. Keeping it behind a lazy
// boundary means the headline paints on the initial bundle and the scene
// arrives afterwards, rather than holding up first paint.
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
  return window.innerWidth < 768 || cores <= 2 ? 'low' : 'high'
}

export function BrainStage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [supportsWebGL] = useState(detectWebGL)
  const [quality] = useState(detectQuality)
  const reducedMotion = usePrefersReducedMotion()

  // Not `once` — the render loop should stop if the canvas ever leaves view.
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    rootMargin: '200px',
    threshold: 0,
  })

  // Setting the hash is all it takes: the router in useHashView listens for it.
  // Going through the URL rather than a callback keeps this component unaware
  // of the routing, and means the brain and the header nav do the same thing.
  const handleSelect = useCallback((view: string) => {
    window.location.hash = view
  }, [])

  return (
    <div ref={ref} className="relative min-h-0 w-full flex-1">
      {/* Ambient wash behind the organ so it never floats on flat black. */}
      <div
        aria-hidden="true"
        className="bg-signal-500/12 absolute inset-[18%] rounded-full blur-[80px]"
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

      {/*
        The same navigation as the brain, in plain links.

        Once the primary navigation lives inside a canvas it is unreachable by
        keyboard and invisible to a screen reader, and it does not exist at all
        without WebGL. So this is always in the DOM — visually hidden when the
        scene is doing its job, and promoted to a visible fallback when it is
        not. The header carries the same links for pointer users.
      */}
      <nav
        aria-label="Brain regions"
        className={
          supportsWebGL
            ? 'sr-only'
            : 'absolute inset-0 flex flex-col items-center justify-center gap-3 px-6'
        }
      >
        {!supportsWebGL ? (
          <p className="text-ink-500 max-w-xs text-center text-sm">
            Your browser is not showing 3D graphics, so here are the same regions as links.
          </p>
        ) : null}
        <ul
          className={
            supportsWebGL ? undefined : 'flex flex-wrap items-center justify-center gap-2'
          }
        >
          {navigableRegions.map((region) => (
            <li key={region.id}>
              <a
                href={`#${region.view}`}
                className="hairline text-ink-300 hover:text-ink-50 rounded-full border px-3.5 py-2 text-sm transition-colors"
              >
                {region.section}
                <span className="sr-only"> — {region.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
