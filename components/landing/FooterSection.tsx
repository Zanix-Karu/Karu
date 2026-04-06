import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

const LINK_HREFS: Record<string, string> = {
  privacy: '/privacy',
  terms: '/terms',
  contact: '/contact',
  instagram: 'https://instagram.com/zanix.cm',
}

export function FooterSection() {
  const t = useTranslations('footer')
  const rawLinks = t.raw('links') as Record<string, string>

  const links: FooterLink[] = Object.entries(rawLinks).map(([key, label]) => ({
    label,
    href: LINK_HREFS[key] ?? '#',
  }))

  const copyright = t('copyright', { year: new Date().getFullYear() })

  return (
    <footer className="bg-brown-dark border-t border-cream/10">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

        {/* ── Left: logo + tagline ── */}
        <div className="flex flex-col gap-2">
          <span className="font-serif text-amber tracking-widest text-xl uppercase">
            ZANIX
          </span>
          <p className="font-sans text-[0.78rem] text-cream/50">
            {t('tagline')}
          </p>
        </div>

        {/* ── Right: nav links + copyright ── */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map(({ label, href }) => {
                const isExternal = href.startsWith('http') || href.startsWith('mailto')
                return (
                  <li key={href}>
                    {isExternal ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-sans text-[0.78rem] font-medium tracking-[0.08em] uppercase text-cream/50 hover:text-amber transition-colors"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="font-sans text-[0.78rem] font-medium tracking-[0.08em] uppercase text-cream/50 hover:text-amber transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          <p className="font-sans text-[0.72rem] text-cream/30">
            {copyright}
          </p>
        </div>

      </div>
    </footer>
  )
}
