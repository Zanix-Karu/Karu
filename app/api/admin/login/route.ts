import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { signAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth'

/** Constant-time comparison via digest — avoids leaking match length/prefix. */
function safeCompare(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}

// Simple in-memory rate limiter for admin login attempts.
// Resets on cold-start (serverless), but catches burst attacks within a single instance.
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry) return false
  // Reset window if expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  } else {
    entry.count++
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // Rate limit check
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again in 15 minutes.' },
      { status: 429 }
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
    recordAttempt(ip)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // Successful login — clear rate limit and issue token
  clearAttempts(ip)
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
