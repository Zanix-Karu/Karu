---
tags: [karu, team, reference]
created: 2026-05-10
---

# Team and Contacts

> People and points of contact for the Karu project.

## Internal Email Addresses

All forwarded to team Gmail via Cloudflare Email Routing.

| Address | Purpose |
|---------|---------|
| hello@getkaru.io | General enquiries, primary customer contact |
| support@getkaru.io | Customer support |
| vendors@getkaru.io | Vendor onboarding and support |
| admin@getkaru.io | Internal operations |
| legal@getkaru.io | Legal, compliance |
| privacy@getkaru.io | Data Protection Officer (Law 2024/017) |
| press@getkaru.io | Media enquiries |
| noreply@getkaru.io | Transactional sender (booking confirmations, OTPs) |

## External Service Logins

(Credentials in 1Password / Bitwarden / similar — not in this doc)

| Service | URL | Purpose |
|---------|-----|---------|
| Vercel | vercel.com | Hosting |
| Supabase | supabase.com/dashboard | Database |
| Cloudflare | dash.cloudflare.com | DNS, CDN, security |
| Resend | resend.com/dashboard | Email sending |
| Plausible | plausible.io | Analytics |
| Namecheap | namecheap.com | Domain registrar |
| GitHub | github.com/Zanix-Karu/Karu | Repo |

## Repos

- **Main repo**: github.com/Zanix-Karu/Karu
- **Branch**: `main`

## Live URLs

- Production: https://getkaru.io
- Vercel preview: https://karu-mu.vercel.app
- Maintenance page: https://getkaru.io/maintenance (if MAINTENANCE_MODE=true)
- Admin: https://getkaru.io/admin

## Founders / Team

(Add team members here as the project grows)

- **Founder / CEO**: TBD
- **CTO**: TBD
- **Designer**: TBD
- **Marketing Lead**: TBD

## Communication Channels

- Discord: dev team + founders
- Email: hello@getkaru.io
- Instagram: @getkaru.io

## Service Tiers / Costs

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | Free |
| Supabase | Free | Free |
| Cloudflare | Free | Free |
| Resend | Free | Free (3K emails/mo) |
| Plausible | Trial | Free (then $9/mo) |
| Namecheap | Standard | ~$10/year domain |
| Vercel Speed Insights | Free | Free |
| Cloudflare Turnstile | Free | Free (unlimited) |

**Total monthly**: ~$0 currently, ~$9 once Plausible trial ends.

## Emergency Contacts

If everything is on fire:

1. **Site down**: Check Vercel status → Vercel logs → Supabase status
2. **Email broken**: Check Resend dashboard → DNS records in Cloudflare
3. **Domain issue**: Check Cloudflare DNS → Namecheap nameservers
4. **Security incident**: Email hello@getkaru.io, check `/.well-known/security.txt`

## Documentation

Internal docs live in `docs/obsidian/` (this vault).

External:
- Cameroon Law 2024/017 (data protection): research links TBD
- NotchPay docs: notchpay.co/docs (for Phase 1 payments)
- Resend API: resend.com/docs

See [[40 - Roadmap]] for what's next.
