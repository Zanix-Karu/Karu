import type { Metadata } from 'next'
import { DM_Serif_Display, Playfair_Display, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
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
    url: 'https://getkaru.io',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karu — Car Rental Cameroon | Douala & Yaoundé',
    description: 'Verified providers, transparent pricing, pre-arrival booking. Launching soon.',
    images: ['/opengraph-image'],
    creator: '@getkaru',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://getkaru.io'),
  alternates: {
    canonical: 'https://getkaru.io',
    languages: {
      'en': 'https://getkaru.io/en',
      'fr': 'https://getkaru.io/fr',
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
  const messages = await getMessages()
  return (
    <html
      lang={locale}
      className={`${dmSerif.variable} ${playfair.variable} ${dmSans.variable}`}
    >
      <body>
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
