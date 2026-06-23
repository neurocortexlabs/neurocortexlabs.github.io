import { useEffect, useRef, useState } from 'react'

type Options = {
  /** How far into the viewport the element must travel before it counts. */
  rootMargin?: string
  threshold?: number
}

/**
 * Fires once, the first time an element scrolls into view, then stops
 * observing. Reveals are a first-impression effect — re-running them on the
 * way back up is just noise.
 *
 * Falls back to "already visible" where IntersectionObserver is unavailable,
 * so content is never trapped at opacity zero.
 */
export function useInView<T extends HTMLElement>({
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.12,
}: Options = {}) {
  const ref = useRef<T>(null)
  // Start visible where the observer does not exist, so the fallback costs no
  // extra render and content can never get stuck at opacity zero.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return { ref, inView }
}

const BASE =
  'transition-[opacity,translate] duration-700 ease-out-soft motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0'

/** Classes that pair with `useInView` to fade-and-lift an element into place. */
export function revealClass(inView: boolean, className = '') {
  const state = inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
  return `${BASE} ${state} ${className}`
}
