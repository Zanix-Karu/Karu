'use client'

import { useState, useMemo } from 'react'
import { tierColor } from '@/lib/sentiment'

interface Entry {
  id: string
  email: string
  type: string
  city: string
  locale: string
  business_name?: string
  phone?: string
  vehicle_count?: string
  country?: string
  city_geo?: string
  created_at: string
  lead: { total: number; tier: 'HOT' | 'WARM' | 'COLD'; segment: string; flags: string[] }
}

interface Props {
  initialData: Entry[]
}

type SortKey = 'created_at' | 'lead' | 'email' | 'type' | 'city'

export function WaitlistTable({ initialData }: Props) {
  const [data, setData] = useState<Entry[]>(initialData)
  const [filters, setFilters] = useState({ type: 'all', city: 'all', tier: 'all', locale: 'all', q: '' })
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'created_at', dir: -1 })
  const [loading, setLoading] = useState(false)

  async function applyFilters(next: typeof filters) {
    setFilters(next)
    setLoading(true)
    const p = new URLSearchParams()
    if (next.type !== 'all') p.set('type', next.type)
    if (next.city !== 'all') p.set('city', next.city)
    if (next.tier !== 'all') p.set('tier', next.tier)
    if (next.locale !== 'all') p.set('locale', next.locale)
    if (next.q) p.set('q', next.q)
    const res = await fetch(`/api/admin/data?${p}`)
    const json = await res.json()
    setData(json.data ?? [])
    setLoading(false)
  }

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      let av: string | number = 0, bv: string | number = 0
      if (sort.key === 'created_at') { av = a.created_at; bv = b.created_at }
      else if (sort.key === 'lead') { av = a.lead.total; bv = b.lead.total }
      else if (sort.key === 'email') { av = a.email; bv = b.email }
      else if (sort.key === 'type') { av = a.type; bv = b.type }
      else if (sort.key === 'city') { av = a.city; bv = b.city }
      return av < bv ? -sort.dir : av > bv ? sort.dir : 0
    })
  }, [data, sort])

  function toggleSort(key: SortKey) {
    setSort(s => s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: -1 })
  }

  const inputStyle: React.CSSProperties = {
    background: '#060A0E', border: '1px solid #1C2936', color: '#CDD6E0',
    padding: '6px 10px', fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.1em',
    outline: 'none', cursor: 'pointer',
  }

  const selStyle = { ...inputStyle, color: '#7D8A97' }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <input
          placeholder="SEARCH EMAIL / BUSINESS..."
          value={filters.q}
          onChange={e => applyFilters({ ...filters, q: e.target.value })}
          style={{ ...inputStyle, width: 240, color: '#CDD6E0' }}
        />
        {(['type', 'city', 'tier', 'locale'] as const).map(key => (
          <select key={key} value={filters[key]} onChange={e => applyFilters({ ...filters, [key]: e.target.value })} style={selStyle}>
            <option value="all">{key.toUpperCase()}: ALL</option>
            {key === 'type' && <><option value="vendor">VENDOR</option><option value="customer">CUSTOMER</option></>}
            {key === 'city' && <><option value="douala">DOUALA</option><option value="yaounde">YAOUNDÉ</option><option value="other">OTHER</option></>}
            {key === 'tier' && <><option value="HOT">HOT</option><option value="WARM">WARM</option><option value="COLD">COLD</option></>}
            {key === 'locale' && <><option value="en">EN</option><option value="fr">FR</option></>}
          </select>
        ))}
        <div style={{ marginLeft: 'auto', color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>
          {loading ? 'LOADING...' : `${sorted.length} RECORDS`}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1C2936' }}>
              {([
                ['SCORE', 'lead'], ['EMAIL', 'email'], ['TYPE', 'type'], ['CITY', 'city'],
                ['LOCALE', null], ['BUSINESS', null], ['PHONE', null], ['FLEET', null],
                ['COUNTRY', null], ['SEGMENT', null], ['REGISTERED', 'created_at'],
              ] as [string, SortKey | null][]).map(([label, key]) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key) : undefined}
                  style={{
                    textAlign: 'left', padding: '8px 12px', color: '#3D5065',
                    fontSize: 9, letterSpacing: '0.2em', fontWeight: 'normal',
                    cursor: key ? 'pointer' : 'default', whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  {label} {key && sort.key === key ? (sort.dir === 1 ? '▲' : '▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.id ?? row.email}
                style={{
                  borderBottom: '1px solid #111920',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,160,32,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)')}
              >
                <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 32, height: 4, background: '#1C2936', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${row.lead.total}%`, background: tierColor(row.lead.tier) }} />
                    </div>
                    <span style={{ color: tierColor(row.lead.tier), fontSize: 10 }}>{row.lead.total}</span>
                    <span style={{ fontSize: 8, letterSpacing: '0.15em', color: tierColor(row.lead.tier), opacity: 0.7 }}>{row.lead.tier}</span>
                  </div>
                </td>
                <td style={{ padding: '8px 12px', color: '#CDD6E0', letterSpacing: '0.03em' }}>{row.email}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ color: row.type === 'vendor' ? '#E8A020' : '#2EA8FF', fontSize: 9, letterSpacing: '0.2em' }}>
                    {row.type?.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>{row.city?.toUpperCase()}</td>
                <td style={{ padding: '8px 12px', color: '#3D5065', fontSize: 10 }}>{row.locale?.toUpperCase()}</td>
                <td style={{ padding: '8px 12px', color: '#7D8A97', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {row.business_name ?? <span style={{ color: '#1C2936' }}>—</span>}
                </td>
                <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>
                  {row.phone ?? <span style={{ color: '#1C2936' }}>—</span>}
                </td>
                <td style={{ padding: '8px 12px', color: '#7D8A97', fontSize: 10 }}>
                  {row.vehicle_count ?? <span style={{ color: '#1C2936' }}>—</span>}
                </td>
                <td style={{ padding: '8px 12px', color: '#3D5065', fontSize: 10 }}>{row.country ?? '—'}</td>
                <td style={{ padding: '8px 12px' }}>
                  <span style={{ color: '#7D8A97', fontSize: 9, letterSpacing: '0.1em' }}>{row.lead.segment}</span>
                </td>
                <td style={{ padding: '8px 12px', color: '#3D5065', fontSize: 9, whiteSpace: 'nowrap' }}>
                  {row.created_at ? new Date(row.created_at).toISOString().slice(0, 16).replace('T', ' ') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#3D5065', fontSize: 10, letterSpacing: '0.2em' }}>
            NO RECORDS MATCH CURRENT FILTERS
          </div>
        )}
      </div>
    </div>
  )
}
