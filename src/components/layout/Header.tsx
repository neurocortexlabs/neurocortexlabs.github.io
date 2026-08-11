import { useEffect, useState } from 'react'
import { Logomark } from '@/components/ui/Logomark'
import { ButtonLink } from '@/components/ui/Button'
import { navLinks, site } from '@/content/site'

/**
 * The header is a fixed row in the app shell rather than a floating bar —
 * nothing scrolls underneath it any more, so it neither needs to be `fixed`
 * nor to react to scroll position.
 */
export function Header({ onHome }: { onHome: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the menu, and the view behind it should not scroll while the
  // panel covers it.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  // Resizing past the breakpoint hides the toggle; leaving the panel "open"
  // behind it strands focus.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="hairline bg-ink-950/80 relative z-50 shrink-0 border-b backdrop-blur-xl">
      <div className="shell flex h-20 items-center justify-between">
        <button
          type="button"
          className="group flex items-center gap-3"
          onClick={() => {
            setMenuOpen(false)
            onHome()
          }}
        >
          <Logomark className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-ink-50 text-xl tracking-tight">{site.name}</span>
          <span className="sr-only">— back to the brain</span>
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink-300 hover:text-ink-50 rounded-full px-3.5 py-2 text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="#about" size="sm">
            Get early access
          </ButtonLink>
        </div>

        <button
          type="button"
          className="text-ink-200 hover:text-ink-50 -mr-2 p-2 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {/* Absolute rather than in flow: the shell is a fixed-height column, so a
          panel in normal flow would squeeze the view below it. */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="hairline bg-ink-950/95 absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Primary" className="shell flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-ink-200 hover:bg-ink-100/5 hover:text-ink-50 rounded-xl px-3 py-3 text-base transition-colors"
            >
              {link.label}
            </a>
          ))}
          <ButtonLink href="#about" className="mt-3" onClick={() => setMenuOpen(false)}>
            Get early access
          </ButtonLink>
        </nav>
      </div>
    </header>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 8h16" />
          <path d="M4 16h16" />
        </>
      )}
    </svg>
  )
}
