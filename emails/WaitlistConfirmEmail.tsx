import * as React from 'react'

interface WaitlistConfirmEmailProps {
  type: 'customer' | 'vendor'
  city: 'douala' | 'yaounde' | 'other'
  locale?: 'en' | 'fr'
  business_name?: string
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const copy = {
  en: {
    tag: 'EARLY ACCESS',
    customer: {
      heading: "You're on the list.",
      body: (city: string) =>
        `Thank you for joining the Karu waitlist. We'll send you one email the moment we go live in ${city}. No spam, no filler — just the launch notification.`,
      note: null,
    },
    vendor: {
      heading: 'Registration confirmed.',
      body: (city: string, name?: string) =>
        `Thank you${name ? `, ${name},` : ''} for registering as a Karu vendor in ${city}. We'll review your details and be in touch within 48 hours with your next steps.`,
      note: "Priority placement is reserved for early vendors. We'll reach out personally.",
    },
    cta: 'Visit getkaru.io',
    footer_tagline: 'Built for Cameroon.',
    footer_location: 'Douala & Yaoundé, Cameroon',
    unsubscribe: 'You received this because you joined the Karu waitlist. To unsubscribe, reply with "unsubscribe" in the subject.',
  },
  fr: {
    tag: 'ACCÈS ANTICIPÉ',
    customer: {
      heading: 'Vous êtes sur la liste.',
      body: (city: string) =>
        `Merci de rejoindre la liste d'attente Karu. Nous vous enverrons un e-mail dès que nous lançons à ${city}. Pas de spam — juste la notification de lancement.`,
      note: null,
    },
    vendor: {
      heading: 'Inscription confirmée.',
      body: (city: string, name?: string) =>
        `Merci${name ? `, ${name},` : ''} de vous inscrire en tant que prestataire Karu à ${city}. Nous examinerons vos informations et vous contacterons sous 48 heures avec les prochaines étapes.`,
      note: "La priorité est réservée aux prestataires inscrits en avant-première. Nous vous contacterons personnellement.",
    },
    cta: 'Visiter getkaru.io',
    footer_tagline: 'Conçu pour le Cameroun.',
    footer_location: 'Douala & Yaoundé, Cameroun',
    unsubscribe: "Vous avez reçu cet e-mail car vous êtes sur la liste d'attente Karu. Pour vous désabonner, répondez avec \"désabonner\" en objet.",
  },
}

const cityNames: Record<string, Record<'en' | 'fr', string>> = {
  douala:  { en: 'Douala',    fr: 'Douala' },
  yaounde: { en: 'Yaoundé',   fr: 'Yaoundé' },
  other:   { en: 'your city', fr: 'votre ville' },
}

// ─── Design tokens (mirror tailwind.config.ts exactly) ────────────────────────
const C = {
  espresso:   '#1C1208',  // bg-espresso
  brownDark:  '#2A1A0A',  // bg-brown-dark
  brownMid:   '#3D2510',  // bg-brown-mid
  brownWarm:  '#5C3A1E',  // bg-brown-warm
  surface:    '#231508',  // bg-surface
  cardBg:     '#2E1C0D',  // bg-card-bg
  cardBorder: '#3D2510',  // border-card-border (solid approx of rgba(255,195,90,0.10))
  amber:      '#E8A020',  // text-amber / bg-amber
  amberLight: '#F5BF45',  // text-amber-light
  cream:      '#F5EFE4',  // text-cream
  // cream at 60% opacity on card-bg — matches 'text-cream/60' used for body text
  cream60:    '#A59A8E',
  // cream at 30% opacity — matches footer small print
  cream30:    '#6E6259',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WaitlistConfirmEmail({
  type,
  city,
  locale = 'en',
  business_name,
}: WaitlistConfirmEmailProps) {
  const t = copy[locale]
  const cityName = cityNames[city]?.[locale] ?? city
  const content = t[type]
  const heading = content.heading
  const body =
    type === 'vendor'
      ? (content as typeof t.vendor).body(cityName, business_name)
      : (content as typeof t.customer).body(cityName)
  const note = type === 'vendor' ? (t.vendor as typeof t.vendor).note : null
  const year = new Date().getFullYear()

  // Every colour referenced in classNames below must appear in the CSS block.
  // The CSS block locks those colours with !important under EVERY client hook:
  //   @media (prefers-color-scheme: light)  — Apple Mail light mode
  //   @media (prefers-color-scheme: dark)   — Apple Mail / Samsung Mail dark mode
  //   [data-ogsc]                            — Gmail web & app dark mode
  //   [data-ogsb]                            — Outlook.com / Hotmail dark mode
  // Inline styles cover Yahoo Mail and Outlook Windows (neither reads the <style> block).

  const colorLock = (selector: string) => `
    ${selector} .k-body        { background-color: ${C.espresso}   !important; }
    ${selector} .k-wrap        { background-color: ${C.espresso}   !important; }
    ${selector} .k-card        { background-color: ${C.cardBg}     !important; border-color: ${C.cardBorder} !important; }
    ${selector} .k-header      { background-color: ${C.espresso}   !important; }
    ${selector} .k-logo        { color:            ${C.amber}       !important; }
    ${selector} .k-divider     { background-color: ${C.amber}       !important; }
    ${selector} .k-tag-line    { background-color: ${C.amber}       !important; }
    ${selector} .k-tag-text    { color:            ${C.amber}       !important; }
    ${selector} .k-heading     { color:            ${C.cream}       !important; }
    ${selector} .k-body-text   { color:            ${C.cream60}     !important; }
    ${selector} .k-note-wrap   { background-color: ${C.surface}     !important; border-color: ${C.brownMid} !important; }
    ${selector} .k-note-bar    { background-color: ${C.amber}       !important; }
    ${selector} .k-note-text   { color:            ${C.amber}       !important; }
    ${selector} .k-cta         { background-color: ${C.amber}       !important; color: ${C.espresso} !important; }
    ${selector} .k-footer      { background-color: ${C.espresso}    !important; border-top-color: ${C.brownMid} !important; }
    ${selector} .k-footer-logo { color:            ${C.amber}       !important; }
    ${selector} .k-footer-sub  { color:            ${C.brownWarm}   !important; }
    ${selector} .k-footer-fine { color:            ${C.brownMid}    !important; }
  `

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*
          "light dark" tells the client we explicitly handle both modes ourselves.
          The CSS below then locks every colour with !important in both media queries,
          so the client has no room to auto-adjust anything.
        */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title>{heading}</title>
        <style>{`
          /* ── Reset ─────────────────────────────────────────────────────────── */
          body, body * {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
          }

          /* ── Force our palette in LIGHT mode ───────────────────────────────── */
          /* Without this, email clients in light mode may override our dark bg   */
          @media (prefers-color-scheme: light) {
            ${colorLock('')}
          }

          /* ── Force our palette in DARK mode ────────────────────────────────── */
          @media (prefers-color-scheme: dark) {
            ${colorLock('')}
          }

          /* ── Gmail web & app dark mode ([data-ogsc] on <html>) ─────────────── */
          ${colorLock('[data-ogsc]')}

          /* ── Outlook.com / Hotmail dark mode ([data-ogsb] on wrapper) ──────── */
          ${colorLock('[data-ogsb]')}
        `}</style>
      </head>

      {/* k-body: inline bg for Yahoo Mail / Outlook Windows */}
      <body
        className="k-body"
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: C.espresso,
          fontFamily: 'Arial, Helvetica, sans-serif',
          // colorScheme tells WebKit-based clients which mode to render in
          colorScheme: 'dark' as React.CSSProperties['colorScheme'],
        }}
      >
        {/* ── Outer wrapper ───────────────────────────────────────────────────── */}
        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          width="100%"
          className="k-wrap"
          style={{ width: '100%', backgroundColor: C.espresso }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: '48px 16px' }}>

                {/* ── Card ────────────────────────────────────────────────────── */}
                {/* Matches bg-card-bg border border-card-border on the website   */}
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  className="k-card"
                  style={{
                    width: '100%',
                    maxWidth: '580px',
                    backgroundColor: C.cardBg,
                    border: `1px solid ${C.cardBorder}`,
                  }}
                >
                  <tbody>

                    {/* ── Header: espresso bg with KARU logo ──────────────────── */}
                    <tr>
                      <td
                        className="k-header"
                        style={{ backgroundColor: C.espresso, padding: '36px 48px 28px', textAlign: 'center' as const }}
                      >
                        {/* Logo — matches the nav "Karu" amber serif text */}
                        <span
                          className="k-logo"
                          style={{
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontSize: '22px',
                            fontWeight: 'bold',
                            letterSpacing: '8px',
                            color: C.amber,
                            textTransform: 'uppercase' as const,
                          }}
                        >
                          KARU
                        </span>
                      </td>
                    </tr>

                    {/* ── Full-width amber divider (matches website hr accent) ── */}
                    <tr>
                      <td style={{ padding: 0, lineHeight: 0 }}>
                        <div
                          className="k-divider"
                          style={{ height: '2px', backgroundColor: C.amber, lineHeight: 0, fontSize: 0 }}
                        />
                      </td>
                    </tr>

                    {/* ── Content area ────────────────────────────────────────── */}
                    <tr>
                      <td style={{ padding: '36px 48px 0' }}>

                        {/* Section tag — mirrors WaitlistSection's tag style:
                            amber line + small-caps amber text, left-aligned      */}
                        <table role="presentation" cellPadding={0} cellSpacing={0}>
                          <tbody>
                            <tr>
                              <td
                                className="k-tag-line"
                                style={{
                                  width: '28px',
                                  height: '1px',
                                  backgroundColor: C.amber,
                                  verticalAlign: 'middle',
                                }}
                              />
                              <td style={{ paddingLeft: '10px', verticalAlign: 'middle' }}>
                                <span
                                  className="k-tag-text"
                                  style={{
                                    fontFamily: 'Arial, Helvetica, sans-serif',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    letterSpacing: '3px',
                                    color: C.amber,
                                    textTransform: 'uppercase' as const,
                                    whiteSpace: 'nowrap' as const,
                                  }}
                                >
                                  {t.tag}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Heading — matches font-serif font-normal text-white on website */}
                        <h1
                          className="k-heading"
                          style={{
                            margin: '20px 0 16px',
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontSize: '38px',
                            fontWeight: 'normal',
                            lineHeight: '1.15',
                            letterSpacing: '-0.5px',
                            color: C.cream,
                          }}
                        >
                          {heading}
                        </h1>

                        {/* Body — matches font-sans font-light text-cream/60 leading-[1.8] */}
                        <p
                          className="k-body-text"
                          style={{
                            margin: '0 0 32px',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '16px',
                            fontWeight: '300',
                            lineHeight: '1.8',
                            color: C.cream60,
                          }}
                        >
                          {body}
                        </p>

                        {/* Vendor callout — card-within-card with amber left accent */}
                        {note && (
                          <table
                            role="presentation"
                            cellPadding={0}
                            cellSpacing={0}
                            width="100%"
                            className="k-note-wrap"
                            style={{
                              marginBottom: '32px',
                              backgroundColor: C.surface,
                              border: `1px solid ${C.brownMid}`,
                            }}
                          >
                            <tbody>
                              <tr>
                                {/* Left amber bar — mirrors the card accent stripe on the website */}
                                <td
                                  className="k-note-bar"
                                  style={{ width: '3px', backgroundColor: C.amber }}
                                />
                                <td style={{ padding: '16px 20px' }}>
                                  <p
                                    className="k-note-text"
                                    style={{
                                      margin: 0,
                                      fontFamily: 'Arial, Helvetica, sans-serif',
                                      fontSize: '13px',
                                      lineHeight: '1.65',
                                      color: C.amber,
                                      fontStyle: 'italic' as const,
                                    }}
                                  >
                                    {note}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}

                      </td>
                    </tr>

                    {/* ── CTA button ──────────────────────────────────────────── */}
                    {/* Matches bg-amber text-espresso px-10 py-[15px] from Button.tsx,
                        no border-radius (website buttons are square)              */}
                    <tr>
                      <td style={{ padding: '0 48px 48px' }}>
                        <a
                          href="https://getkaru.io"
                          className="k-cta"
                          style={{
                            display: 'inline-block',
                            padding: '15px 40px',
                            backgroundColor: C.amber,
                            color: C.espresso,
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            letterSpacing: '2.5px',
                            textDecoration: 'none',
                            textTransform: 'uppercase' as const,
                            borderRadius: 0,
                          }}
                        >
                          {t.cta}
                        </a>
                      </td>
                    </tr>

                    {/* ── Footer ──────────────────────────────────────────────── */}
                    {/* Matches website footer: bg-brown-dark border-t border-cream/10 */}
                    <tr>
                      <td
                        className="k-footer"
                        style={{
                          padding: '28px 48px 32px',
                          backgroundColor: C.espresso,
                          borderTop: `1px solid ${C.brownMid}`,
                          textAlign: 'center' as const,
                        }}
                      >
                        {/* Footer logo — matches "KARU" in amber serif from FooterSection */}
                        <p
                          className="k-footer-logo"
                          style={{
                            margin: '0 0 6px',
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            letterSpacing: '5px',
                            color: C.amber,
                            textTransform: 'uppercase' as const,
                          }}
                        >
                          KARU
                        </p>

                        {/* Tagline + location */}
                        <p
                          className="k-footer-sub"
                          style={{
                            margin: '0 0 2px',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '11px',
                            color: C.brownWarm,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {t.footer_tagline}
                        </p>
                        <p
                          className="k-footer-sub"
                          style={{
                            margin: '0 0 20px',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '11px',
                            color: C.brownWarm,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {t.footer_location}
                        </p>

                        {/* Fine print */}
                        <p
                          className="k-footer-fine"
                          style={{
                            margin: '0 0 6px',
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '10px',
                            color: C.brownMid,
                          }}
                        >
                          © {year} Karu
                        </p>
                        <p
                          className="k-footer-fine"
                          style={{
                            margin: 0,
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            fontSize: '10px',
                            lineHeight: '1.6',
                            color: C.brownMid,
                          }}
                        >
                          {t.unsubscribe}
                        </p>
                      </td>
                    </tr>

                  </tbody>
                </table>
                {/* /Card */}

              </td>
            </tr>
          </tbody>
        </table>

      </body>
    </html>
  )
}

export default WaitlistConfirmEmail
