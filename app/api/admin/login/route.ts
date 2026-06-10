import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { signAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth'

/** Constant-time comparison via digest — avoids leaking match length/prefix. */
function safeCompare(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest()
  const db = createHash('sha256').update(b).digest()
  return timingSafeEqual(da, db)
}

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({}))
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || typeof password !== 'string' || !safeCompare(password, adminSecret)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

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
