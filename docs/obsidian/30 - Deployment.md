---
tags: [karu, operations, deployment]
created: 2026-05-10
---

# Deployment

## Stack

| Layer | Service |
|-------|---------|
| Hosting | [[#Vercel]] |
| DNS, CDN, SSL, WAF | [[#Cloudflare]] |
| Database | [[12 - Database Schema|Supabase]] |
| Email sending | [[34 - Email System|Resend]] |
| Email receiving | Cloudflare Email Routing |
| Domain registrar | Namecheap |

## Vercel

- Project name: `karu`
- Region: auto (multi-region edge)
- Build command: `next build`
- Output: `.next`
- Root directory: `./`
- Connected to: `github.com/Zanix-Karu/Karu` branch `main`

### Auto-deploys on push to main

### Environment Variables
See [[31 - Environment Variables]]

### Domains
- `getkaru.io` (apex)
- `www.getkaru.io` (redirects to apex)

## Cloudflare

- Plan: Free
- Zone: `getkaru.io`
- Nameservers configured at Namecheap

### DNS Records

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | 76.76.21.21 | ON |
| CNAME | www | cname.vercel-dns.com | ON |
| CNAME | resend._domainkey | (from Resend) | OFF |
| CNAME | s1._domainkey | (from Resend) | OFF |
| CNAME | s2._domainkey | (from Resend) | OFF |
| TXT | _dmarc | `v=DMARC1; p=quarantine; rua=mailto:hello@getkaru.io; pct=100` | — |
| MX | @ | (auto-added by Email Routing) | — |

### Security Settings
- SSL/TLS: **Full (strict)**
- Always Use HTTPS: **ON**
- Min TLS Version: **1.2**
- HSTS: enabled (set in Next.js headers)
- Bot Fight Mode: **ON**
- AI Labyrinth: **ON**

### Email Routing
Forwards to Gmail:
- hello@getkaru.io
- support@getkaru.io
- vendors@getkaru.io
- noreply@getkaru.io
- privacy@getkaru.io

## Namecheap

Only used for domain registration. DNS managed at Cloudflare.

Nameservers set to Cloudflare's (e.g., `aria.ns.cloudflare.com` + `duke.ns.cloudflare.com`).

## Deployment Workflow

```
Local development → git commit → git push origin main
  ↓
GitHub webhook → Vercel auto-deploy
  ↓
Build runs (next build)
  ↓
Deployed to Vercel edge
  ↓
Cloudflare proxies traffic
  ↓
Live at getkaru.io
```

## Maintenance Mode

Toggle by setting `MAINTENANCE_MODE=true` in Vercel env vars.

- Middleware redirects all routes to `/maintenance`
- API routes still work (don't break integrations)
- Set to `false` or delete to disable

## Pre-Deploy Checklist

- [ ] All env vars set in Vercel
- [ ] Supabase migrations run
- [ ] Resend domain verified (DKIM)
- [ ] Cloudflare DNS records correct
- [ ] DMARC record present
- [ ] Build passes locally (`npm run build`)
- [ ] No `console.log` left in code
- [ ] Tests pass (`npm test`)

See [[43 - Launch Checklist]]
