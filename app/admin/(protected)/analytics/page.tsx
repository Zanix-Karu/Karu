import { supabaseAdmin } from '@/lib/supabase-admin'
import { scoreEntry, tierColor } from '@/lib/sentiment'
import { BarChartPanel, DonutChartPanel, TrendChart } from '@/components/admin/TrendChart'
import { MetricCard } from '@/components/admin/MetricCard'

const FREE_DOMAINS = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.com', 'protonmail.com', 'live.com', 'yahoo.fr', 'hotmail.fr', 'orange.fr'])

export default async function AnalyticsPage() {
  const { data } = await supabaseAdmin.from('waitlist_entries').select('*').order('created_at', { ascending: false })
  const rows = data ?? []
  const scored = rows.map(r => ({ ...r, lead: scoreEntry(r) }))

  // Lead score distribution (buckets)
  const buckets = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90].map(min => ({
    label: `${min}–${min + 9}`,
    value: scored.filter(s => s.lead.total >= min && s.lead.total < min + 10).length,
  }))

  // Email domain analysis
  const domains: Record<string, number> = {}
  rows.forEach(r => {
    const d = r.email?.split('@')[1]?.toLowerCase()
    if (d) domains[d] = (domains[d] ?? 0) + 1
  })
  const topDomains = Object.entries(domains).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const corpCount = rows.filter(r => {
    const d = r.email?.split('@')[1]?.toLowerCase()
    return d && !FREE_DOMAINS.has(d)
  }).length

  // Fleet size breakdown (vendors only)
  const vendors = rows.filter(r => r.type === 'vendor')
  const fleetDist = [
    { label: '21+', value: vendors.filter(v => v.vehicle_count === '21+').length },
    { label: '6–20', value: vendors.filter(v => v.vehicle_count === '6-20').length },
    { label: '1–5', value: vendors.filter(v => v.vehicle_count === '1-5').length },
    { label: 'N/A', value: vendors.filter(v => !v.vehicle_count).length },
  ]

  // Segment distribution
  const segments: Record<string, number> = {}
  scored.forEach(s => { segments[s.lead.segment] = (segments[s.lead.segment] ?? 0) + 1 })
  const segmentData = Object.entries(segments).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)

  // Weekly cohort (last 8 weeks)
  const weeks: Record<string, number> = {}
  for (let i = 7; i >= 0; i--) {
    const d = new Date(Date.now() - i * 7 * 86400000)
    const key = `W${d.getMonth() + 1}/${d.getDate()}`
    weeks[key] = 0
  }
  rows.forEach(r => {
    if (!r.created_at) return
    const d = new Date(r.created_at)
    const weekStart = new Date(d.getTime() - d.getDay() * 86400000)
    const key = `W${weekStart.getMonth() + 1}/${weekStart.getDate()}`
    if (weeks[key] !== undefined) weeks[key]++
  })
  const weeklyData = Object.entries(weeks).map(([date, count]) => ({ date, count }))

  // Phone capture rate
  const withPhone = rows.filter(r => r.phone).length
  const withBizName = rows.filter(r => r.business_name).length

  // Country distribution
  const countries: Record<string, number> = {}
  rows.forEach(r => {
    const c = r.country ?? 'Unknown'
    countries[c] = (countries[c] ?? 0) + 1
  })
  const countryData = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))

  // Hot lead flags
  const hotLeads = scored.filter(s => s.lead.tier === 'HOT').slice(0, 10)

  return (
    <div>
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
          <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>DEEP ANALYTICS</div>
        </div>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>
          {rows.length} RECORDS ANALYSED
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          <MetricCard label="CORPORATE EMAILS" value={corpCount} sub={`${Math.round(corpCount / Math.max(rows.length, 1) * 100)}% of signups`} accent="#34D399" />
          <MetricCard label="PHONE CAPTURED" value={withPhone} sub={`${Math.round(withPhone / Math.max(vendors.length, 1) * 100)}% of vendors`} accent="#2EA8FF" />
          <MetricCard label="BUSINESS NAME" value={withBizName} sub="profile completeness" accent="#E8A020" />
          <MetricCard label="LARGE FLEET (21+)" value={vendors.filter(v => v.vehicle_count === '21+').length} sub="fleet operators" accent="#F05252" />
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
          <BarChartPanel data={buckets} title="LEAD SCORE DISTRIBUTION" color="#E8A020" />
          <DonutChartPanel data={fleetDist} title="VENDOR FLEET SIZE" />
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <TrendChart data={weeklyData} title="WEEKLY COHORT SIGNUPS" />
          <BarChartPanel data={countryData} title="GEOGRAPHIC ORIGIN" color="#2EA8FF" />
        </div>

        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <DonutChartPanel data={segmentData.slice(0, 6)} title="MARKET SEGMENTS" />
          {/* Email domain table */}
          <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
            <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 16 }}>TOP EMAIL DOMAINS</div>
            {topDomains.map(([domain, count], i) => {
              const pct = Math.round((count / rows.length) * 100)
              const isFree = FREE_DOMAINS.has(domain)
              return (
                <div key={domain} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: isFree ? '#3D5065' : '#34D399', fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {!isFree && <span style={{ fontSize: 8 }}>✦</span>}
                      {domain}
                    </span>
                    <span style={{ color: '#CDD6E0', fontSize: 10 }}>{count} <span style={{ color: '#3D5065' }}>({pct}%)</span></span>
                  </div>
                  <div style={{ height: 2, background: '#1C2936' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: isFree ? '#1C2936' : '#34D399' }} />
                  </div>
                </div>
              )
            })}
            <div style={{ marginTop: 16, color: '#3D5065', fontSize: 9, letterSpacing: '0.1em' }}>✦ = CORPORATE / NON-FREE DOMAIN</div>
          </div>
        </div>

        {/* Hot leads table */}
        <div style={{ background: '#0C1118', border: '1px solid #E8A020', padding: '20px 24px' }}>
          <div style={{ color: '#E8A020', fontSize: 9, letterSpacing: '0.2em', marginBottom: 16 }}>
            HOT LEADS — PRIORITY OUTREACH ({hotLeads.length})
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1C2936' }}>
                {['SCORE', 'EMAIL', 'BUSINESS', 'SEGMENT', 'FLAGS', 'CITY', 'REGISTERED'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 12px', color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', fontWeight: 'normal' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotLeads.map((r, i) => (
                <tr key={r.email} style={{ borderBottom: '1px solid #111920' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{ color: '#E8A020', fontWeight: 700 }}>{r.lead.total}</span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#CDD6E0' }}>{r.email}</td>
                  <td style={{ padding: '8px 12px', color: '#7D8A97', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.business_name ?? <span style={{ color: '#1C2936' }}>—</span>}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>{r.lead.segment}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {r.lead.flags.slice(0, 3).map((f: string) => (
                        <span key={f} style={{ fontSize: 8, letterSpacing: '0.1em', color: '#E8A020', border: '1px solid rgba(232,160,32,0.3)', padding: '1px 5px' }}>{f}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>{r.city?.toUpperCase()}</td>
                  <td style={{ padding: '8px 12px', color: '#3D5065', fontSize: 9 }}>{r.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hotLeads.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#3D5065', fontSize: 10 }}>NO HOT LEADS YET</div>
          )}
        </div>

      </div>
    </div>
  )
}
