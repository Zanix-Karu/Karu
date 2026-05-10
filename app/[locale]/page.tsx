import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Navigation } from '@/components/layout/Navigation'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { BackToTop } from '@/components/ui/BackToTop'
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Karu',
    url: 'https://getkaru.io',
    description: 'Verified car rental marketplace for Cameroon. Book trusted rental cars in Douala and Yaoundé before you arrive.',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'XAF',
      availability: 'https://schema.org/PreOrder',
      areaServed: [
        { '@type': 'City', name: 'Douala', containedInPlace: { '@type': 'Country', name: 'Cameroon' } },
        { '@type': 'City', name: 'Yaoundé', containedInPlace: { '@type': 'Country', name: 'Cameroon' } },
      ],
    },
    provider: {
      '@type': 'Organization',
      name: 'Karu',
      url: 'https://getkaru.io',
      logo: 'https://getkaru.io/opengraph-image',
      sameAs: ['https://instagram.com/getkaru.io'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Douala',
        addressCountry: 'CM',
      },
    },
  }

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Karu Car Rental Cameroon',
    url: 'https://getkaru.io',
    description: locale === 'fr'
      ? 'Location de voitures vérifiées à Douala et Yaoundé. Réservez avant votre arrivée.'
      : 'Verified car rental in Douala and Yaoundé. Book before you arrive.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Douala',
      addressRegion: 'Littoral',
      addressCountry: 'CM',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 4.0511,
      longitude: 9.7679,
    },
    areaServed: ['Douala', 'Yaoundé', 'Cameroon'],
    serviceType: 'Car Rental',
    priceRange: 'XAF',
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <CustomCursor />
      <BackToTop />
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
