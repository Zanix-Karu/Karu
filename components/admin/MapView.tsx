'use client'

import { useEffect, useRef, useState } from 'react'

interface Point {
  lat: number
  lng: number
  type: string
  city: string
  email: string
  country?: string
  city_geo?: string
  business_name?: string
}

interface Props {
  points: Point[]
}

const TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export function MapView({ points }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const [hovered, setHovered] = useState<Point | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Country breakdown
  const countries = points.reduce<Record<string, number>>((acc, p) => {
    const c = p.country ?? 'Unknown'
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})
  const sortedCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const vendorCount = points.filter(p => p.type === 'vendor').length
  const customerCount = points.filter(p => p.type === 'customer').length

  useEffect(() => {
    if (mapRef.current) return // already initialised
    if (!containerRef.current) return

    async function init() {
      try {
        // 1. Inject Leaflet CSS into <head> before initialising the map
        if (!document.getElementById('leaflet-css')) {
          await new Promise<void>((resolve, reject) => {
            const link = document.createElement('link')
            link.id = 'leaflet-css'
            link.rel = 'stylesheet'
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            link.onload = () => resolve()
            link.onerror = () => reject(new Error('Leaflet CSS failed to load'))
            document.head.appendChild(link)
          })
        }

        // 2. Load Leaflet JS
        const L = (await import('leaflet')).default

        // 3. Fix Leaflet's broken default icon paths (webpack issue)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({ iconUrl: '', shadowUrl: '' })

        if (!containerRef.current) return

        // 4. Initialise map centred on Cameroon
        const map = L.map(containerRef.current, {
          center: [4.5, 11.5],
          zoom: 6,
          zoomControl: false,
          attributionControl: false,
          preferCanvas: true,
        })

        mapRef.current = map

        // 5. Dark tile layer
        L.tileLayer(TILE, { maxZoom: 19 }).addTo(map)

        // 6. Custom zoom — bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(map)

        // 7. Inject Palantir map overrides
        const style = document.getElementById('leaflet-pal') ?? document.createElement('style')
        style.id = 'leaflet-pal'
        style.textContent = `
          .leaflet-container { background: #060A0E !important; font-family: "JetBrains Mono", monospace; }
          .leaflet-bar a { background: #0C1118 !important; border: 1px solid #1C2936 !important;
            color: #7D8A97 !important; border-radius: 0 !important; width: 28px !important; height: 28px !important;
            line-height: 28px !important; }
          .leaflet-bar a:hover { background: #1C2936 !important; color: #E8A020 !important; }
          .leaflet-bar { border: none !important; box-shadow: none !important; }
          .leaflet-tile-pane { filter: brightness(0.85) contrast(1.1); }
        `
        if (!document.getElementById('leaflet-pal')) document.head.appendChild(style)

        // 8. Add markers
        points.forEach(p => {
          if (!p.lat || !p.lng) return
          const isVendor = p.type === 'vendor'
          const color = isVendor ? '#E8A020' : '#2EA8FF'
          const size = isVendor ? 10 : 8

          const icon = L.divIcon({
            className: '',
            html: `
              <div style="
                width:${size}px;height:${size}px;
                background:${color};
                box-shadow:0 0 10px ${color}99, 0 0 4px ${color};
                cursor:pointer;
                transition:transform 0.15s;
              " class="karu-pin"></div>
            `,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          })

          const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)

          // Hover events — update React state for the info panel
          marker.on('mouseover', () => setHovered(p))
          marker.on('mouseout', () => setHovered(null))
          marker.on('click', () => setHovered(h => h?.email === p.email ? null : p))
        })

        setReady(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Map failed to load')
      }
    }

    init()

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapRef.current as any).remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', gap: 12, height: 600 }}>

      {/* ── Map ───────────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', border: '1px solid #1C2936', overflow: 'hidden', minWidth: 0 }}>

        {/* Hover tooltip — absolutely positioned over the map */}
        {hovered && (
          <div style={{
            position: 'absolute', top: 16, left: 16, zIndex: 1000,
            background: '#0C1118', border: `1px solid ${hovered.type === 'vendor' ? '#E8A020' : '#2EA8FF'}`,
            padding: '12px 16px', minWidth: 200, pointerEvents: 'none',
          }}>
            <div style={{ color: hovered.type === 'vendor' ? '#E8A020' : '#2EA8FF', fontSize: 9, letterSpacing: '0.2em', marginBottom: 8 }}>
              {hovered.type.toUpperCase()} · {hovered.city?.toUpperCase()}
            </div>
            <div style={{ color: '#CDD6E0', fontSize: 11, marginBottom: 4 }}>{hovered.email}</div>
            {hovered.business_name && (
              <div style={{ color: '#7D8A97', fontSize: 10, marginBottom: 4 }}>{hovered.business_name}</div>
            )}
            <div style={{ color: '#3D5065', fontSize: 9, marginTop: 6 }}>
              {hovered.city_geo ?? hovered.city} · {hovered.country ?? 'CM'}
            </div>
            <div style={{ color: '#3D5065', fontSize: 9 }}>
              {hovered.lat.toFixed(4)}° N · {hovered.lng.toFixed(4)}° E
            </div>
          </div>
        )}

        {/* Loading / error states */}
        {!ready && !error && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 999, background: '#060A0E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3D5065', fontSize: 10, letterSpacing: '0.2em',
          }}>
            LOADING MAP TILES...
          </div>
        )}
        {error && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 999, background: '#060A0E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F05252', fontSize: 10, letterSpacing: '0.15em',
          }}>
            {error}
          </div>
        )}

        {/* Leaflet target — must have explicit pixel height */}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* ── Right panel ───────────────────────────────────────────── */}
      <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>

        {/* Stats */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '16px 20px' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 14 }}>SIGNAL TYPES</div>
          {([['VENDOR', '#E8A020', vendorCount], ['CUSTOMER', '#2EA8FF', customerCount]] as const).map(([label, color, count]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ color: '#7D8A97', fontSize: 10, flex: 1 }}>{label}</span>
              <span style={{ color: '#CDD6E0', fontSize: 10, fontWeight: 700 }}>{count}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #1C2936', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#3D5065', fontSize: 9 }}>TOTAL SIGNALS</span>
            <span style={{ color: '#E8A020', fontSize: 10, fontWeight: 700 }}>{points.length}</span>
          </div>
        </div>

        {/* Geo breakdown */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 14 }}>ORIGIN DISTRIBUTION</div>
          {sortedCountries.length === 0 ? (
            <div style={{ color: '#3D5065', fontSize: 10 }}>
              No geo data yet.<br /><br />
              Coordinates are captured from Vercel edge headers on signup.
            </div>
          ) : sortedCountries.map(([country, count]) => {
            const pct = Math.round((count / points.length) * 100)
            return (
              <div key={country} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#7D8A97', fontSize: 10 }}>{country}</span>
                  <span style={{ color: '#CDD6E0', fontSize: 10 }}>{count} <span style={{ color: '#3D5065' }}>({pct}%)</span></span>
                </div>
                <div style={{ height: 2, background: '#1C2936' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#E8A020', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Hint */}
        <div style={{ color: '#1C2936', fontSize: 8, letterSpacing: '0.1em', textAlign: 'center' }}>
          HOVER PINS TO IDENTIFY
        </div>
      </div>
    </div>
  )
}
