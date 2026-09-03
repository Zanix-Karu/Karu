import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import '../globals.css'

const cormorant = Cormorant_Garamond({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})


export const metadata: Metadata = {
  title: 'Karu — Maintenance',
  robots: { index: false, follow: false },
}

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  )
}
