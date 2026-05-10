import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WaitlistSchema } from '@/lib/validations'
import { hashIp } from '@/lib/crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { WaitlistConfirmEmail } from '@/emails/WaitlistConfirmEmail'

// Allowed origins for CSRF protection
const ALLOWED_ORIGINS = [
  'https://getkaru.io',
  'https://www.getkaru.io',
  'https://karu-mu.vercel.app',
]

function isAllowedOrigin(request: NextRequest): boolean {
  // In development, allow all origins
  if (process.env.NODE_ENV !== 'production') return true

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')

  // Allow exact matches
  if (origin && ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return true
  if (referer && ALLOWED_ORIGINS.some(o => referer.startsWith(o))) return true

  // Allow Vercel preview deployments
  if (origin && origin.includes('.vercel.app')) return true
  if (referer && referer.includes('.vercel.app')) return true

  return false
}

export async function POST(request: NextRequest) {
  // 0. CSRF / Origin check
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Request not allowed' } },
      { status: 403 }
    )
  }

  // Verify X-Requested-With header (CSRF defence)
  const xrw = request.headers.get('x-requested-with')
  if (xrw !== 'XMLHttpRequest') {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Request not allowed' } },
      { status: 403 }
    )
  }

  // 1. Enforce content-type
  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_CONTENT_TYPE', message: 'Content-Type must be application/json' } },
      { status: 400 }
    )
  }

  // 2. Limit request body size (prevent DoS via large payloads)
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 5000) {
    return NextResponse.json(
      { success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } },
      { status: 413 }
    )
  }

  // 3. Parse JSON
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }

  // 4. Reject unexpected fields (only allow known keys)
  if (typeof body === 'object' && body !== null) {
    const allowedKeys = new Set(['email', 'type', 'city', 'locale', 'business_name', 'business_email', 'phone', 'vehicle_count'])
    const bodyKeys = Object.keys(body as Record<string, unknown>)
    if (bodyKeys.length > allowedKeys.size || bodyKeys.some(k => !allowedKeys.has(k))) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Unknown fields in request' } },
        { status: 400 }
      )
    }
  }

  // 5. Validate with Zod (sanitises input via transforms)
  const parsed = WaitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          fields: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
        },
      },
      { status: 400 }
    )
  }

  const { email, type, city, locale = 'en', business_name, phone, vehicle_count } = parsed.data

  // 6. Hash IP (one-way, non-reversible)
  let hashedIp = 'unknown'
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    hashedIp = await hashIp(ip)
  } catch (err) {
    console.error('[waitlist] IP hash error:', err instanceof Error ? err.message : 'unknown')
  }

  // 7. Insert to Supabase (parameterised query, no raw SQL)
  try {
    const insertData: Record<string, unknown> = {
      email, type, city, locale, ip_hash: hashedIp,
      country:  request.headers.get('x-vercel-ip-country') ?? null,
      city_geo: request.headers.get('x-vercel-ip-city') ?? null,
      region:   request.headers.get('x-vercel-ip-country-region') ?? null,
      lat:      parseFloat(request.headers.get('x-vercel-ip-latitude') ?? '') || null,
      lng:      parseFloat(request.headers.get('x-vercel-ip-longitude') ?? '') || null,
    }
    if (type === 'vendor') {
      insertData.business_name = business_name || null
      insertData.business_email = (parsed.data as Record<string, unknown>).business_email || null
      insertData.phone = phone || null
      insertData.vehicle_count = vehicle_count || null
    }

    const { error: dbError } = await supabaseAdmin
      .from('waitlist_entries')
      .upsert(insertData, { onConflict: 'email', ignoreDuplicates: true })

    if (dbError) {
      // Log internally, never expose DB details to client
      console.error('[waitlist] DB error:', dbError.message)
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[waitlist] Unexpected error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }

  // 8. Send confirmation email and log it
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const subjects = {
        en: {
          customer: "You're on the list. Karu launches soon",
          vendor: "You're registered. Karu vendor early access",
        },
        fr: {
          customer: "Vous êtes sur la liste. Karu arrive bientôt",
          vendor: "Inscription confirmée. Accès anticipé prestataire Karu",
        },
      }
      const subject = subjects[locale as 'en' | 'fr']?.[type] ?? subjects.en[type]
      const bizEmail = type === 'vendor' ? ((parsed.data as Record<string, unknown>).business_email as string | undefined) : undefined
      const to = bizEmail ? [email, bizEmail] : email

      resend.emails.send({
        from: 'Karu <noreply@getkaru.io>',
        to,
        subject,
        react: WaitlistConfirmEmail({
          type,
          city,
          locale: locale as 'en' | 'fr',
          business_name: type === 'vendor' ? (business_name || undefined) : undefined,
        }),
      }).then(async () => {
        // Log to admin email log after successful send
        await supabaseAdmin.from('admin_email_log').insert({
          subject,
          recipient_count: Array.isArray(to) ? to.length : 1,
          segment: null,
          resend_id: null,
          email_type: type === 'vendor' ? 'vendor_signup' : 'customer_signup',
          recipient_email: email,
          metadata: { city, locale, business_name: business_name ?? null, type },
        })
      }).catch(err => console.error('[waitlist] Email error:', err instanceof Error ? err.message : 'unknown'))
    }
  } catch (err) {
    console.error('[waitlist] Resend init error:', err instanceof Error ? err.message : 'unknown')
  }

  // 9. Track analytics (non-blocking, no PII sent)
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (plausibleDomain) {
    fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'waitlist_signup',
        url: `https://${plausibleDomain}/`,
        domain: plausibleDomain,
        props: { type, city },
      }),
    }).catch(() => {})
  }

  return NextResponse.json(
    { success: true, data: { message: "You're on the list!" } },
    { status: 201 }
  )
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
