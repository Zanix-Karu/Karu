import { NextRequest } from 'next/server'

/**
 * Shared CSRF origin allow-list for state-changing API routes.
 *
 * SECURITY: we do NOT allow arbitrary `*.vercel.app`. A wildcard there is an
 * open door — anyone can deploy a project named `karu-<anything>.vercel.app`
 * and pass the check. Preview deployments must be listed explicitly via
 * ALLOWED_PREVIEW_ORIGINS (comma-separated env), or reached in dev mode.
 */
const ALLOWED_ORIGINS = [
  'https://getkaru.io',
  'https://www.getkaru.io',
  'https://karu-mu.vercel.app', // the single stable preview alias
]

function previewOrigins(): string[] {
  return (process.env.ALLOWED_PREVIEW_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function originAllowed(value: string): boolean {
  const allow = [...ALLOWED_ORIGINS, ...previewOrigins()]
  // Exact origin match only — no startsWith, no wildcard.
  return allow.includes(value)
}

/**
 * True if the request's Origin (preferred) or Referer origin is allow-listed.
 * In non-production, always true to keep local dev frictionless.
 */
export function isAllowedOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') return true

  const origin = request.headers.get('origin')
  if (origin) return originAllowed(origin)

  // Fall back to Referer's origin only if Origin header is absent.
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return originAllowed(new URL(referer).origin)
    } catch {
      return false
    }
  }

  // No Origin and no Referer on a state-changing request → reject.
  return false
}

/** CSRF header check used alongside the origin allow-list. */
export function hasXhrHeader(request: NextRequest): boolean {
  return request.headers.get('x-requested-with') === 'XMLHttpRequest'
}
