'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '/admin/dashboard', label: 'OVERVIEW',   icon: '◈' },
  { href: '/admin/waitlist',  label: 'WAITLIST',    icon: '≡' },
  { href: '/admin/map',       label: 'GEO MAP',     icon: '◎' },
  { href: '/admin/emails',    label: 'COMMS',       icon: '⊡' },
  { href: '/admin/analytics', label: 'ANALYTICS',   icon: '⬡' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    setLoggingOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside style={{
      width: 200, minHeight: '100vh', background: '#0C1118',
      borderRight: '1px solid #1C2936', display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1C2936' }}>
        <div style={{ color: '#E8A020', fontSize: 13, fontWeight: 'bold', letterSpacing: '0.35em', fontFamily: 'monospace' }}>
          KARU
        </div>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginTop: 4, fontFamily: 'monospace' }}>
          INTELLIGENCE PLATFORM
        </div>
      </div>

      {/* Status indicator */}
      <div style={{ padding: '10px 20px', borderBottom: '1px solid #1C2936', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 6px #34D399' }} />
        <span style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em', fontFamily: 'monospace' }}>SYSTEMS OPERATIONAL</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px',
                background: active ? 'rgba(232,160,32,0.07)' : 'transparent',
                borderLeft: active ? '2px solid #E8A020' : '2px solid transparent',
                color: active ? '#E8A020' : '#3D5065',
                textDecoration: 'none',
                fontSize: 10, fontWeight: 'bold', letterSpacing: '0.2em',
                fontFamily: 'monospace',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = '#7D8A97'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color = '#3D5065'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</span>
              {item.label}
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #1C2936' }}>
        <button
          onClick={logout}
          disabled={loggingOut}
          style={{
            width: '100%', background: 'transparent', border: '1px solid #1C2936',
            color: '#3D5065', padding: '8px 0', fontFamily: 'monospace',
            fontSize: 9, letterSpacing: '0.2em', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#F05252'
            ;(e.currentTarget as HTMLElement).style.color = '#F05252'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = '#1C2936'
            ;(e.currentTarget as HTMLElement).style.color = '#3D5065'
          }}
        >
          {loggingOut ? 'SIGNING OUT...' : 'SIGN OUT →'}
        </button>
        <div style={{ color: '#1C2936', fontSize: 8, letterSpacing: '0.1em', textAlign: 'center', marginTop: 8, fontFamily: 'monospace' }}>
          KARU OPS v1.0
        </div>
      </div>
    </aside>
  )
}
