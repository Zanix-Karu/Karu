'use client'

import { useEffect } from 'react'

export default function LandingError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[landing] Page error:', error.message)
  }, [error])

  return (
    <div className="min-h-screen bg-brown-dark flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-amber text-5xl font-serif mb-4">Oops</div>
        <p className="text-cream/70 text-base font-light mb-6 leading-relaxed">
          Something went wrong loading this page. Please try again.
        </p>
        {error.digest && (
          <p className="text-cream/30 text-xs tracking-widest mb-6">
            REF: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="px-8 py-3 bg-amber text-brown-dark font-semibold text-sm tracking-wide hover:bg-amber/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
