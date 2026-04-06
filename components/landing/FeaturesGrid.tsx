import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { FeatureCard } from './FeatureCard'

interface FeatureCardData {
  icon: string
  label: string
  description: string
}

export function FeaturesGrid() {
  const t = useTranslations('features')
  const cards = t.raw('cards') as FeatureCardData[]

  return (
    <section id="features" className="bg-brown-dark min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">

        {/* Section tag */}
        <ScrollReveal>
          <div className="flex flex-col items-center gap-5 mb-16 text-center">
            <div className="inline-flex items-center gap-[10px] text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-amber">
              <span className="block w-7 h-px bg-amber" />
              {t('tag')}
              <span className="block w-7 h-px bg-amber" />
            </div>
            <h2 className="font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.1] text-cream">
              {t('heading')}
            </h2>
          </div>
        </ScrollReveal>

        {/* 3×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i * 0.07}>
              <FeatureCard
                icon={card.icon}
                label={card.label}
                description={card.description}
                index={i}
              />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
