import type { Metadata } from 'next'
import { Cormorant_Garamond, Syne } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const syne = Syne({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Karu — Verified Car Rentals in Cameroon',
  description: 'Verified rental cars booked before you land. Douala & Yaoundé. MTN MoMo & Orange Money. No middlemen.',
  openGraph: {
    title: 'Karu — Verified Car Rentals in Cameroon',
    description: 'Arrive in comfort. Verified rental cars, booked before you land.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_CM',
    alternateLocale: ['fr_CM'],
    type: 'website',
    siteName: 'Karu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karu — Cameroon Car Rental Marketplace',
    description: 'Verified providers, mobile money payments, pre-arrival booking.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://karu.rentals'),
}

interface RootLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function RootLayout({ children, params: { locale } }: RootLayoutProps) {
  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${syne.variable}`}
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
