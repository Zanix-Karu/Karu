import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit, Inter } from 'next/font/google'
import '../globals.css'

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
  title: 'Karu — Maintenance',
  robots: { index: false, follow: false },
}

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
