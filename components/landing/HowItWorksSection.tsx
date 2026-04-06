import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { StepCard } from './StepCard'

interface Step {
  number: string
  title: string
  description: string
}

export function HowItWorksSection() {
  const t = useTranslations('how_it_works')
  const steps = t.raw('steps') as Step[]

  return (
    <section id="how-it-works" className="bg-surface min-h-screen flex items-center">
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

        {/* Steps grid with connecting line */}
        <div className="relative">
          {/* Amber connecting line — desktop only */}
          <div className="hidden lg:block absolute top-[40px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px bg-amber/30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <StepCard
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
