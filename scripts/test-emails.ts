                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              /**
 * Send test emails for all 4 variants:
 *   EN customer · EN vendor · FR customer · FR vendor
 *
 * Usage:  npx tsx scripts/test-emails.ts
 */

import { Resend } from 'resend'
import { WaitlistConfirmEmail } from '../emails/WaitlistConfirmEmail'

const TO = 'mnfalahahamad@gmail.com'

const resend = new Resend(process.env.RESEND_API_KEY)

const variants = [
  {
    label: 'EN · Customer · Douala',
    locale: 'en' as const,
    type: 'customer' as const,
    city: 'douala' as const,
    subject: "You're on the list. Karu launches soon",
  },
  {
    label: 'EN · Vendor · Yaoundé',
    locale: 'en' as const,
    type: 'vendor' as const,
    city: 'yaounde' as const,
    business_name: "Falah's Rentals",
    subject: "You're registered. Karu vendor early access",
  },
  {
    label: 'FR · Client · Douala',
    locale: 'fr' as const,
    type: 'customer' as const,
    city: 'douala' as const,
    subject: "Vous êtes sur la liste. Karu arrive bientôt",
  },
  {
    label: 'FR · Prestataire · Yaoundé',
    locale: 'fr' as const,
    type: 'vendor' as const,
    city: 'yaounde' as const,
    business_name: "Falah's Rentals",
    subject: "Inscription confirmée. Accès anticipé prestataire Karu",
  },
]

async function run() {
  for (const v of variants) {
    process.stdout.write(`Sending [${v.label}]… `)
    const { data, error } = await resend.emails.send({
      from: 'Karu <noreply@getkaru.io>',
      to: TO,
      subject: `[TEST] ${v.subject}`,
      react: WaitlistConfirmEmail({
        type: v.type,
        city: v.city,
        locale: v.locale,
        business_name: v.business_name,
      }),
    })
    if (error) {
      console.error(`FAILED — ${error.message}`)
    } else {
      console.log(`sent (id: ${data?.id})`)
    }
  }
}

run()
