import { useCallback, useEffect, useState } from 'react'

/**
 * The site is a set of views rather than a scrolling page: the brain is home,
 * and clicking a region opens that region's view in place of it.
 *
 * Routing rides on the URL hash rather than component state alone. That costs
 * nothing and buys the three things people expect from navigation — the back
 * button works, views are linkable, and a reload lands you where you were —
 * none of which a bare useState would give.
 */
export const VIEW_IDS = [
  'home',
  'start',
  'about',
  'mission',
  'how-it-works',
  'focus-areas',
  'cortex',
] as const

export type ViewId = (typeof VIEW_IDS)[number]

function isViewId(value: string): value is ViewId {
  return (VIEW_IDS as readonly string[]).includes(value)
}

function readHash(): ViewId {
  const hash = window.location.hash.replace(/^#/, '')
  return isViewId(hash) ? hash : 'home'
}

export function useHashView() {
  const [view, setView] = useState(readHash)

  useEffect(() => {
    const sync = () => setView(readHash())
    // hashchange covers link clicks; popstate covers the back button landing
    // on the home entry, which carries no hash to change.
    window.addEventListener('hashchange', sync)
    window.addEventListener('popstate', sync)
    return () => {
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('popstate', sync)
    }
  }, [])

  const go = useCallback((next: ViewId) => {
    if (next === 'home') {
      // Assigning an empty hash leaves a bare "#" in the address bar, so home
      // is pushed explicitly. pushState fires nothing, hence the manual set.
      window.history.pushState(null, '', window.location.pathname + window.location.search)
      setView('home')
      return
    }
    window.location.hash = next
  }, [])

  return { view, go }
}
