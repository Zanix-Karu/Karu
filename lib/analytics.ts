// lib/analytics.ts
// Plausible custom event tracking helpers
// Plausible is cookieless — no consent banner needed (NFR-5)

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export function trackEvent(event: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(event, props ? { props } : undefined)
  }
}

export function trackWaitlistSignup(type: 'customer' | 'vendor', city: string) {
  trackEvent('waitlist_signup', { type, city })
}

export function trackCtaClick(cta: string) {
  trackEvent('cta_click', { cta })
}
