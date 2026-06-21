'use client'

import { useEffect } from 'react'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[admin] Page error:', error.message)
  }, [error])

  return (
    <div style={{ padding: '24px 32px', fontFamily: 'monospace' }}>
      <div style={{ background: '#0C1118', border: '1px solid #F05252', padding: 32, maxWidth: 500 }}>
        <div style={{ color: '#F05252', fontSize: 11, letterSpacing: '0.25em', marginBottom: 12 }}>
          ERROR
        </div>
        <div style={{ color: '#CDD6E0', fontSize: 14, fontWeight: 'bold', marginBottom: 8 }}>
          Something went wrong
        </div>
        <div style={{ color: '#7D8A97', fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
          {error.message || 'An unexpected error occurred while loading this page.'}
        </div>
        {error.digest && (
          <div style={{ color: '#3D5065', fontSize: 10, letterSpacing: '0.15em', marginBottom: 16 }}>
            REF: {error.digest}
          </div>
        )}
        <button
          onClick={reset}
          style={{
            background: '#E8A020',
            color: '#060A0E',
            border: 'none',
            padding: '10px 24px',
            fontFamily: 'monospace',
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            cursor: 'pointer',
          }}
        >
          RETRY
        </button>
      </div>
    </div>
  )
}
