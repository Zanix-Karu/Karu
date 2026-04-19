import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Navigation } from '@/components/layout/Navigation'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { HeroSection } from '@/components/landing/HeroSection'
import { TickerBand } from '@/components/landing/TickerBand'
import { HowSection } from '@/components/landing/HowSection'
import { StatsSection } from '@/components/landing/StatsSection'
import { TrustSection } from '@/components/landing/TrustSection'
import { FaqSection } from '@/components/landing/FaqSection'
import { WaitlistSection } from '@/components/landing/WaitlistSection'
import { FooterSection } from '@/components/landing/FooterSection'
import { ScrollRevealInit } from '@/components/ui/ScrollRevealInit'

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <Navigation />
      <ScrollRevealInit />
      <main>
        <HeroSection />
        <TickerBand />
        <HowSection />
        <StatsSection />
        <TrustSection />
        <FaqSection />
        <WaitlistSection />
      </main>
      <FooterSection />
    </NextIntlClientProvider>
  )
}
