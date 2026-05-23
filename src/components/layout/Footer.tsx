import { Logomark } from '@/components/ui/Logomark'
import { footerLinks, site } from '@/content/site'

export function Footer() {
  return (
    <footer className="hairline border-t">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <Logomark className="h-7 w-7" />
            <span className="font-display text-ink-50 text-lg tracking-tight">{site.name}</span>
          </div>
          <p className="text-ink-400 mt-4 text-sm leading-relaxed">{site.description}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-signal-400 hover:text-signal-300 mt-5 inline-block font-mono text-sm transition-colors"
          >
            {site.email}
          </a>
        </div>

        {footerLinks.map((group) => (
          <div key={group.heading}>
            <h2 className="font-sans text-ink-500 text-xs font-medium tracking-[0.18em] uppercase">
              {group.heading}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-ink-300 hover:text-ink-50 text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="hairline border-t">
        <div className="shell text-ink-500 flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.foundedYear} {site.name}. Research published free, for anyone.
          </p>
          <p>Built in the open.</p>
        </div>
      </div>
    </footer>
  )
}
