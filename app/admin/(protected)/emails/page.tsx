import { supabaseAdmin } from '@/lib/supabase-admin'
import { decryptBody } from '@/lib/email-encrypt'
import { EmailCenter } from '@/components/admin/EmailCenter'

export const dynamic = 'force-dynamic'

async function getEmailLog() {
  const { data: rows } = await supabaseAdmin
    .from('admin_email_log')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(200)

  const log = (rows ?? []).map(row => ({
    id: row.id as string,
    subject: row.subject as string,
    recipient_count: row.recipient_count as number,
    segment: row.segment as Record<string, string> | null,
    resend_id: row.resend_id as string | null,
    sent_at: row.sent_at as string,
    email_type: (row.email_type ?? 'broadcast') as string,
    recipient_email: (row.recipient_email ?? null) as string | null,
    metadata: (row.metadata ?? null) as Record<string, string> | null,
    // Decrypt HTML body server-side — never send ciphertext to client
    html_body: (() => {
      if (!row.html_encrypted || !row.html_iv) return null
      try { return decryptBody(row.html_encrypted as string, row.html_iv as string) }
      catch { return null }
    })(),
  }))

  return log
}

export default async function EmailsPage() {
  const log = await getEmailLog()
  const broadcasts = log.filter(e => e.email_type === 'broadcast')
  const signups = log.filter(e => e.email_type !== 'broadcast')

  return (
    <div>
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
          <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>COMMUNICATIONS HUB</div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#3D5065', fontSize: 8, letterSpacing: '0.1em' }}>BROADCASTS</div>
            <div style={{ color: '#E8A020', fontSize: 14, fontWeight: 700 }}>{broadcasts.length}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#3D5065', fontSize: 8, letterSpacing: '0.1em' }}>SIGNUPS</div>
            <div style={{ color: '#34D399', fontSize: 14, fontWeight: 700 }}>{signups.length}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <EmailCenter log={log} />
      </div>
    </div>
  )
}
