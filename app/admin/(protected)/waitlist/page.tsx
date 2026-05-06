import { supabaseAdmin } from '@/lib/supabase-admin'
import { scoreEntry } from '@/lib/sentiment'
import { WaitlistTable } from '@/components/admin/WaitlistTable'

export default async function WaitlistPage() {
  const { data } = await supabaseAdmin
    .from('waitlist_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)

  const enriched = (data ?? []).map(r => ({ ...r, lead: scoreEntry(r) }))

  return (
    <div>
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
          <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>WAITLIST REGISTRY</div>
        </div>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>
          {enriched.length} TOTAL RECORDS
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <WaitlistTable initialData={enriched as Parameters<typeof WaitlistTable>[0]['initialData']} />
      </div>
    </div>
  )
}
