import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// The only dependency we drive from the tests: the auth guard.
const { isAdminAuthenticated } = vi.hoisted(() => ({
  isAdminAuthenticated: vi.fn(),
}))
vi.mock('@/lib/admin-auth', () => ({ isAdminAuthenticated }))

// Stub out everything the routes touch after the auth check so the handlers
// can run without real Supabase / Resend / encryption credentials.
vi.mock('@/lib/supabase-admin', () => {
  const makeQuery = (result: unknown) => {
    const q: Record<string, unknown> = {}
    for (const m of ['select', 'order', 'eq', 'or', 'neq', 'gte', 'lte', 'limit', 'insert']) {
      q[m] = vi.fn(() => q)
    }
    // make the builder awaitable
    ;(q as { then: unknown }).then = (resolve: (v: unknown) => unknown) => resolve(result)
    return q
  }
  return { supabaseAdmin: { from: vi.fn(() => makeQuery({ data: [], error: null })) } }
})
vi.mock('@/lib/sentiment', () => ({ scoreEntry: () => ({ tier: 'cold' }) }))
vi.mock('@/lib/email-encrypt', () => ({ encryptBody: () => ({ encrypted: 'x', iv: 'y' }) }))
vi.mock('@/lib/email-template', () => ({ wrapInKaruTemplate: (h: string) => h }))
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: async () => ({ data: { id: 'res_1' }, error: null }) }
  },
}))

import { GET as dataGET } from '@/app/api/admin/data/route'
import { GET as emailsGET } from '@/app/api/admin/emails/route'
import { POST as sendPOST } from '@/app/api/admin/send/route'

beforeEach(() => {
  isAdminAuthenticated.mockReset()
})

// Regression guard for the PII leak: every admin API route MUST reject
// unauthenticated requests with 401 before touching any data.
describe('admin API routes reject unauthenticated requests', () => {
  it('GET /api/admin/data returns 401 without auth', async () => {
    isAdminAuthenticated.mockResolvedValue(false)
    const res = await dataGET(new NextRequest('https://test/api/admin/data'))
    expect(res.status).toBe(401)
  })

  it('GET /api/admin/emails returns 401 without auth', async () => {
    isAdminAuthenticated.mockResolvedValue(false)
    const res = await emailsGET()
    expect(res.status).toBe(401)
  })

  it('POST /api/admin/send returns 401 without auth', async () => {
    isAdminAuthenticated.mockResolvedValue(false)
    const res = await sendPOST(
      new NextRequest('https://test/api/admin/send', {
        method: 'POST',
        body: JSON.stringify({ subject: 'x', html: 'y' }),
      }),
    )
    expect(res.status).toBe(401)
  })

  it('does not leak data in the 401 body', async () => {
    isAdminAuthenticated.mockResolvedValue(false)
    const res = await dataGET(new NextRequest('https://test/api/admin/data'))
    const body = await res.json()
    expect(body.data).toBeUndefined()
    expect(body.error).toBeDefined()
  })
})

describe('admin API routes allow authenticated requests', () => {
  it('GET /api/admin/data returns 200 when authenticated', async () => {
    isAdminAuthenticated.mockResolvedValue(true)
    const res = await dataGET(new NextRequest('https://test/api/admin/data'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.data)).toBe(true)
  })
})
