import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE = 'karu_admin'

function secret() {
  const s = process.env.ADMIN_JWT_SECRET
  if (!s) throw new Error('ADMIN_JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('karu-admin')
    .setExpirationTime('12h')
    .sign(await secret())
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    // Issuer is enforced so a token minted for another purpose (e.g. a privacy
    // link) can never be replayed as an admin session, even on a shared secret.
    const { payload } = await jwtVerify(token, await secret(), { issuer: 'karu-admin' })
    // Role claim is required — signature alone must never grant admin access
    // (other token types may share the signing secret, e.g. privacy links)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function getAdminTokenFromCookies(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE)?.value ?? null
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getAdminTokenFromCookies()
  if (!token) return false
  return verifyAdminToken(token)
}

export const ADMIN_COOKIE = COOKIE
