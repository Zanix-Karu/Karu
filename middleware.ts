import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
})

function jwtSecret(): Uint8Array | null {
  // Fail closed: no fallback secret. If ADMIN_JWT_SECRET is unset, admin access
  // is denied outright (matches lib/admin-auth, which throws when it's missing).
  const s = process.env.ADMIN_JWT_SECRET
  if (!s) return null
  return new TextEncoder().encode(s)
}

/**
 * Verify the admin JWT *and* its role claim. The claim check matters:
 * other tokens in the system (e.g. privacy-rights confirmation links) may be
 * signed with the same secret when PRIVACY_TOKEN_SECRET is unset — signature
 * alone must never grant admin access.
 */
async function isValidAdminToken(token: string): Promise<boolean> {
  try {
    const key = jwtSecret()
    if (!key) return false
    const { payload } = await jwtVerify(token, key, { issuer: 'karu-admin' })
    return payload.role === 'admin'
  } catch {
    return false
  }
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
  if (token && await isValidAdminToken(token)) {
    return NextResponse.next()
  }

  const res = NextResponse.redirect(new URL('/admin/login', request.url))
  res.cookies.delete('karu_admin')
  return res
}

/** JSON 401 for unauthenticated admin API calls. */
function adminApiUnauthorised(): NextResponse {
  return NextResponse.json(
    { success: false, error: { code: 'UNAUTHORISED', message: 'Authentication required' } },
    { status: 401 }
  )
}

async function handleAdminApi(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Login + logout are the only unauthenticated admin endpoints
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next()
  }

  const token = request.cookies.get('karu_admin')?.value
  if (token && await isValidAdminToken(token)) {
    return NextResponse.next()
  }
  return adminApiUnauthorised()
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes bypass i18n entirely
  if (pathname.startsWith('/api')) {
    // Admin API routes require a valid admin JWT (role-checked)
    if (pathname.startsWith('/api/admin')) return handleAdminApi(request)
    return NextResponse.next()
  }

  // Admin routes bypass i18n entirely
  if (pathname.startsWith('/admin')) {
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
