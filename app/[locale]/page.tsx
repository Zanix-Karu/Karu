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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I rent a car in Douala, Cameroon?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'With Karu, you can browse verified rental cars in Douala, send a booking request before you land, and pay securely via MTN Mobile Money or Orange Money. The vendor confirms within 24 hours and your car is ready at the airport.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Karu available in Yaoundé?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Karu launches simultaneously in both Douala and Yaoundé. You can book a car for pickup at Nsimalen International Airport or anywhere in the city.',
        },
      },
      {
        '@type': 'Question',
        name: 'How are car rental vendors verified on Karu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Every vendor on Karu must submit their RCCM business registration, carte grise, insurance certificate, and vehicle roadworthiness documents. All documents are reviewed before any listing goes live.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I book a car in Cameroon before I arrive?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Karu is designed for pre-arrival booking. You can browse, request, and confirm a rental car from anywhere in the world before your flight lands in Douala or Yaoundé.',
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods does Karu accept?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Karu supports MTN Mobile Money and Orange Money. No international credit card is required. Payments are held securely and released to the vendor after your trip completes.',
        },
      },
    ],
  }

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Structured data for search engines and AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
