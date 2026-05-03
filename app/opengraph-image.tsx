import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Karu — Verified Car Rentals in Cameroon'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(ellipse 80% 70% at 50% 40%, #3D2510 0%, #2A1A0A 45%, #1C1208 100%)',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid dots */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(232,160,32,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Amber glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(232,160,32,0.12) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '0.2em',
            color: '#E8A020',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          KARU
        </div>

        {/* Amber divider */}
        <div
          style={{
            width: '80px',
            height: '2px',
            background: '#E8A020',
            marginBottom: '28px',
            display: 'flex',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 400,
            color: '#F5EFE4',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.4,
            display: 'flex',
          }}
        >
          Book Trusted Rental Cars in Cameroon
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 300,
            color: 'rgba(245,239,228,0.55)',
            marginTop: '16px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'flex',
          }}
        >
          Douala · Yaoundé · Launching Soon
        </div>
      </div>
    ),
    { ...size }
  )
}
