interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: string
  delta?: { value: string; positive: boolean }
}

export function MetricCard({ label, value, sub, accent = '#E8A020', delta }: MetricCardProps) {
  return (
    <div style={{
      background: '#0C1118', border: '1px solid #1C2936',
      padding: '20px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent }} />
      <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ color: '#CDD6E0', fontSize: 32, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
        {sub && <div style={{ color: '#3D5065', fontSize: 10, letterSpacing: '0.05em' }}>{sub}</div>}
        {delta && (
          <div style={{ color: delta.positive ? '#34D399' : '#F05252', fontSize: 10, letterSpacing: '0.05em' }}>
            {delta.positive ? '▲' : '▼'} {delta.value}
          </div>
        )}
      </div>
    </div>
  )
}
