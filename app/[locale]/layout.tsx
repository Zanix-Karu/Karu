import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit, Inter } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/routing'
import '../globals.css'
import { SITE_URL, siteUrl } from '@/lib/site-url'

const cormorant = Cormorant_Garamond({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Karu — Car Rental Cameroon | Book Verified Cars in Douala & Yaoundé',
    template: '%s | Karu',
  },
  description: 'Book verified rental cars in Douala and Yaoundé, Cameroon. Trusted providers, transparent pricing, pre-arrival booking. MTN Mobile Money accepted. No middlemen.',
  keywords: [
    'car rental Cameroon',
    'location voiture Cameroun',
    'rent a car Douala',
    'car hire Yaoundé',
    'location voiture Douala',
    'location voiture Yaoundé',
    'airport car rental Cameroon',
    'Douala airport car hire',
    'Nsimalen airport car rental',
    'car rental Douala airport',
    'verified car rental Africa',
    'mobile money car rental',
    'MTN MoMo car rental',
    'diaspora car rental Cameroon',
    'louer voiture Douala',
    'louer voiture Yaoundé',
    'Karu car rental',
  ],
  openGraph: {
    title: 'Karu — Verified Car Rentals in Douala & Yaoundé, Cameroon',
    description: 'Book trusted rental cars before you land. Verified providers, transparent pricing, MTN Mobile Money. Launching in Douala and Yaoundé.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_CM',
    alternateLocale: ['fr_CM'],
    type: 'website',
    siteName: 'Karu',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karu — Car Rental Cameroon | Douala & Yaoundé',
    description: 'Verified providers, transparent pricing, pre-arrival booking. Launching soon.',
    images: ['/opengraph-image'],
    creator: '@getkaru',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': siteUrl('/en'),
      'fr': siteUrl('/fr'),
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? undefined,
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  // Paths containing a dot bypass the middleware matcher, so an unvalidated
  // segment would render the landing page under `<html lang="foo.xml">` with a
  // 200 — a soft-404 indexable as duplicate homepage content. Refuse anything
  // that isn't a real locale.
  if (!isLocale(locale)) notFound()

  const messages = await getMessages()
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${outfit.variable} ${inter.variable}`}
    >
      <body>
        {/*
          First thing in the tab order, visually hidden until focused. Without
          it a keyboard user walks the whole nav on every page load.
        */}
        <a href="#main" className="skip-link">
          {locale === 'fr' ? 'Aller au contenu' : 'Skip to content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            strategy="lazyOnload"
          />
        )}
        {/* Disable React DevTools and right-click inspection hints in production */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="security-hardening"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(){
                  // Disable React DevTools
                  if(typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__==='object'){
                    for(var p in window.__REACT_DEVTOOLS_GLOBAL_HOOK__){
                      if(p!=='renderers'){
                        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[p]=typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[p]==='function'?function(){}:null;
                      }
                    }
                  }
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
