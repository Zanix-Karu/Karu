import { EmailCenter } from '@/components/admin/EmailCenter'

async function getEmails() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return []
  try {
    const res = await fetch('https://api.resend.com/emails?limit=100', {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data ?? []
  } catch {
    return []
  }
}

export default async function EmailsPage() {
  const emails = await getEmails()

  return (
    <div>
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
          <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>COMMUNICATIONS HUB</div>
        </div>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>
          POWERED BY RESEND · {emails.length} LOGGED
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <EmailCenter emails={emails} />
      </div>
    </div>
  )
}
