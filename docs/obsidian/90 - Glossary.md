---
tags: [karu, reference, glossary]
created: 2026-05-10
---

# Glossary

> Terms and acronyms used in the Karu project.

## Cameroon-Specific

### XAF
Central African CFA franc. Currency of Cameroon and 5 other Central African countries. ISO code: XAF.

### MTN MoMo
MTN Mobile Money. Dominant mobile money service in Cameroon, run by MTN telecom. Payments via phone number + PIN.

### Orange Money
Second mobile money service in Cameroon, run by Orange telecom. Same model as MTN MoMo.

### NotchPay
Payment aggregator for Cameroon. Single API to integrate both MTN MoMo and Orange Money. We'll use this for actual payment processing in Phase 1.

### RCCM
**Registre du Commerce et du Crédit Mobilier**. Cameroon's commercial registry. Required for all vendors to prove legitimate business registration.

### Carte Grise
Vehicle registration document in Cameroon. Proof of vehicle ownership.

### Visite Technique
Mandatory annual roadworthiness inspection in Cameroon. Equivalent to UK MOT or US smog check.

### CIMA
**Conférence Interafricaine des Marchés d'Assurances**. Pan-African insurance regulator. CIMA-compliant insurance is mandatory for vehicles in Cameroon.

### DLA
IATA code for Douala International Airport.

### NSI
IATA code for Nsimalen International Airport (Yaoundé).

### Diaspora
Cameroonians living abroad — primarily in France, UK, US, Canada, Germany. Key target customer segment for Karu.

### Bilingual Cameroon
Cameroon is officially bilingual (French + English). Karu must support both.

## Technical

### RSC
**React Server Component**. Renders on the server, sends HTML + minimal JS to client. Default in Next.js 14 App Router.

### RLS
**Row Level Security**. Postgres feature where access policies are enforced at the row level. Used in Supabase.

### CSP
**Content Security Policy**. HTTP header that whitelists which external resources can load. Prevents XSS.

### CSRF
**Cross-Site Request Forgery**. Attack where another site tricks a user's browser into making a request to your API. Prevented via origin checks and `X-Requested-With` header.

### HMAC-SHA256
Hash-based Message Authentication Code with SHA-256. Used to hash IPs in a way that's non-reversible even if the secret salt is leaked.

### HSTS
**HTTP Strict Transport Security**. Header that forces browsers to use HTTPS for 2 years. Once set, even typing `http://` redirects to HTTPS.

### DKIM
**DomainKeys Identified Mail**. Cryptographic signature on outbound emails proving they came from your domain. Set up via 3 CNAME records.

### SPF
**Sender Policy Framework**. DNS record listing servers allowed to send email from your domain. Configured by Cloudflare Email Routing.

### DMARC
**Domain-based Message Authentication, Reporting & Conformance**. Tells receiving servers what to do if DKIM/SPF fails. Set as TXT record.

### Turnstile
Cloudflare's free CAPTCHA alternative. Verifies users are human without annoying them with image puzzles.

### Edge Runtime
Vercel's lightweight serverless runtime. Faster cold starts, runs closer to user. Used for some API routes.

## Karu-Specific

### Lead Tier
Computed sentiment score for each waitlist entry:
- 🔥 HOT (70+) — high-quality lead, prioritise outreach
- ⚠️ WARM (40-69) — decent lead, standard follow-up
- ❄️ COLD (0-39) — basic info only, low priority

See `lib/sentiment.ts`.

### Segment
Filter combination used for broadcast emails: `{ type, city, locale }`. Each can be a specific value or "all".

### Waitlist Entry
A row in `waitlist_entries` table representing one signup.

### Vendor
A car rental provider. Must be document-verified before listing.

### Customer
A person renting a car. Doesn't require verification at signup (verified at first booking).

### Pre-arrival booking
Booking a car before the customer arrives in Cameroon. Karu's core value proposition.

## See Also

- [[01 - Product Overview]]
- [[03 - Target Users]]
- [[10 - Tech Stack]]
- [[32 - Security]]
