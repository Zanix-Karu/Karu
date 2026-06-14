import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { signAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth'
import { rateLimit, rateLimitKeyForIp } from '@/lib/rate-limit'

/** Constant-time comparison via digest — avoids leaking match length/prefix. */
function safeCompare(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}

export async function POST(request: NextRequest) {
  // Persistent rate limit: 5 login attempts per IP per 15 min, shared across
  // serverless instances (the previous in-memory Map reset on every cold start).
  const rlKey = await rateLimitKeyForIp(request, 'admin_login')
  const rl = await rateLimit(rlKey, 5, 15 * 60)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  let body: { password?: string; turnstile_token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { password, turnstile_token } = body

  // Verify Turnstile if configured (protects against credential stuffing)
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (turnstileSecret) {
    if (!turnstile_token || typeof turnstile_token !== 'string') {
      return NextResponse.json({ error: 'Human verification required' }, { status: 403 })
    }
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: turnstileSecret, response: turnstile_token }),
    })
    const verifyData = await verifyRes.json() as { success: boolean }
    if (!verifyData.success) {
      return NextResponse.json({ error: 'Human verification failed' }, { status: 403 })
    }
  }

  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || typeof password !== 'string' || !safeCompare(password, adminSecret)) {
    // The attempt was already counted by the rate limiter above.
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // Successful login — issue token
  const token = await signAdminToken()
  const res = NextResponse.json({ ok: true })

  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12h
    path: '/',
  })

  return res
}
