import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

interface AboutCard {
  icon: string
  title: string
  body: string
}

export function AboutSection() {
  const t = useTranslations('about')
  const cards = t.raw('cards') as AboutCard[]

  const gridCards = cards.slice(0, 4)
  const fullWidthCard = cards[4]

  return (
    <section id="about" className="bg-espresso min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left column ── */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-8">

              {/* Section tag */}
              <div className="inline-flex items-center gap-[10px] text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-amber">
                <span className="block w-7 h-px bg-amber" />
                {t('tag')}
              </div>

              {/* Heading */}
              <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.1] text-cream">
                {t('heading')}{' '}
                <em className="italic">{t('heading_italic')}</em>
              </h2>

              {/* Paragraphs */}
              <p className="font-sans font-light text-base leading-[1.8] text-cream/70">
                {t('paragraph1')}
              </p>
              <p className="font-sans font-light text-base leading-[1.8] text-cream/70">
                {t('paragraph2')}
              </p>

              {/* CTA */}
              <div>
                <a
                  href="#waitlist"
                  className="relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-semibold tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso bg-amber text-espresso px-10 py-[15px] hover:-translate-y-[3px] hover:shadow-[0_18px_55px_rgba(232,160,32,0.4)] active:scale-[0.98]"
                >
                  {t('cta')}
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4">

            {/* 2×2 grid of small cards */}
            <div className="grid grid-cols-2 gap-4">
              {gridCards.map((card, i) => (
                <ScrollReveal key={card.title} direction="right" delay={i * 0.1}>
                  <div className="bg-card-bg border border-card-border rounded-lg p-5 h-full">
                    <div className="text-2xl mb-3" aria-hidden="true">{card.icon}</div>
                    <h3 className="font-sans font-semibold text-[0.85rem] tracking-[0.04em] uppercase text-cream mb-2">
                      {card.title}
                    </h3>
                    <p className="font-sans font-light text-[0.875rem] leading-[1.7] text-cream/60">
                      {card.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Full-width card */}
            {fullWidthCard && (
              <ScrollReveal direction="right" delay={0.4}>
                <div className="bg-card-bg border border-amber/20 rounded-lg p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl shrink-0" aria-hidden="true">{fullWidthCard.icon}</div>
                    <div>
                      <h3 className="font-sans font-semibold text-[0.85rem] tracking-[0.04em] uppercase text-amber mb-2">
                        {fullWidthCard.title}
                      </h3>
                      <p className="font-sans font-light text-[0.875rem] leading-[1.7] text-cream/70 italic">
                        {fullWidthCard.body}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
