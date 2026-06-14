import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { hashIp } from '@/lib/crypto'
import { createPrivacyToken, PrivacyRequestType } from '@/lib/privacy-token'
import { wrapInKaruTemplate } from '@/lib/email-template'
import { isAllowedOrigin } from '@/lib/origin'
import { rateLimit, rateLimitKeyForIp } from '@/lib/rate-limit'

/**
 * POST /api/privacy/request — Law 2024/017 data subject rights entry point.
 *
 * Takes an email + request type (deletion / export / objection), logs the
 * request, and emails a signed, time-limited confirmation link to that
 * address. Confirming via the link proves ownership of the email.
 *
 * Anti-enumeration: the API response is identical whether or not the email
 * exists on the waitlist. The email itself tells the recipient the truth.
 */

const PrivacyRequestSchema = z.object({
  email: z.string().email().max(254).toLowerCase().trim(),
  request_type: z.enum(['deletion', 'export', 'objection']),
  locale: z.enum(['en', 'fr']).optional().default('en'),
  turnstile_token: z.string().optional(),
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getkaru.io'

const COPY = {
  en: {
    subject: {
      deletion: 'Confirm your data deletion request',
      export: 'Confirm your data export request',
      objection: 'Confirm your marketing objection',
    } as Record<PrivacyRequestType, string>,
    intro: {
      deletion: 'We received a request to delete the personal data associated with this email address from the Karu waitlist.',
      export: 'We received a request to export the personal data we hold for this email address.',
      objection: 'We received a request to stop sending marketing emails to this address.',
    } as Record<PrivacyRequestType, string>,
    action: 'To confirm this request, click the button below. The link expires in 24 hours.',
    ignore: 'If you did not make this request, you can safely ignore this email. No changes will be made.',
    button: 'Confirm request',
    noData: {
      subject: 'Your data request to Karu',
      body: 'We received a data rights request for this email address. We checked our records: Karu holds no personal data associated with this address. No action is needed.',
    },
  },
  fr: {
    subject: {
      deletion: 'Confirmez votre demande de suppression de données',
      export: 'Confirmez votre demande d’export de données',
      objection: 'Confirmez votre opposition au marketing',
    } as Record<PrivacyRequestType, string>,
    intro: {
      deletion: 'Nous avons reçu une demande de suppression des données personnelles associées à cette adresse e-mail de la liste d’attente Karu.',
      export: 'Nous avons reçu une demande d’export des données personnelles que nous détenons pour cette adresse e-mail.',
      objection: 'Nous avons reçu une demande d’arrêt des e-mails marketing vers cette adresse.',
    } as Record<PrivacyRequestType, string>,
    action: 'Pour confirmer cette demande, cliquez sur le bouton ci-dessous. Le lien expire dans 24 heures.',
    ignore: 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail. Aucune modification ne sera effectuée.',
    button: 'Confirmer la demande',
    noData: {
      subject: 'Votre demande de données à Karu',
      body: 'Nous avons reçu une demande relative aux données pour cette adresse e-mail. Après vérification : Karu ne détient aucune donnée personnelle associée à cette adresse. Aucune action n’est requise.',
    },
  },
}

export async function POST(request: NextRequest) {
  // 0. CSRF / Origin checks (same model as /api/waitlist)
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Request not allowed' } },
      { status: 403 }
    )
  }
  if (request.headers.get('x-requested-with') !== 'XMLHttpRequest') {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Request not allowed' } },
      { status: 403 }
    )
  }

  // 0b. Rate limit: 5 rights requests per IP per hour (persistent, serverless-safe).
  // Stops the privacy endpoint being scripted into an email-bomb against waitlist members.
  const rl = await rateLimit(await rateLimitKeyForIp(request, 'privacy_request'), 5, 3600)
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' } },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    )
  }

  // 1. Content-type + size
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_CONTENT_TYPE', message: 'Content-Type must be application/json' } },
      { status: 400 }
    )
  }
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 5000) {
    return NextResponse.json(
      { success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } },
      { status: 413 }
    )
  }

  // 2. Parse + field whitelist
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }
  if (typeof body === 'object' && body !== null) {
    const allowedKeys = new Set(['email', 'request_type', 'locale', 'turnstile_token'])
    if (Object.keys(body as Record<string, unknown>).some(k => !allowedKeys.has(k))) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unknown fields in request' } },
        { status: 400 }
      )
    }
  }

  // 3. Turnstile — fail-closed: mandatory in production
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY
  if (!turnstileSecret) {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: { code: 'CAPTCHA_REQUIRED', message: 'Human verification is unavailable. Please try again later.' } },
        { status: 503 }
      )
    }
  } else {
    const token = (body as Record<string, unknown>).turnstile_token
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, error: { code: 'CAPTCHA_REQUIRED', message: 'Human verification required' } },
        { status: 403 }
      )
    }
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: turnstileSecret, response: token }),
    })
    const verifyData = await verifyRes.json() as { success: boolean }
    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, error: { code: 'CAPTCHA_FAILED', message: 'Human verification failed. Please try again.' } },
        { status: 403 }
      )
    }
  }

  // 4. Validate
  const parsed = PrivacyRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request data' } },
      { status: 400 }
    )
  }
  const { email, request_type, locale } = parsed.data

  // Generic response used in all outcomes (anti-enumeration)
  const genericSuccess = NextResponse.json(
    { success: true, data: { message: 'If we hold data for this address, a confirmation email has been sent.' } },
    { status: 200 }
  )

  try {
    // 5. Hash IP for the audit log
    let hashedIp = 'unknown'
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
      hashedIp = await hashIp(ip)
    } catch { /* non-fatal */ }

    // 6. Log the request (audit trail — required evidence of handling)
    const { data: requestRow, error: insertError } = await supabaseAdmin
      .from('data_requests')
      .insert({ email, type: request_type, locale, ip_hash: hashedIp })
      .select('id')
      .single()

    if (insertError || !requestRow) {
      console.error('[privacy] data_requests insert error:', insertError?.message)
      return genericSuccess // never leak internals
    }

    // 7. Check whether we actually hold data for this address
    const { data: entry } = await supabaseAdmin
      .from('waitlist_entries')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('[privacy] RESEND_API_KEY not configured — cannot send confirmation')
      return genericSuccess
    }
    const resend = new Resend(apiKey)
    const copy = COPY[locale]

    if (!entry) {
      // We hold nothing — tell the subject so (still a complete response to the request)
      await supabaseAdmin
        .from('data_requests')
        .update({ status: 'completed', completed_at: new Date().toISOString(), detail: { outcome: 'no_data_held' } })
        .eq('id', requestRow.id)

      resend.emails.send({
        from: 'Karu <noreply@getkaru.io>',
        to: email,
        subject: copy.noData.subject,
        html: wrapInKaruTemplate(`<p>${copy.noData.body}</p>`, copy.noData.subject),
      }).catch(err => console.error('[privacy] Email error:', err instanceof Error ? err.message : 'unknown'))

      return genericSuccess
    }

    // 8. Send signed confirmation link to the address itself (proves ownership)
    const token = await createPrivacyToken({
      email,
      requestType: request_type,
      requestId: requestRow.id,
      locale,
    })
    const confirmUrl = `${SITE_URL}/api/privacy/confirm?token=${encodeURIComponent(token)}`
    const subject = copy.subject[request_type]
    const bodyHtml = `
      <p>${copy.intro[request_type]}</p>
      <p>${copy.action}</p>
      <p style="text-align:center;margin:28px 0;">
        <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;background-color:#E8A020;color:#1C1208;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">${copy.button}</a>
      </p>
      <p style="font-size:13px;color:#8B6A3E;">${copy.ignore}</p>
    `

    resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to: email,
      subject,
      html: wrapInKaruTemplate(bodyHtml, subject),
    }).catch(err => console.error('[privacy] Email error:', err instanceof Error ? err.message : 'unknown'))

    return genericSuccess
  } catch (error) {
    console.error('[privacy] Unexpected error:', error instanceof Error ? error.message : String(error))
    return genericSuccess
  }
}

// Block all other HTTP methods
export async function GET() {
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
