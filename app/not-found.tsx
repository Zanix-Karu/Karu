import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brown-dark flex items-center justify-center px-6" style={{ fontFamily: 'var(--font-sans, system-ui)' }}>
      <div className="text-center max-w-md">
        <div className="text-amber text-7xl font-serif mb-4">404</div>
        <h1 className="text-cream text-xl font-semibold mb-3">Page not found</h1>
        <p className="text-cream/50 text-base font-light mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-block px-8 py-3 bg-amber text-brown-dark font-semibold text-sm tracking-wide hover:bg-amber/90 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
