import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
})

function jwtSecret() {
  const s = process.env.ADMIN_JWT_SECRET ?? 'fallback-dev-secret-change-in-prod'
  return new TextEncoder().encode(s)
}

async function handleAdmin(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Login page is always accessible
  if (pathname === '/admin/login') return NextResponse.next()

  // Redirect bare /admin to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  const token = request.cookies.get('karu_admin')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, jwtSecret())
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', request.url))
    res.cookies.delete('karu_admin')
    return res
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin routes and admin API routes bypass i18n entirely
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname.startsWith('/api/admin')) return NextResponse.next()
    return handleAdmin(request)
  }

  // Maintenance mode
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (pathname === '/maintenance' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }
    const url = request.nextUrl.clone()
    url.pathname = '/maintenance'
    return NextResponse.rewrite(url)
  }

  // Block maintenance page when not in maintenance mode
  if (pathname === '/maintenance') {
    const url = request.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
