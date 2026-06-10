import { describe, it, expect, beforeEach, vi } from 'vitest'
import { SignJWT } from 'jose'

const SECRET = 'test-admin-jwt-secret-at-least-32-chars-long'

// Mock next/headers so isAdminAuthenticated can read a fake cookie store
const cookieStore = { get: vi.fn() }
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(cookieStore),
}))

import {
  verifyAdminToken,
  isAdminAuthenticated,
  signAdminToken,
  ADMIN_COOKIE,
} from '@/lib/admin-auth'

const enc = () => new TextEncoder().encode(SECRET)
const now = () => Math.floor(Date.now() / 1000)

beforeEach(() => {
  process.env.ADMIN_JWT_SECRET = SECRET
  cookieStore.get.mockReset()
})

describe('verifyAdminToken', () => {
  it('accepts a freshly signed admin token', async () => {
    const token = await signAdminToken()
    expect(await verifyAdminToken(token)).toBe(true)
  })

  it('rejects a malformed token', async () => {
    expect(await verifyAdminToken('not.a.real.token')).toBe(false)
    expect(await verifyAdminToken('')).toBe(false)
  })

  // The core regression: a valid signature alone must NOT grant admin access.
  // Other token types (e.g. privacy links) may share the signing secret.
  it('rejects a correctly-signed token whose role is not admin', async () => {
    const token = await new SignJWT({ role: 'privacy' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(enc())
    expect(await verifyAdminToken(token)).toBe(false)
  })

  it('rejects a correctly-signed token with no role claim', async () => {
    const token = await new SignJWT({ foo: 'bar' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(enc())
    expect(await verifyAdminToken(token)).toBe(false)
  })

  it('rejects an admin token signed with a different secret', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(new TextEncoder().encode('a-totally-different-secret-value-here-32'))
    expect(await verifyAdminToken(token)).toBe(false)
  })

  it('rejects an expired admin token', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now() - 3600)
      .setExpirationTime(now() - 1800)
      .sign(enc())
    expect(await verifyAdminToken(token)).toBe(false)
  })
})

describe('isAdminAuthenticated', () => {
  it('returns false when no admin cookie is present', async () => {
    cookieStore.get.mockReturnValue(undefined)
    expect(await isAdminAuthenticated()).toBe(false)
  })

  it('returns false when the cookie holds an invalid token', async () => {
    cookieStore.get.mockReturnValue({ value: 'bogus-token' })
    expect(await isAdminAuthenticated()).toBe(false)
  })

  it('returns true for a valid admin cookie', async () => {
    const token = await signAdminToken()
    cookieStore.get.mockReturnValue({ value: token })
    expect(await isAdminAuthenticated()).toBe(true)
    // sanity: the helper looks up the expected cookie name
    expect(cookieStore.get).toHaveBeenCalledWith(ADMIN_COOKIE)
  })
})
