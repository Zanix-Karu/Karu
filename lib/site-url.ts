/**
 * The one canonical origin for the marketing site.
 *
 * SEO: the naked apex `getkaru.io` 307s to `www`, so any canonical, og:url or
 * sitemap <loc> built on it splits the ranking signal and costs every crawler
 * a redirect hop. `www.getkaru.io` is the host we publish; everything that
 * emits an absolute URL reads it from here rather than hard-coding a domain.
 *
 * Overridable via NEXT_PUBLIC_SITE_URL so preview deployments and local dev
 * describe themselves honestly. A trailing slash is stripped so callers can
 * always write `${SITE_URL}/path`.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.getkaru.io'
).replace(/\/$/, '')

/** Absolute URL for a site-relative path, e.g. siteUrl('/en/privacy'). */
export function siteUrl(path = ''): string {
  if (!path) return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * The booking app, which lives on its own subdomain and its own deployment
 * (`~/Developer/karu-app`). The marketing site links out to it rather than
 * proxying it, so the two stay independently deployable.
 */
export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.getkaru.io'
).replace(/\/$/, '')
