'use client'

import { useState } from 'react'

interface SentEmail {
  id: string
  from: string
  to: string[]
  subject: string
  created_at: string
  last_event?: string
}

interface Props {
  emails: SentEmail[]
}

export function EmailCenter({ emails }: Props) {
  const [composing, setComposing] = useState(false)
  const [form, setForm] = useState({ subject: '', html: '', type: 'all', city: 'all', locale: 'all' })
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [preview, setPreview] = useState<SentEmail | null>(null)

  async function send() {
    if (!form.subject || !form.html) return
    setSending(true)
    setResult(null)
    const res = await fetch('/api/admin/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: form.subject,
        html: form.html,
        segment: { type: form.type, city: form.city, locale: form.locale },
      }),
    })
    const json = await res.json()
    setResult(res.ok ? `SENT TO ${json.total} RECIPIENTS` : `ERROR: ${json.error}`)
    setSending(false)
  }

  const selStyle: React.CSSProperties = {
    background: '#060A0E', border: '1px solid #1C2936', color: '#7D8A97',
    padding: '6px 10px', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.1em', outline: 'none',
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: composing ? '1fr 1fr' : '1fr', gap: 16 }}>
      {/* Email log */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em' }}>
            SENT EMAILS — {emails.length} RECORDS
          </div>
          <button
            onClick={() => setComposing(!composing)}
            style={{
              background: composing ? '#1C2936' : '#E8A020', color: composing ? '#7D8A97' : '#060A0E',
              border: 'none', padding: '7px 16px', fontFamily: 'monospace', fontSize: 9,
              letterSpacing: '0.2em', cursor: 'pointer',
            }}
          >
            {composing ? 'CANCEL' : '+ COMPOSE'}
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1C2936' }}>
              {['SUBJECT', 'TO', 'SENT', 'STATUS'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', fontWeight: 'normal' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {emails.map((email, i) => (
              <tr
                key={email.id}
                onClick={() => setPreview(preview?.id === email.id ? null : email)}
                style={{
                  borderBottom: '1px solid #111920',
                  background: preview?.id === email.id ? 'rgba(232,160,32,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,160,32,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = preview?.id === email.id ? 'rgba(232,160,32,0.05)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)')}
              >
                <td style={{ padding: '8px 12px', color: '#CDD6E0', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email.subject}
                </td>
                <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>
                  {Array.isArray(email.to) ? email.to.slice(0, 2).join(', ') + (email.to.length > 2 ? ` +${email.to.length - 2}` : '') : email.to}
                </td>
                <td style={{ padding: '8px 12px', color: '#3D5065', fontSize: 9, whiteSpace: 'nowrap' }}>
                  {email.created_at ? new Date(email.created_at).toISOString().slice(0, 16).replace('T', ' ') : '—'}
                </td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ color: '#34D399', fontSize: 9, letterSpacing: '0.15em' }}>SENT</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {emails.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#3D5065', fontSize: 10, letterSpacing: '0.2em' }}>
            NO EMAILS FOUND IN RESEND
          </div>
        )}

        {/* Email detail */}
        {preview && (
          <div style={{ marginTop: 16, background: '#0C1118', border: '1px solid #1C2936', padding: '16px 20px' }}>
            <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 12 }}>EMAIL DETAIL</div>
            <div style={{ color: '#7D8A97', fontSize: 10, marginBottom: 6 }}>ID: <span style={{ color: '#3D5065' }}>{preview.id}</span></div>
            <div style={{ color: '#7D8A97', fontSize: 10, marginBottom: 6 }}>FROM: <span style={{ color: '#CDD6E0' }}>{preview.from}</span></div>
            <div style={{ color: '#7D8A97', fontSize: 10 }}>TO: <span style={{ color: '#CDD6E0' }}>{Array.isArray(preview.to) ? preview.to.join(', ') : preview.to}</span></div>
          </div>
        )}
      </div>

      {/* Compose panel */}
      {composing && (
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 20 }}>COMPOSE BROADCAST</div>

          {/* Segment */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>SEGMENT</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(['type', 'city', 'locale'] as const).map(key => (
                <select key={key} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={selStyle}>
                  <option value="all">{key.toUpperCase()}: ALL</option>
                  {key === 'type' && <><option value="vendor">VENDOR</option><option value="customer">CUSTOMER</option></>}
                  {key === 'city' && <><option value="douala">DOUALA</option><option value="yaounde">YAOUNDÉ</option></>}
                  {key === 'locale' && <><option value="en">EN</option><option value="fr">FR</option></>}
                </select>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>SUBJECT</div>
            <input
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Email subject..."
              style={{ ...selStyle, width: '100%', boxSizing: 'border-box', color: '#CDD6E0' }}
            />
          </div>

          {/* Body */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em', marginBottom: 8 }}>BODY (HTML)</div>
            <textarea
              value={form.html}
              onChange={e => setForm(f => ({ ...f, html: e.target.value }))}
              rows={10}
              placeholder="<p>Your message...</p>"
              style={{ ...selStyle, width: '100%', boxSizing: 'border-box', color: '#CDD6E0', resize: 'vertical', verticalAlign: 'top' }}
            />
          </div>

          {result && (
            <div style={{
              padding: '8px 12px', marginBottom: 16, fontSize: 10, letterSpacing: '0.1em',
              border: `1px solid ${result.startsWith('ERROR') ? '#F05252' : '#34D399'}`,
              color: result.startsWith('ERROR') ? '#F05252' : '#34D399',
              background: result.startsWith('ERROR') ? 'rgba(240,82,82,0.05)' : 'rgba(52,211,153,0.05)',
            }}>
              {result}
            </div>
          )}

          <button
            onClick={send}
            disabled={sending || !form.subject || !form.html}
            style={{
              width: '100%', background: sending ? '#1C2936' : '#E8A020',
              color: '#060A0E', border: 'none', padding: '12px 0',
              fontFamily: 'monospace', fontSize: 10, fontWeight: 'bold',
              letterSpacing: '0.25em', cursor: sending ? 'not-allowed' : 'pointer',
            }}
          >
            {sending ? 'TRANSMITTING...' : 'SEND BROADCAST →'}
          </button>
        </div>
      )}
    </div>
  )
}
