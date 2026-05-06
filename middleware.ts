import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
})

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Maintenance mode — toggle via MAINTENANCE_MODE env var in Vercel
  if (process.env.MAINTENANCE_MODE === 'true') {
    // Allow access to the maintenance page itself and static assets
    if (pathname === '/maintenance' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }
    // Redirect everything else to maintenance page
    const url = request.nextUrl.clone()
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  // Block access to maintenance page when not in maintenance mode
  if (pathname === '/maintenance') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }

  // Normal i18n routing
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
