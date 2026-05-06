import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { WaitlistSchema } from '@/lib/validations'
import { hashIp } from '@/lib/crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { WaitlistConfirmEmail } from '@/emails/WaitlistConfirmEmail'

export async function POST(request: NextRequest) {
  // 1. Parse JSON
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 }
    )
  }

  // 2. Validate with Zod
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

  // 3. Hash IP
  let hashedIp = 'unknown'
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    hashedIp = await hashIp(ip)
  } catch (err) {
    console.error('[waitlist] IP hash error:', err instanceof Error ? err.message : 'unknown')
  }

  // 4. Insert to Supabase
  try {
    const insertData: Record<string, unknown> = { email, type, city, locale, ip_hash: hashedIp }
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
      console.error('[waitlist] DB error:', dbError.message, dbError.details, dbError.hint)
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

  // 5. Send confirmation email (non-blocking)
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

      resend.emails.send({
        from: 'Karu <noreply@getkaru.io>',
        to: bizEmail ? [email, bizEmail] : email,
        subject,
        react: WaitlistConfirmEmail({
          type,
          city,
          locale: locale as 'en' | 'fr',
          business_name: type === 'vendor' ? (business_name || undefined) : undefined,
        }),
      }).catch(err => console.error('[waitlist] Email error:', err instanceof Error ? err.message : 'unknown'))
    }
  } catch (err) {
    console.error('[waitlist] Resend init error:', err instanceof Error ? err.message : 'unknown')
  }

  // 6. Track Plausible event (non-blocking)
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (plausibleDomain) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
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
    }).catch(() => {})
  }

  return NextResponse.json(
    { success: true, data: { message: "You're on the list!" } },
    { status: 201 }
  )
}
