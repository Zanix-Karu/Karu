import type { Metadata } from 'next'
import { Playfair_Display, DM_Serif_Display, DM_Sans } from 'next/font/google'
import '../globals.css'

const playfair = Playfair_Display({
  weight: ['700', '900'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Karu — Maintenance',
  robots: { index: false, follow: false },
}

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSerif.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
