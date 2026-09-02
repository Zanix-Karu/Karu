/**
 * The single source of truth for supported locales.
 *
 * Previously the list lived inline in `middleware.ts` only, so nothing
 * validated the `[locale]` segment itself. Paths containing a dot skip the
 * middleware matcher (`/((?!_next|_vercel|.*\..*).*)`), which let a request
 * for `/foo.xml` match `[locale]` literally and render the landing page with
 * `<html lang="foo.xml">` under a 200 — an indexable soft-404 duplicate of the
 * homepage for every dotted path. The layout now validates against this list.
 */
export const LOCALES = ['en', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}
