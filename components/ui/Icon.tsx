// Brand-palette SVG icons — all use currentColor so they inherit text color

interface IconProps {
  className?: string
  size?: number
}

export function IconShield({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconWhatsApp({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.07-1.35A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 9.5c.5 1 1.5 2.5 3 3.5s2.5 1.5 3 1.5c.3-.5.5-1 .5-1s-1-.5-1.5-.75-.75-.25-.75-.25-.5.25-1-.5S10 10 10 10s-.25-.5-.75-.75S8 8.5 8 8.5s-.5.5.5 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconCreditCard({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconPlane({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M21 16l-9-4-7 3-1-2 7-4V4l2 1 1 4 7 3v2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M5 19h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconStar({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconCar({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 11l1.5-4.5h11L19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="11" width="20" height="7" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 14h20" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconMapPin({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

export function IconTarget({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  )
}

export function IconUsers({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 20c0-2.76-1.79-5.11-4.27-5.82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IconCheckCircle({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconQuote({ className = 'text-amber', size = 28 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}
