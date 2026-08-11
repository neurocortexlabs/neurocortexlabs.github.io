import {
  Suspense,
  lazy,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react'
import { NeuralField } from '@/components/ui/NeuralField'
import { brainRegions, navigableRegions } from '@/components/brain/brainRegions'
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

  const labelRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef({ x: 0, y: 0 })

  const place = useCallback((x: number, y: number, bounds: DOMRect) => {
    const label = labelRef.current
    if (!label) return
    label.style.transform = `translate3d(${x}px, ${y}px, 0)`
    // Flip to the cursor's left near the right edge so the card stays on screen.
    label.dataset.flip = x > bounds.width - 260 ? 'true' : 'false'
  }, [])

  /**
   * The label follows the cursor by writing a transform straight to the DOM
   * rather than going through state. Pointer moves fire on every frame, and
   * re-rendering a React tree containing a WebGL canvas at that rate is a
   * needless way to lose frames. Only the label's *contents* come from state,
   * and those change once per region.
   */
  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      pointerRef.current = { x, y }
      place(x, y, bounds)
    },
    [place],
  )

  const active = brainRegions.find((region) => region.id === hovered) ?? null

  // The label mounts in response to a hover, which means it did not exist
  // during the pointer event that would have positioned it — and if the cursor
  // then holds still, no further event arrives and it sits at the corner. So
  // place it from the last known pointer position the moment it appears.
  useLayoutEffect(() => {
    const stage = ref.current
    if (!stage || !active) return
    place(pointerRef.current.x, pointerRef.current.y, stage.getBoundingClientRect())
  }, [active, place, ref])

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      className="relative min-h-0 w-full flex-1"
    >
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
        Hover label. `group` on the wrapper drives the flip via data-flip, and
        the whole thing is pointer-events-none so it can never sit between the
        cursor and the lobe it is describing.
      */}
      {active ? (
        <div
          ref={labelRef}
          data-flip="false"
          aria-hidden="true"
          className="group pointer-events-none absolute top-0 left-0 z-20 will-change-transform"
        >
          <div className="hairline bg-ink-950/90 w-max max-w-[16rem] -translate-y-1/2 translate-x-5 rounded-xl border px-3.5 py-2.5 shadow-xl shadow-black/50 backdrop-blur-md group-data-[flip=true]:-translate-x-[calc(100%+1.25rem)]">
            <p
              className="font-mono text-[0.625rem] tracking-[0.18em] uppercase"
              style={{ color: active.color }}
            >
              {active.name}
            </p>
            {active.section ? (
              <p className="text-ink-50 mt-1 text-sm font-medium">{active.section}</p>
            ) : null}
            <p className="text-ink-400 mt-1 text-xs leading-relaxed">{active.role}</p>
          </div>
        </div>
      ) : null}

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
