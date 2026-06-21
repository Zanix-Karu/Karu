export default function AdminLoading() {
  return (
    <div style={{ padding: '24px 32px' }}>
      <div style={{ padding: '24px 0 20px', borderBottom: '1px solid #1C2936', marginBottom: 24 }}>
        <div style={{ background: '#1C2936', height: 10, width: 180, marginBottom: 8, borderRadius: 2 }} />
        <div style={{ background: '#1C2936', height: 18, width: 260, borderRadius: 2 }} />
      </div>

      {/* KPI skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ background: '#0C1118', border: '1px solid #1C2936', padding: 20, height: 80 }}>
            <div style={{ background: '#1C2936', height: 9, width: 80, marginBottom: 12, borderRadius: 2 }} />
            <div style={{ background: '#1C2936', height: 24, width: 60, borderRadius: 2 }} />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', height: 200 }} />
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', height: 200 }} />
      </div>

      {/* Pulse animation */}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } } [style*="background: #1C2936"] { animation: pulse 1.5s ease-in-out infinite; }`}</style>
    </div>
  )
}
