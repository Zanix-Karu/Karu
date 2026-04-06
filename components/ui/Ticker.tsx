'use client'

interface TickerProps {
  items: string[]
  className?: string
}

export function Ticker({ items, className = '' }: TickerProps) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="flex w-max animate-ticker hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 font-sans text-[0.78rem] font-bold tracking-[0.18em] uppercase text-espresso whitespace-nowrap"
          >
            {item}
            <span className="text-espresso/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
