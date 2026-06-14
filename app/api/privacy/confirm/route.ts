import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyPrivacyToken } from '@/lib/privacy-token'
import { isAllowedOrigin, hasXhrHeader } from '@/lib/origin'
import { rateLimit, rateLimitKeyForIp } from '@/lib/rate-limit'

/**
 * /api/privacy/confirm — two-step data subject request confirmation.
 *
 * GET  → validates the token (no mutation — safe against Outlook SafeLinks /
 *        Gmail proxy / AV prefetch), stows it in an HttpOnly, SameSite=Strict
 *        cookie, and redirects to a TOKENLESS confirmation page. The token never
 *        appears in the address bar, history, Referer, or analytics URLs.
 * POST → executes the confirmed action. Reads the token from the cookie (not the
 *        body or URL), enforces Origin + X-Requested-With + rate limit, and uses
 *        an atomic conditional UPDATE for single-use (TOCTOU-safe).
 *
 * The token only ever reaches the address it concerns (emailed there), so a valid
 * token proves ownership. Tokens are single-use and expire after 24 hours.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getkaru.io'
const CONFIRM_COOKIE = 'karu_pconfirm'

function redirectTo(locale: string, status: string): NextResponse {
  return NextResponse.redirect(`${SITE_URL}/${locale}/privacy/rights?status=${status}`, 302)
}

// ── GET: validate + stash token in cookie, redirect tokenless ───────────────
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return redirectTo('en', 'invalid')

  const payload = await verifyPrivacyToken(token)
  if (!payload) return redirectTo('en', 'invalid')

  const { requestId, locale } = payload

  // Confirm the request is still pending — but do NOT mutate (prefetch-safe).
  const { data: requestRow } = await supabaseAdmin
    .from('data_requests')
    .select('id, status')
    .eq('id', requestId)
    .maybeSingle()

  if (!requestRow || requestRow.status !== 'pending') {
    return redirectTo(locale, 'invalid')
  }

  // Redirect to a tokenless page; carry the token in an HttpOnly cookie instead.
  const res = redirectTo(locale, 'confirm')
  res.cookies.set(CONFIRM_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/privacy',
    maxAge: 15 * 60, // 15 minutes to click confirm
  })
  return res
}

// ── POST: execute the confirmed action ──────────────────────────────────────
export async function POST(request: NextRequest) {
  // CSRF: same Origin + XHR model as the other state-changing routes.
  if (!isAllowedOrigin(request) || !hasXhrHeader(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Request not allowed' } },
      { status: 403 }
    )
  }

  // Rate limit confirm attempts (defends the atomic claim + DB from hammering).
  const rl = await rateLimit(await rateLimitKeyForIp(request, 'privacy_confirm'), 10, 3600)
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  // Token comes from the HttpOnly cookie set by GET — never the body or URL.
  const token = request.cookies.get(CONFIRM_COOKIE)?.value
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Confirmation expired. Please request again.' } },
      { status: 400 }
    )
  }

  const payload = await verifyPrivacyToken(token)
  if (!payload) {
    const res = NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' } },
      { status: 400 }
    )
    res.cookies.delete({ name: CONFIRM_COOKIE, path: '/api/privacy' })
    return res
  }

  const { email, requestType, requestId, locale } = payload

  // Helper to clear the confirm cookie on any terminal response.
  const clearCookie = (res: NextResponse) => {
    res.cookies.delete({ name: CONFIRM_COOKIE, path: '/api/privacy' })
    return res
  }

  try {
    // Atomic single-use claim: only one concurrent caller can move pending→processing.
    const { data: claimed, error: claimError } = await supabaseAdmin
      .from('data_requests')
      .update({ status: 'processing' })
      .eq('id', requestId)
      .eq('status', 'pending')
      .eq('type', requestType)
      .select('id')

    if (claimError || !claimed || claimed.length === 0) {
      return clearCookie(NextResponse.json(
        { success: false, error: { code: 'ALREADY_PROCESSED', message: 'This request has already been processed' } },
        { status: 409 }
      ))
    }

    const complete = (detail: Record<string, unknown>) =>
      supabaseAdmin
        .from('data_requests')
        .update({ status: 'completed', completed_at: new Date().toISOString(), detail })
        .eq('id', requestId)

    const reopen = () =>
      supabaseAdmin.from('data_requests').update({ status: 'pending' }).eq('id', requestId)

    if (requestType === 'deletion') {
      const { error: delError } = await supabaseAdmin
        .from('waitlist_entries')
        .delete()
        .eq('email', email)
      if (delError) {
        console.error('[privacy] deletion error:', delError.message)
        await reopen()
        return clearCookie(NextResponse.json(
          { success: false, error: { code: 'INTERNAL_ERROR', message: 'An error occurred processing your request' } },
          { status: 500 }
        ))
      }

      await supabaseAdmin
        .from('admin_email_log')
        .update({ recipient_email: null, metadata: null })
        .eq('recipient_email', email)

      await complete({ outcome: 'deleted' })
      return clearCookie(NextResponse.json({ success: true, data: { outcome: 'deleted', locale } }))
    }

    if (requestType === 'objection') {
      const { error: updError } = await supabaseAdmin
        .from('waitlist_entries')
        .update({ marketing_opt_out: true })
        .eq('email', email)
      if (updError) {
        console.error('[privacy] objection error:', updError.message)
        await reopen()
        return clearCookie(NextResponse.json(
          { success: false, error: { code: 'INTERNAL_ERROR', message: 'An error occurred processing your request' } },
          { status: 500 }
        ))
      }
      await complete({ outcome: 'opted_out' })
      return clearCookie(NextResponse.json({ success: true, data: { outcome: 'objection', locale } }))
    }

    // export — right of access + portability. Returned inline as JSON; the client
    // turns it into a file download (no Content-Disposition on a fetch response).
    const { data: entry } = await supabaseAdmin
      .from('waitlist_entries')
      .select('email, type, city, locale, business_name, business_email, phone, vehicle_count, country, region, city_geo, consent_version, consent_at, marketing_opt_out, created_at')
      .eq('email', email)
      .maybeSingle()

    const { data: emails } = await supabaseAdmin
      .from('admin_email_log')
      .select('subject, email_type, sent_at')
      .eq('recipient_email', email)

    const { data: requests } = await supabaseAdmin
      .from('data_requests')
      .select('type, status, requested_at, completed_at')
      .eq('email', email)

    await complete({ outcome: 'exported' })

    const exportPayload = {
      generated_at: new Date().toISOString(),
      controller: 'Karu (getkaru.io) — privacy@getkaru.io',
      legal_basis: 'Cameroon Law No. 2024/017 — right of access and portability',
      waitlist_entry: entry ?? null,
      emails_sent_to_you: emails ?? [],
      data_rights_requests: requests ?? [],
      notes: 'IP addresses are stored only as non-reversible HMAC-SHA256 hashes and cannot be returned in original form.',
    }

    return clearCookie(NextResponse.json({ success: true, data: { outcome: 'exported', locale, export: exportPayload } }))
  } catch (error) {
    console.error('[privacy] confirm error:', error instanceof Error ? error.message : String(error))
    return clearCookie(NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    ))
  }
}

// Block unused methods
export async function PUT() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
export async function DELETE() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
export async function PATCH() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
