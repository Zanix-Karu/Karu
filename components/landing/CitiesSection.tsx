import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CityCard } from './CityCard'

interface CityData {
  name: string
  code: string
  coordinates: string
  badge: string
  description: string
}

export function CitiesSection() {
  const t = useTranslations('cities')
  const douala = t.raw('douala') as CityData
  const yaounde = t.raw('yaounde') as CityData

  return (
    <section id="cities" className="bg-espresso min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">

        {/* Section tag + heading */}
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

        {/* 2-column city cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollReveal direction="left">
            <CityCard
              name={douala.name}
              code={douala.code}
              coordinates={douala.coordinates}
              badge={douala.badge}
              description={douala.description}
              direction="left"
            />
          </ScrollReveal>

          <ScrollReveal direction="right">
            <CityCard
              name={yaounde.name}
              code={yaounde.code}
              coordinates={yaounde.coordinates}
              badge={yaounde.badge}
              description={yaounde.description}
              direction="right"
            />
          </ScrollReveal>
        </div>

        {/* More cities note */}
        <ScrollReveal delay={0.2}>
          <p className="text-center font-sans text-[0.78rem] text-cream/40 tracking-[0.08em] mt-8">
            {t('more_cities')}
          </p>
        </ScrollReveal>

      </div>
    </section>
  )
}
