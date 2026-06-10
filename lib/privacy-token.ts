/**
 * Server-side only — signed, time-limited tokens for privacy rights requests
 * (Law 2024/017: deletion, export, objection).
 *
 * The token proves ownership of the email address: it is only ever delivered
 * to the address it concerns. HS256 JWT via jose (already a dependency).
 */
import { SignJWT, jwtVerify } from 'jose'

export type PrivacyRequestType = 'deletion' | 'export' | 'objection'

export interface PrivacyTokenPayload {
  email: string
  requestType: PrivacyRequestType
  requestId: string
  locale: 'en' | 'fr'
}

const TOKEN_TTL = '24h'

function secret(): Uint8Array {
  const s = process.env.PRIVACY_TOKEN_SECRET ?? process.env.ADMIN_JWT_SECRET
  if (!s) throw new Error('[privacy-token] No PRIVACY_TOKEN_SECRET or ADMIN_JWT_SECRET configured')
  return new TextEncoder().encode(s)
}

export async function createPrivacyToken(payload: PrivacyTokenPayload): Promise<string> {
  return new SignJWT({
    sub: payload.email,
    prt: payload.requestType,
    rid: payload.requestId,
    loc: payload.locale,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('karu-privacy')
    .setExpirationTime(TOKEN_TTL)
    .sign(secret())
}

export async function verifyPrivacyToken(token: string): Promise<PrivacyTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret(), { issuer: 'karu-privacy' })
    const email = payload.sub
    const requestType = payload.prt
    const requestId = payload.rid
    const locale = payload.loc === 'fr' ? 'fr' : 'en'
    if (
      typeof email !== 'string' ||
      typeof requestId !== 'string' ||
      (requestType !== 'deletion' && requestType !== 'export' && requestType !== 'objection')
    ) {
      return null
    }
    return { email, requestType, requestId, locale }
  } catch {
    return null
  }
}
