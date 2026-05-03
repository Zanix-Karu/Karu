import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WaitlistSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/rate-limit'
import { hashIp } from '@/lib/crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { WaitlistConfirmEmail } from '@/emails/WaitlistConfirmEmail'

export async function POST(request: NextRequest) {
  // 1. Rate limit: 3 per hour per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const hashedIp = await hashIp(ip)
  const limited = await rateLimit(`waitlist:${hashedIp}`, 3, 3600)
  if (!limited.success) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } }
    )
  }

  // 2. Parse JSON
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }

  // 3. Validate with Zod
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

  const { email, type, city, business_name, phone, vehicle_count } = parsed.data

  // 4. Upsert to Supabase (ignore duplicate — don't reveal)
  try {
    const insertData: Record<string, unknown> = { email, type, city, ip_hash: hashedIp }
    if (type === 'vendor') {
      insertData.business_name = business_name ?? null
      insertData.phone = phone ?? null
      insertData.vehicle_count = vehicle_count ?? null
    }

    const { error: dbError } = await supabaseAdmin
      .from('waitlist_entries')
      .upsert(insertData, { onConflict: 'email', ignoreDuplicates: true })

    if (dbError) {
      console.error('[waitlist] DB error:', dbError.message)
      return NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[waitlist] Unexpected DB error:', error instanceof Error ? error.message : 'unknown')
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }

  // 5. Send confirmation email (non-blocking — don't fail response if email fails)
  const resend = new Resend(process.env.RESEND_API_KEY)
  resend.emails.send({
    from: 'Karu <noreply@getkaru.io>',
    to: email,
    subject: type === 'vendor'
      ? "You're registered — Karu vendor early access"
      : "You're on the list — Karu launches soon",
    react: WaitlistConfirmEmail({ type, city }),
  }).catch(err => console.error('[waitlist] Email error:', err instanceof Error ? err.message : 'unknown'))

  // 6. Track Plausible event (non-blocking, fire-and-forget)
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (plausibleDomain) {
    fetch('https://plausible.io/api/event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify({
        name: 'waitlist_signup',
        url: `https://${plausibleDomain}/`,
        domain: plausibleDomain,
        props: { type, city },
      }),
    }).catch(err => console.error('[waitlist] Plausible error:', err instanceof Error ? err.message : 'unknown'))
  }

  return NextResponse.json(
    { success: true, data: { message: "You're on the list!" } },
    { status: 201 }
  )
}
