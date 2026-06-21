'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#1C1208', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ color: '#E8A020', fontSize: 48, fontWeight: 'bold', marginBottom: 16 }}>Error</div>
            <p style={{ color: 'rgba(255,248,235,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 24 }}>
              Something went wrong. Please try again.
            </p>
            {error.digest && (
              <p style={{ color: 'rgba(255,248,235,0.3)', fontSize: 12, letterSpacing: '0.1em', marginBottom: 24 }}>
                REF: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: '12px 32px',
                background: '#E8A020',
                color: '#1C1208',
                border: 'none',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
