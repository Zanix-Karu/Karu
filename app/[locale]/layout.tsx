import type { Metadata } from 'next'
import { DM_Serif_Display, Playfair_Display, DM_Sans } from 'next/font/google'
import Script from 'next/script'
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
  title: 'Karu — Verified Car Rentals in Cameroon',
  description: 'Karu connects travelers and locals with verified car rental providers in Douala and Yaoundé. No stress, no middlemen, no surprises.',
  openGraph: {
    title: 'Karu — Verified Car Rentals in Cameroon',
    description: 'No stress, no middlemen. Verified providers, secure payments, pre-arrival booking.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_CM',
    alternateLocale: ['fr_CM'],
    type: 'website',
    siteName: 'Karu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karu — Cameroon Car Rental Marketplace',
    description: 'Verified providers, secure payments, pre-arrival booking.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://getkaru.io'),
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  return (
    <html
      lang={locale}
      className={`${dmSerif.variable} ${playfair.variable} ${dmSans.variable}`}
    >
      <body>
        {children}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
