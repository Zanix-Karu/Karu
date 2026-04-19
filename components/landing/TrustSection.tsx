import { useTranslations } from 'next-intl'
import { IconShield, IconCreditCard, IconStar, IconWhatsApp, IconPlane, IconCheckCircle } from '@/components/ui/Icon'
import { TrustCard } from './TrustCard'

const ICONS = [IconShield, IconCreditCard, IconStar, IconWhatsApp, IconPlane, IconCheckCircle]

export function TrustSection() {
  const t = useTranslations('trust')

  const cards = [
    { title: t('c1_title'), body: t('c1_body'), num: '01' },
    { title: t('c2_title'), body: t('c2_body'), num: '02' },
    { title: t('c3_title'), body: t('c3_body'), num: '03' },
    { title: t('c4_title'), body: t('c4_body'), num: '04' },
    { title: t('c5_title'), body: t('c5_body'), num: '05' },
    { title: t('c6_title'), body: t('c6_body'), num: '06' },
  ]

  return (
    <section id="trust" style={{ background: 'var(--deep)', borderTop: '1px solid var(--gold-line)' }}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-16 py-20 md:py-28">
        {/* Header */}
        <div className="reveal text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2.5 font-sans text-[0.62rem] font-bold tracking-[0.22em] uppercase mb-4" style={{ color: 'var(--amber)' }}>
            <span className="block w-7 h-px" style={{ background: 'var(--amber)' }} />
            {t('tag')}
            <span className="block w-7 h-px" style={{ background: 'var(--amber)' }} />
          </div>
          <h2 className="font-serif font-light leading-[0.95]" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', color: 'var(--cream)' }}>
            {t('heading').replace(t('heading_em'), '')}<em style={{ fontStyle: 'italic', color: 'var(--amber-light)' }}>{t('heading_em')}</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '2px', background: 'var(--gold-line)', border: '1px solid var(--gold-line)' }}>
          {cards.map((card, i) => {
            const IconComp = ICONS[i]
            return (
              <TrustCard key={i} title={card.title} body={card.body} num={card.num} delay={(i % 3) * 0.05}>
                <IconComp size={18} className="text-amber" />
              </TrustCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
