import { supabaseAdmin } from '@/lib/supabase-admin'
import { MapView } from '@/components/admin/MapView'

export default async function MapPage() {
  const { data } = await supabaseAdmin
    .from('waitlist_entries')
    .select('lat, lng, type, city, email, country, city_geo, business_name')
    .not('lat', 'is', null)
    .not('lng', 'is', null)

  const points = (data ?? []).filter(p => p.lat && p.lng) as {
    lat: number
    lng: number
    type: string
    city: string
    email: string
    country?: string
    city_geo?: string
    business_name?: string
  }[]

  return (
    <div>
      <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid #1C2936', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.25em', marginBottom: 6 }}>KARU INTELLIGENCE PLATFORM</div>
          <div style={{ color: '#CDD6E0', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>GEOGRAPHIC DISTRIBUTION</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.15em' }}>{points.length} GEOLOCATED SIGNALS</div>
          <div style={{ color: '#1C2936', fontSize: 9, marginTop: 4 }}>CAPTURED VIA VERCEL EDGE AT SIGNUP</div>
        </div>
      </div>

      <div style={{ padding: '24px 32px' }}>
        <MapView points={points} />
      </div>
    </div>
  )
}
