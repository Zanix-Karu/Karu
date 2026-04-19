'use client'

import { CSSProperties } from 'react'

interface TickerProps {
  items: string[]
  className?: string
  style?: CSSProperties
}

export function Ticker({ items, className = '', style }: TickerProps) {
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} style={style} aria-hidden="true">
      <div
        className="inline-flex hover:[animation-play-state:paused]"
        style={{ animation: 'ticker 30s linear infinite' }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-8">
            {item}
            <span style={{ opacity: 0.4 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
