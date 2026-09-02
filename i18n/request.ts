import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, isLocale } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  // An unknown segment (e.g. the dotted paths that bypass middleware) must not
  // reach a dynamic import for `../messages/<junk>.json`.
  const locale = requested && isLocale(requested) ? requested : DEFAULT_LOCALE
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
