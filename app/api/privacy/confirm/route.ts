import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyPrivacyToken } from '@/lib/privacy-token'

/**
 * /api/privacy/confirm?token=… — Two-step data subject request confirmation.
 *
 * GET  → validates the token and redirects to a confirmation page (no mutation).
 *        This is safe against Outlook SafeLinks / Gmail proxy / AV prefetch.
 *
 * POST → executes the confirmed action (deletion / export / objection).
 *        Uses an atomic conditional update to prevent TOCTOU double-execution.
 *
 * The link arrives only in an email sent to the address concerned, so a valid
 * token proves ownership. Tokens are single-use (request row must be pending)
 * and expire after 24 hours.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getkaru.io'

function redirectTo(locale: string, status: string): NextResponse {
  return NextResponse.redirect(`${SITE_URL}/${locale}/privacy/rights?status=${status}`, 302)
}

/**
 * GET — Validate token and redirect to confirmation page.
 * Does NOT execute any destructive action (safe for email link prefetching).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return redirectTo('en', 'invalid')

  const payload = await verifyPrivacyToken(token)
  if (!payload) return redirectTo('en', 'invalid')

  const { requestId, locale } = payload

  // Check the request is still pending (but don't mutate)
  const { data: requestRow } = await supabaseAdmin
    .from('data_requests')
    .select('id, status, type')
    .eq('id', requestId)
    .maybeSingle()

  if (!requestRow || requestRow.status !== 'pending') {
    return redirectTo(locale, 'invalid')
  }

  // Redirect to the rights page with the token so the UI can show a confirm button
  // The confirm button will POST back to this endpoint
  return redirectTo(locale, `confirm&token=${encodeURIComponent(token)}`)
}

/**
 * POST — Execute the confirmed action with atomic single-use enforcement.
 * Protects against TOCTOU: uses UPDATE … WHERE status='pending' to guarantee
 * only one concurrent request can claim the token.
 */
export async function POST(request: NextRequest) {
  let body: { token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }

  const token = body.token
  if (!token) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Token is required' } },
      { status: 400 }
    )
  }

  const payload = await verifyPrivacyToken(token)
  if (!payload) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' } },
      { status: 400 }
    )
  }

  const { email, requestType, requestId, locale } = payload

  try {
    // Atomic single-use enforcement: UPDATE only if still pending.
    // If another concurrent request already claimed it, count === 0 → reject.
    const { data: claimed, error: claimError } = await supabaseAdmin
      .from('data_requests')
      .update({ status: 'processing' })
      .eq('id', requestId)
      .eq('status', 'pending')
      .eq('type', requestType)
      .select('id')

    if (claimError || !claimed || claimed.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'ALREADY_PROCESSED', message: 'This request has already been processed' } },
        { status: 409 }
      )
    }

    const complete = (detail: Record<string, unknown>) =>
      supabaseAdmin
        .from('data_requests')
        .update({ status: 'completed', completed_at: new Date().toISOString(), detail })
        .eq('id', requestId)

    if (requestType === 'deletion') {
      const { error: delError } = await supabaseAdmin
        .from('waitlist_entries')
        .delete()
        .eq('email', email)
      if (delError) {
        console.error('[privacy] deletion error:', delError.message)
        // Roll back the claim
        await supabaseAdmin.from('data_requests').update({ status: 'pending' }).eq('id', requestId)
        return NextResponse.json(
          { success: false, error: { code: 'INTERNAL_ERROR', message: 'An error occurred processing your request' } },
          { status: 500 }
        )
      }

      // Anonymise email-log rows (keep aggregate stats)
      await supabaseAdmin
        .from('admin_email_log')
        .update({ recipient_email: null, metadata: null })
        .eq('recipient_email', email)

      await complete({ outcome: 'deleted' })
      return NextResponse.json({ success: true, data: { outcome: 'deleted', locale } })
    }

    if (requestType === 'objection') {
      const { error: updError } = await supabaseAdmin
        .from('waitlist_entries')
        .update({ marketing_opt_out: true })
        .eq('email', email)
      if (updError) {
        console.error('[privacy] objection error:', updError.message)
        await supabaseAdmin.from('data_requests').update({ status: 'pending' }).eq('id', requestId)
        return NextResponse.json(
          { success: false, error: { code: 'INTERNAL_ERROR', message: 'An error occurred processing your request' } },
          { status: 500 }
        )
      }
      await complete({ outcome: 'opted_out' })
      return NextResponse.json({ success: true, data: { outcome: 'objection', locale } })
    }

    // export — right of access + portability
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

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="karu-data-export.json"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[privacy] confirm error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
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
