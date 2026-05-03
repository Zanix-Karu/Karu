import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Navigation } from '@/components/layout/Navigation'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { HeroSection } from '@/components/landing/HeroSection'
import { TickerBand } from '@/components/landing/TickerBand'
import { AboutSection } from '@/components/landing/AboutSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { CitiesSection } from '@/components/landing/CitiesSection'
import { WaitlistSection } from '@/components/landing/WaitlistSection'
import { FooterSection } from '@/components/landing/FooterSection'

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <Navigation />
      <main>
        <HeroSection />
        <TickerBand />
        <AboutSection />
        <HowItWorksSection />
        <FeaturesGrid />
        <CitiesSection />
        <WaitlistSection />
      </main>
      <FooterSection />
    </NextIntlClientProvider>
  )
}
