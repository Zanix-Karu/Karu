import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyPrivacyToken } from '@/lib/privacy-token'

/**
 * GET /api/privacy/confirm?token=… — executes a confirmed data subject request.
 *
 * The link arrives only in an email sent to the address concerned, so a valid
 * token proves ownership. Tokens are single-use (request row must be pending)
 * and expire after 24 hours.
 *
 * deletion  → hard-delete waitlist entry + anonymise email-log rows
 * export    → JSON download of all data held for the address
 * objection → marketing_opt_out flag set; excluded from broadcasts
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getkaru.io'

function redirectTo(locale: string, status: string): NextResponse {
  return NextResponse.redirect(`${SITE_URL}/${locale}/privacy/rights?status=${status}`, 302)
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return redirectTo('en', 'invalid')

  const payload = await verifyPrivacyToken(token)
  if (!payload) return redirectTo('en', 'invalid')

  const { email, requestType, requestId, locale } = payload

  try {
    // Single-use: the logged request must still be pending
    const { data: requestRow } = await supabaseAdmin
      .from('data_requests')
      .select('id, status, type')
      .eq('id', requestId)
      .maybeSingle()

    if (!requestRow || requestRow.status !== 'pending' || requestRow.type !== requestType) {
      return redirectTo(locale, 'invalid')
    }

    const complete = (detail: Record<string, unknown>) =>
      supabaseAdmin
        .from('data_requests')
        .update({ status: 'completed', completed_at: new Date().toISOString(), detail })
        .eq('id', requestId)

    if (requestType === 'deletion') {
      // 1. Hard-delete the waitlist entry (no financial/legal retention applies pre-launch)
      const { error: delError } = await supabaseAdmin
        .from('waitlist_entries')
        .delete()
        .eq('email', email)
      if (delError) {
        console.error('[privacy] deletion error:', delError.message)
        return redirectTo(locale, 'error')
      }

      // 2. Anonymise email-log rows for this recipient (keep aggregate stats)
      await supabaseAdmin
        .from('admin_email_log')
        .update({ recipient_email: null, metadata: null })
        .eq('recipient_email', email)

      await complete({ outcome: 'deleted' })
      return redirectTo(locale, 'deleted')
    }

    if (requestType === 'objection') {
      const { error: updError } = await supabaseAdmin
        .from('waitlist_entries')
        .update({ marketing_opt_out: true })
        .eq('email', email)
      if (updError) {
        console.error('[privacy] objection error:', updError.message)
        return redirectTo(locale, 'error')
      }
      await complete({ outcome: 'opted_out' })
      return redirectTo(locale, 'objection')
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
    return redirectTo(locale, 'error')
  }
}

// Block all other HTTP methods
export async function POST() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
export async function PUT() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
export async function DELETE() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
export async function PATCH() {
  return NextResponse.json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 })
}
