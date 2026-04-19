import * as React from 'react'

interface WaitlistConfirmEmailProps {
  type: 'customer' | 'vendor'
  city: 'douala' | 'yaounde' | 'other'
}

const cityDisplayNames: Record<WaitlistConfirmEmailProps['city'], string> = {
  douala: 'Douala',
  yaounde: 'Yaoundé',
  other: 'your city / votre ville',
}

export function WaitlistConfirmEmail({ type, city }: WaitlistConfirmEmailProps) {
  const cityName = cityDisplayNames[city]

  const heading =
    type === 'customer'
      ? 'Vous êtes sur la liste ! / You\'re on the list!'
      : 'Inscription confirmée ! / Registration confirmed!'

  const body =
    type === 'customer'
      ? `Merci de votre intérêt pour Zanix. Nous vous notifierons dès que nous lancerons à ${cityName}. / Thank you for your interest in Zanix. We'll notify you as soon as we launch in ${cityName}.`
      : "Merci de votre intérêt pour rejoindre Zanix en tant que prestataire. Nous vous contacterons bientôt. / Thank you for your interest in joining Zanix as a vendor. We'll be in touch soon."

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{heading}</title>
      </head>
      <body style={styles.body}>
        <table
          role="presentation"
          cellPadding={0}
          cellSpacing={0}
          style={styles.outerTable}
        >
          <tbody>
            <tr>
              <td align="center" style={styles.outerTd}>
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  style={styles.container}
                >
                  <tbody>
                    {/* Logo */}
                    <tr>
                      <td style={styles.logoCell}>
                        <span style={styles.logo}>ZANIX</span>
                      </td>
                    </tr>

                    {/* Divider */}
                    <tr>
                      <td style={styles.dividerCell}>
                        <div style={styles.divider} />
                      </td>
                    </tr>

                    {/* Heading */}
                    <tr>
                      <td style={styles.headingCell}>
                        <h1 style={styles.heading}>{heading}</h1>
                      </td>
                    </tr>

                    {/* Body text */}
                    <tr>
                      <td style={styles.bodyCell}>
                        <p style={styles.bodyText}>{body}</p>
                      </td>
                    </tr>

                    {/* CTA button */}
                    <tr>
                      <td style={styles.ctaCell}>
                        <a href="https://getkaru.io" style={styles.ctaButton}>
                          Visit getkaru.io
                        </a>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td style={styles.footerCell}>
                        <p style={styles.footerText}>
                          © {new Date().getFullYear()} Zanix. All rights reserved.
                        </p>
                        <p style={styles.footerText}>
                          Douala &amp; Yaoundé, Cameroon
                        </p>
                        <p style={styles.footerUnsubscribe}>
                          You received this email because you joined the Zanix waitlist.
                          {' '}To unsubscribe, reply with "unsubscribe" in the subject line.
                          <br />
                          Vous avez reçu cet e-mail car vous vous êtes inscrit sur la liste d&apos;attente Zanix.
                          {' '}Pour vous désabonner, répondez avec &quot;désabonner&quot; en objet.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#1C1208',
    fontFamily: 'Arial, sans-serif',
  } as React.CSSProperties,

  outerTable: {
    width: '100%',
    backgroundColor: '#1C1208',
  } as React.CSSProperties,

  outerTd: {
    padding: '40px 16px',
  } as React.CSSProperties,

  container: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#231508',
    borderRadius: '8px',
    overflow: 'hidden',
  } as React.CSSProperties,

  logoCell: {
    padding: '40px 40px 24px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  logo: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: '6px',
    color: '#E8A020',
  } as React.CSSProperties,

  dividerCell: {
    padding: '0 40px 32px',
  } as React.CSSProperties,

  divider: {
    height: '2px',
    backgroundColor: '#E8A020',
    borderRadius: '1px',
  } as React.CSSProperties,

  headingCell: {
    padding: '0 40px 20px',
  } as React.CSSProperties,

  heading: {
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#F5EFE4',
    lineHeight: '1.3',
  } as React.CSSProperties,

  bodyCell: {
    padding: '0 40px 32px',
  } as React.CSSProperties,

  bodyText: {
    margin: 0,
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#F5EFE4',
  } as React.CSSProperties,

  ctaCell: {
    padding: '0 40px 40px',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  ctaButton: {
    display: 'inline-block',
    padding: '14px 32px',
    backgroundColor: '#E8A020',
    color: '#1C1208',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  footerCell: {
    padding: '24px 40px 32px',
    borderTop: '1px solid #3D2510',
    textAlign: 'center' as const,
  } as React.CSSProperties,

  footerText: {
    margin: '0 0 4px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    color: '#8B6A3E',
  } as React.CSSProperties,

  footerUnsubscribe: {
    margin: '12px 0 0',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11px',
    lineHeight: '1.5',
    color: '#5C3A1E',
  } as React.CSSProperties,
} as const

export default WaitlistConfirmEmail
