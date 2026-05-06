import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Karu Operations',
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" />
      </head>
      <body style={{ margin: 0, background: '#060A0E', color: '#CDD6E0', fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
        {children}
      </body>
    </html>
  )
}
