'use client'

import { useEffect, useRef, useState } from 'react'

interface Point {
  lat: number
  lng: number
  type: string
  city: string
  email: string
  country?: string
}

interface Props {
  points: Point[]
}

export function MapView({ points }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<unknown>(null)
  const [tooltip, setTooltip] = useState<{ point: Point; x: number; y: number } | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    async function initMap() {
      const L = (await import('leaflet')).default
      // Load leaflet CSS dynamically
      if (!document.querySelector('#leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      const map = L.map(mapRef.current!, {
        center: [4.5, 11.5],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      })

      mapInstance.current = map

      // Dark tile layer (CartoDB Dark Matter)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CARTO',
        maxZoom: 18,
      }).addTo(map)

      // Custom zoom control (bottom right)
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Plot markers
      points.forEach(p => {
        if (!p.lat || !p.lng) return

        const color = p.type === 'vendor' ? '#E8A020' : '#2EA8FF'
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:8px;height:8px;background:${color};border:1px solid rgba(255,255,255,0.2);box-shadow:0 0 8px ${color}80;"></div>`,
          iconSize: [8, 8],
          iconAnchor: [4, 4],
        })

        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)
        marker.bindPopup(`
          <div style="font-family:monospace;font-size:10px;background:#0C1118;color:#CDD6E0;padding:10px 12px;border:1px solid #1C2936;min-width:160px;">
            <div style="color:${color};font-size:9px;letter-spacing:0.2em;margin-bottom:6px;">${p.type.toUpperCase()}</div>
            <div style="color:#7D8A97;margin-bottom:2px;">${p.email}</div>
            <div style="color:#3D5065;font-size:9px;">${p.city?.toUpperCase()} · ${p.country ?? 'CM'}</div>
          </div>
        `, {
          className: 'karu-popup',
          closeButton: false,
        })
      })

      // Style Leaflet popup
      const style = document.createElement('style')
      style.textContent = `
        .karu-popup .leaflet-popup-content-wrapper { background: transparent; border: none; box-shadow: none; padding: 0; border-radius: 0; }
        .karu-popup .leaflet-popup-content { margin: 0; }
        .karu-popup .leaflet-popup-tip-container { display: none; }
        .leaflet-container { background: #060A0E; }
        .leaflet-bar a { background: #0C1118 !important; border-color: #1C2936 !important; color: #7D8A97 !important; border-radius: 0 !important; }
        .leaflet-bar a:hover { background: #1C2936 !important; color: #E8A020 !important; }
      `
      document.head.appendChild(style)
    }

    initMap()
  }, [points])

  // Country breakdown
  const countries = points.reduce<Record<string, number>>((acc, p) => {
    const c = p.country ?? 'Unknown'
    acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})
  const sortedCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const vendorCount = points.filter(p => p.type === 'vendor').length
  const customerCount = points.filter(p => p.type === 'customer').length

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative', border: '1px solid #1C2936' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 500 }} />
      </div>

      {/* Sidebar */}
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Legend */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '16px 20px' }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 12 }}>LEGEND</div>
          {[['VENDOR', '#E8A020', vendorCount], ['CUSTOMER', '#2EA8FF', customerCount]].map(([label, color, count]) => (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, background: color as string, boxShadow: `0 0 6px ${color}80` }} />
              <span style={{ color: '#7D8A97', fontSize: 10, flex: 1 }}>{label as string}</span>
              <span style={{ color: '#CDD6E0', fontSize: 10 }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Geographic breakdown */}
        <div style={{ background: '#0C1118', border: '1px solid #1C2936', padding: '16px 20px', flex: 1 }}>
          <div style={{ color: '#3D5065', fontSize: 9, letterSpacing: '0.2em', marginBottom: 12 }}>ORIGIN</div>
          {sortedCountries.map(([country, count]) => {
            const pct = Math.round((count / points.length) * 100)
            return (
              <div key={country} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#7D8A97', fontSize: 10 }}>{country}</span>
                  <span style={{ color: '#CDD6E0', fontSize: 10 }}>{count}</span>
                </div>
                <div style={{ height: 2, background: '#1C2936' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#E8A020' }} />
                </div>
              </div>
            )
          })}
          {sortedCountries.length === 0 && (
            <div style={{ color: '#3D5065', fontSize: 10 }}>No geo data yet.<br />Data captured at signup on Vercel.</div>
          )}
        </div>
      </div>
    </div>
  )
}
