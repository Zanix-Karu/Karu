'use client'

import { useState } from 'react'

interface TrustCardProps {
  title: string
  body: string
  num: string
  delay: number
  children: React.ReactNode
}

export function TrustCard({ title, body, num, delay, children }: TrustCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="reveal relative overflow-hidden px-8 py-12 md:px-10 md:py-12 cursor-default transition-colors duration-300"
      style={{
        background: hovered ? 'var(--cognac)' : 'var(--mahogany)',
        transitionDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] origin-left transition-transform duration-[450ms] ease-out"
        style={{
          background: 'linear-gradient(90deg, var(--amber), var(--amber-light))',
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(200,132,26,0.1)' }}>
        {children}
      </div>
      <h3 className="font-sans text-[0.64rem] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--amber)' }}>{title}</h3>
      <p className="font-serif font-light leading-[1.8]" style={{ fontSize: '0.95rem', color: 'var(--cream-dim)' }}>{body}</p>
      <span className="absolute bottom-4 right-5 font-serif font-semibold leading-none select-none pointer-events-none" style={{ fontSize: '4.5rem', color: 'rgba(200,132,26,0.04)' }}>{num}</span>
    </div>
  )
}
