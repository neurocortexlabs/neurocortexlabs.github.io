import { useEffect, useState } from 'react'
import { Logomark } from '@/components/ui/Logomark'
import { ButtonLink } from '@/components/ui/Button'
import { navLinks, site } from '@/content/site'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the menu, and the page behind it should not scroll while the
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
  // behind it strands focus and re-locks scroll on the way back down.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? 'bg-ink-950/80 hairline border-b backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex h-20 items-center justify-between">
        <a
          href="#top"
          className="group flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <Logomark className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-ink-50 text-xl tracking-tight">{site.name}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-ink-300 hover:text-ink-50 rounded-full px-4 py-2 text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="#signup" size="sm">
            Get early access
          </ButtonLink>
        </div>

        <button
          type="button"
          className="text-ink-200 hover:text-ink-50 -mr-2 p-2 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="hairline bg-ink-950/95 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t backdrop-blur-xl md:hidden"
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
          <ButtonLink href="#signup" className="mt-3" onClick={() => setMenuOpen(false)}>
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
