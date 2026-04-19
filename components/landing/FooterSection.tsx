import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function FooterSection() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--ink)', borderTop: '1px solid var(--gold-line)' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-16 pt-14 pb-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-9 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="font-serif text-[1.55rem] font-medium tracking-[0.02em] inline-block mb-4" style={{ color: 'var(--cream)' }}>
              <em className="not-italic" style={{ color: 'var(--amber)' }}>K</em>aru
            </a>
            <p className="font-serif font-light leading-[1.7] max-w-[220px]" style={{ fontSize: '0.9rem', color: 'var(--cream-dim)' }}>
              {t('tagline')}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-sans text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--amber)' }}>{t('col_product')}</h4>
            <ul className="space-y-2.5">
              {['How it works', 'For vendors', 'For travellers', 'Cities'].map(l => (
                <li key={l}><a href="#" className="font-sans text-[0.8rem] transition-colors duration-200 hover:text-amber" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-sans text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--amber)' }}>{t('col_company')}</h4>
            <ul className="space-y-2.5">
              {['About Zanix', 'Blog', 'Press', 'Contact'].map((l, i) => (
                <li key={l}>
                  <Link href={i === 3 ? '/contact' : '#'} className="font-sans text-[0.8rem] transition-colors duration-200 hover:text-amber" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-sans text-[0.62rem] font-bold tracking-[0.18em] uppercase mb-4" style={{ color: 'var(--amber)' }}>{t('col_legal')}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="font-sans text-[0.8rem] transition-colors duration-200 hover:text-amber" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>{t('links.privacy')}</Link></li>
              <li><Link href="/terms" className="font-sans text-[0.8rem] transition-colors duration-200 hover:text-amber" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>{t('links.terms')}</Link></li>
              <li><a href="https://instagram.com/getkaru.io" target="_blank" rel="noopener noreferrer" className="font-sans text-[0.8rem] transition-colors duration-200 hover:text-amber" style={{ color: 'var(--cream-dim)', textDecoration: 'none' }}>Instagram</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8" style={{ borderTop: '1px solid var(--gold-line)' }}>
          <span className="font-sans text-[0.65rem] tracking-[0.06em]" style={{ color: 'rgba(240,232,216,0.25)' }}>
            {t('copyright', { year })}
          </span>
          <span className="font-sans text-[0.65rem] tracking-[0.06em]" style={{ color: 'rgba(240,232,216,0.2)' }}>
            {t('zanix')}
          </span>
        </div>
      </div>
    </footer>
  )
}
