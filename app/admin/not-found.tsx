export default function AdminNotFound() {
  return (
    <div style={{ background: '#060A0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#fbd301', fontSize: 48, fontWeight: 'bold', marginBottom: 8 }}>404</div>
        <div style={{ color: '#CDD6E0', fontSize: 13, letterSpacing: '0.15em', marginBottom: 24 }}>PAGE NOT FOUND</div>
        <a
          href="/admin/dashboard"
          style={{
            color: '#fbd301',
            fontSize: 11,
            letterSpacing: '0.2em',
            textDecoration: 'none',
            borderBottom: '1px solid #fbd301',
            paddingBottom: 2,
          }}
        >
          RETURN TO DASHBOARD →
        </a>
      </div>
    </div>
  )
}
