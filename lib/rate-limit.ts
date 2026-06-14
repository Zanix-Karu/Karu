import { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashIp } from '@/lib/crypto'

/**
 * Persistent, serverless-safe rate limiting backed by Postgres (Supabase).
 *
 * Replaces the previous in-memory Map limiter, which reset on every serverless
 * cold start and was per-instance (useless against distributed abuse). The
 * atomic check-and-increment lives in the `check_rate_limit` SQL function
 * (migration 009) so concurrent invocations across instances share one counter.
 *
 * Fail-OPEN on infrastructure error: a DB hiccup must not take down signup or
 * the privacy rights flow. Abuse protection degrades; availability does not.
 * (Turnstile remains the fail-CLOSED gate on the same endpoints, so a DB outage
 * doesn't leave the endpoint defenceless.)
 */

export interface RateLimitResult {
  success: boolean
  /** seconds the caller should back off (0 when allowed) */
  retryAfter: number
}

/** Derive a stable, non-PII rate-limit subject from the request IP. */
export async function rateLimitKeyForIp(request: NextRequest, bucket: string): Promise<string> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const hashed = await hashIp(ip).catch(() => 'unknown')
  return `${bucket}:${hashed}`
}

/**
 * @param key           bucket key, e.g. "privacy_request:<hash>"
 * @param limit         max requests allowed per window
 * @param windowSeconds window length in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  try {
    const { data, error } = await supabaseAdmin.rpc('check_rate_limit', {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })
    if (error) {
      console.error('[rate-limit] rpc error:', error.message)
      return { success: true, retryAfter: 0 } // fail-open
    }
    return data === true
      ? { success: true, retryAfter: 0 }
      : { success: false, retryAfter: windowSeconds }
  } catch (err) {
    console.error('[rate-limit] unexpected:', err instanceof Error ? err.message : String(err))
    return { success: true, retryAfter: 0 } // fail-open
  }
}
