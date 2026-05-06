'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('ACCESS DENIED — Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#060A0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(30,60,90,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(30,60,90,0.12) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ color: '#E8A020', fontSize: 11, letterSpacing: '0.4em', marginBottom: 8 }}>
            KARU OPERATIONS
          </div>
          <div style={{ color: '#3D5065', fontSize: 10, letterSpacing: '0.2em' }}>
            RESTRICTED ACCESS — AUTHORISED PERSONNEL ONLY
          </div>
        </div>

        {/* Card */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: 32 }}>
          <div style={{ borderLeft: '2px solid #E8A020', paddingLeft: 12, marginBottom: 28 }}>
            <div style={{ color: '#CDD6E0', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.1em' }}>
              AUTHENTICATION REQUIRED
            </div>
            <div style={{ color: '#3D5065', fontSize: 10, marginTop: 4, letterSpacing: '0.1em' }}>
              ENTER ADMIN PASSPHRASE TO CONTINUE
            </div>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#7D8A97', fontSize: 10, letterSpacing: '0.2em', marginBottom: 8 }}>
                PASSPHRASE
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#060A0E', border: '1px solid #1C2936',
                  color: '#E8A020', fontSize: 14, padding: '10px 12px',
                  outline: 'none', fontFamily: 'monospace', letterSpacing: '0.15em',
                }}
                onFocus={e => { e.target.style.borderColor = '#E8A020' }}
                onBlur={e => { e.target.style.borderColor = '#1C2936' }}
              />
            </div>

            {error && (
              <div style={{ color: '#F05252', fontSize: 10, letterSpacing: '0.15em', marginBottom: 16, padding: '8px 10px', border: '1px solid #F05252', background: 'rgba(240,82,82,0.05)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#1C2936' : '#E8A020',
                color: '#060A0E', border: 'none', padding: '12px 0',
                fontFamily: 'monospace', fontSize: 11, fontWeight: 'bold',
                letterSpacing: '0.25em', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'VERIFYING...' : 'AUTHENTICATE →'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, color: '#3D5065', fontSize: 10, letterSpacing: '0.15em' }}>
          KARU INTELLIGENCE PLATFORM · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}
