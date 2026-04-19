import { useTranslations } from 'next-intl'

export function StatsSection() {
  const t = useTranslations('stats')

  const stats = [
    { num: t('n1'), label: t('l1'), desc: t('d1') },
    { num: t('n2'), label: t('l2'), desc: t('d2') },
    { num: t('n3'), label: t('l3'), desc: t('d3') },
  ]

  return (
    <section style={{ background: 'var(--mahogany)', borderTop: '1px solid var(--gold-line)', borderBottom: '1px solid var(--gold-line)' }}>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-cell flex flex-col items-center text-center px-8 py-14 md:py-[60px]"
            style={{
              borderRight: i < 2 ? '1px solid var(--gold-line)' : 'none',
              borderBottom: i < 2 ? '1px solid var(--gold-line)' : 'none',
              transitionDelay: `${i * 0.15}s`,
            }}
          >
            <div className="font-serif font-medium leading-none mb-2" style={{ fontSize: '4rem', color: 'var(--amber)' }}>{s.num}</div>
            <div className="font-sans text-[0.62rem] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color: 'var(--cream-dim)' }}>{s.label}</div>
            <p className="font-serif font-light leading-[1.6]" style={{ fontSize: '0.88rem', color: 'rgba(240,232,216,0.35)' }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
