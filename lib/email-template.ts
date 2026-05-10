/**
 * Wraps email body content in the Karu branded template.
 * Matches the dark espresso/amber design of the landing page.
 */
export function wrapInKaruTemplate(bodyHtml: string, subject: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#1C1208;font-family:Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background-color:#1C1208;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#231508;border-radius:8px;overflow:hidden;">
          <!-- Logo -->
          <tr>
            <td style="padding:40px 40px 24px;text-align:center;">
              <span style="font-family:Arial,sans-serif;font-size:36px;font-weight:bold;letter-spacing:6px;color:#E8A020;">KARU</span>
            </td>
          </tr>
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="height:2px;background-color:#E8A020;border-radius:1px;"></div>
            </td>
          </tr>
          <!-- Subject as heading -->
          <tr>
            <td style="padding:0 40px 20px;">
              <h1 style="margin:0;font-family:Arial,sans-serif;font-size:22px;font-weight:bold;color:#F5EFE4;line-height:1.3;">${escapeHtml(subject)}</h1>
            </td>
          </tr>
          <!-- Body content -->
          <tr>
            <td style="padding:0 40px 32px;font-family:Arial,sans-serif;font-size:16px;line-height:1.7;color:#F5EFE4;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <a href="https://getkaru.io" style="display:inline-block;padding:14px 32px;background-color:#E8A020;color:#1C1208;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;border-radius:4px;letter-spacing:0.5px;">
                Visit getkaru.io
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #3D2510;text-align:center;">
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#8B6A3E;">
                &copy; ${new Date().getFullYear()} Karu. All rights reserved.
              </p>
              <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:13px;color:#8B6A3E;">
                Douala &amp; Yaound&eacute;, Cameroon
              </p>
              <p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:11px;line-height:1.5;color:#5C3A1E;">
                You received this email because you are on the Karu waitlist.<br/>
                To unsubscribe, reply with "unsubscribe" in the subject line.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
