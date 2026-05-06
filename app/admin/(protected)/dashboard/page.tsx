import { supabaseAdmin } from '@/lib/supabase-admin'
import { scoreEntry } from '@/lib/sentiment'
import { MetricCard } from '@/components/admin/MetricCard'
import { TrendChart, DonutChartPanel, BarChartPanel } from '@/components/admin/TrendChart'

function pageHeader(title: string, sub: string) {
  return (
    <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
        <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>{title}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>{sub}</div>
        <div style={{ color: '#1C2936', fontSize: 9, marginTop: 4 }}>{new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC</div>
      </div>
    </div>
  )
}

export default async function Dashboard() {
  const { data: all } = await supabaseAdmin.from('waitlist_entries').select('*').order('created_at', { ascending: false })
  const rows = all ?? []

  const total = rows.length
  const vendors = rows.filter(r => r.type === 'vendor').length
  const customers = rows.filter(r => r.type === 'customer').length
  const scored = rows.map(r => scoreEntry(r))
  const hot = scored.filter(s => s.tier === 'HOT').length
  const avgScore = scored.length ? Math.round(scored.reduce((a, s) => a + s.total, 0) / scored.length) : 0

  // Trend: last 30 days
  const now = Date.now()
  const days: Record<string, number> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10)
    days[d] = 0
  }
  rows.forEach(r => {
    const d = r.created_at?.slice(0, 10)
    if (d && days[d] !== undefined) days[d]++
  })
  const trend = Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count }))

  // City distribution
  const cityMap: Record<string, number> = {}
  rows.forEach(r => { cityMap[r.city ?? 'other'] = (cityMap[r.city ?? 'other'] ?? 0) + 1 })
  const cityData = Object.entries(cityMap).map(([label, value]) => ({ label: label.toUpperCase(), value }))

  // Locale
  const localeMap: Record<string, number> = {}
  rows.forEach(r => { localeMap[r.locale ?? 'en'] = (localeMap[r.locale ?? 'en'] ?? 0) + 1 })
  const localeData = Object.entries(localeMap).map(([label, value]) => ({ label: label.toUpperCase(), value }))

  // Recent
  const recent = rows.slice(0, 8).map(r => ({ ...r, lead: scoreEntry(r) }))

  return (
    <div>
      {pageHeader('OVERVIEW', 'LIVE WAITLIST INTELLIGENCE')}

      <div style={{ padding: '24px 32px' }}>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
          <MetricCard label="TOTAL SIGNUPS" value={total} sub="all time" />
          <MetricCard label="VENDORS" value={vendors} sub={`${Math.round(vendors / Math.max(total, 1) * 100)}% of total`} accent="#E8A020" />
          <MetricCard label="CUSTOMERS" value={customers} sub={`${Math.round(customers / Math.max(total, 1) * 100)}% of total`} accent="#2EA8FF" />
          <MetricCard label="HOT LEADS" value={hot} sub="score ≥ 65" accent="#F05252" />
          <MetricCard label="AVG LEAD SCORE" value={avgScore} sub="/ 100" accent="#34D399" />
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <TrendChart data={trend} title="SIGNUPS — LAST 30 DAYS" />
          <DonutChartPanel data={[{ label: 'VENDOR', value: vendors }, { label: 'CUSTOMER', value: customers }]} title="TYPE SPLIT" />
          <DonutChartPanel data={localeData} title="LOCALE SPLIT" />
        </div>

        {/* Charts row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <BarChartPanel data={cityData} title="CITY DISTRIBUTION" />
          <BarChartPanel
            data={[
              { label: 'COLD', value: scored.filter(s => s.tier === 'COLD').length },
              { label: 'WARM', value: scored.filter(s => s.tier === 'WARM').length },
              { label: 'HOT', value: hot },
            ]}
            title="LEAD TIER DISTRIBUTION"
            color="#E8A020"
          />
        </div>

        {/* Recent activity */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '20px 24px' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 16 }}>RECENT ACTIVITY</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1C2936' }}>
                {['SCORE', 'EMAIL', 'TYPE', 'CITY', 'SEGMENT', 'REGISTERED'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 12px', color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', fontWeight: 'normal' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={r.email} style={{ borderBottom: '1px solid #111920', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}>
                  <td style={{ padding: '7px 12px' }}>
                    <span style={{ color: r.lead.tier === 'HOT' ? '#E8A020' : r.lead.tier === 'WARM' ? '#2EA8FF' : '#3D5065', fontSize: 10 }}>
                      {r.lead.total} {r.lead.tier}
                    </span>
                  </td>
                  <td style={{ padding: '7px 12px', color: '#CDD6E0' }}>{r.email}</td>
                  <td style={{ padding: '7px 12px', color: r.type === 'vendor' ? '#E8A020' : '#2EA8FF', fontSize: 9, letterSpacing: '0.15em' }}>{r.type?.toUpperCase()}</td>
                  <td style={{ padding: '7px 12px', color: '#7D8A97', fontSize: 10 }}>{r.city?.toUpperCase()}</td>
                  <td style={{ padding: '7px 12px', color: '#7D8A97', fontSize: 10 }}>{r.lead.segment}</td>
                  <td style={{ padding: '7px 12px', color: '#3D5065', fontSize: 9 }}>{r.created_at?.slice(0, 16).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
