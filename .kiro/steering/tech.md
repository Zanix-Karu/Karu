---
inclusion: always
---

# Karu — Tech Stack

## Frontend

### Framework
- **React Native + Expo SDK 54+** for mobile app (iOS + Android)
- **Next.js** (or plain HTML/CSS/JS) for web marketing site and vendor portal
- **Expo Router** for file-based routing in mobile app
- **NativeWind** for Tailwind-style styling in React Native

### State Management
- **Zustand** for client state (lightweight, simple)
- **TanStack Query** for server state, caching, and background sync

### Offline-First
- **WatermelonDB** (SQLite-backed) for local persistence
- **MMKV** for key-value caching (20× faster than AsyncStorage)
- **@react-native-community/netinfo** for network state monitoring
- Reads always hit local DB first; writes queue with `syncStatus` flag; sync on reconnect
- Bookings and payments ALWAYS require server validation — never processed offline

### Images
- **expo-image** with BlurHash placeholders for progressive loading
- Supabase Storage generates 3 sizes per image: thumbnail (150×100), medium (400×300), full (800×600) in WebP

### Maps
- **react-native-maps** + **OpenStreetMap** (free tiles, Africa coverage)

### Push Notifications
- **Expo Notifications** + **FCM** (free, cross-platform)

---

## Backend

### Primary Backend
- **Supabase** (PostgreSQL + Auth + Storage + Edge Functions + Realtime)
- Free tier: 500MB DB, 1GB storage, 50K MAUs — sufficient for MVP
- Pro tier ($25/month): 8GB DB, 100GB storage — upgrade at launch

### Region
- **MVP**: EU West Frankfurt (`eu-central-1`) — default Supabase region
- **Pre-launch**: Migrate to HOSTAFRICA South Africa (self-hosted Supabase) for data residency
- **Scale**: AWS Cape Town (`af-south-1`) via HOSTAFRICA or direct

### Auth
- Phone number + OTP as primary authentication (Africa-first)
- OTPs: 6-digit numeric, expire in 60–120 seconds, single-use, max 3 attempts
- JWT access tokens: RS256, 15-minute expiry
- Refresh tokens: stored in Android Keystore, 7–30 day lifetime, rotate on each use

### Database
- PostgreSQL via Supabase
- Row-Level Security (RLS) on ALL tables — no exceptions
- UUIDs for all user-facing resource IDs (never sequential integers)
- PostGIS for geolocation search (`ST_DWithin` for "find cars near me")

---

## Payments

### Primary
- **NotchPay** — Cameroon-native aggregator
- Covers: MTN Mobile Money (`cm.mtn`), Orange Money (`cm.orange`), Express Union, Visa, Mastercard, PayPal
- Fee: 1% per local transaction, no setup fees, no monthly fees
- SDK: `notchpay.js`, sandbox available

### Backup (regional expansion)
- **CinetPay** — 10 Francophone African countries, 1.5–3.5% fees

### Payment Security Rules
- All payment API calls over HTTPS only
- Implement idempotency keys on every payment request (prevent double charges)
- Validate webhook signatures and source IPs from payment providers
- Design for timeout/pending states — mobile money confirmation can take 10–30 seconds
- Implement transaction status polling as fallback to webhooks
- NEVER process payments client-side
- NEVER store mobile money PINs

---

## Communications

### Primary
- **Africa's Talking** — WhatsApp Business API, SMS, USSD, voice
- Covers Cameroon and 30+ African countries
- Use for: booking confirmations (WhatsApp), OTP delivery (SMS), USSD fallback

### Transactional Email
- **Resend** (resend.com) — free tier: 3,000 emails/month
- From: `Karu <noreply@getkaru.io>`
- Reply-to: `support@getkaru.io`
- All emails bilingual: French first, English below

---

## Hosting & Infrastructure

### Frontend Hosting
- **Vercel** (Hobby plan during build — free, non-commercial)
- **Vercel Pro** ($20/month) at commercial launch
- Auto-deploy from GitHub main branch

### DNS, CDN, SSL
- **Cloudflare** (free plan)
- Handles: DNS, CDN (330+ edge locations), DDoS protection, SSL (free, auto-renew)
- Email routing: `@getkaru.io` addresses forwarded via Cloudflare Email Routing (free)

### Domain Registrar
- **Namecheap** — domain registration only
- `getkaru.io` registered here, DNS managed in Cloudflare

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-public-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key — NEVER expose client-side]

# Payments
NOTCHPAY_PUBLIC_KEY=[notchpay-public-key]
NOTCHPAY_SECRET_KEY=[notchpay-secret-key]

# Email
RESEND_API_KEY=[resend-api-key]
EMAIL_FROM=noreply@getkaru.io
EMAIL_REPLY_TO=support@getkaru.io

# Africa's Talking
AT_API_KEY=[africastalking-api-key]
AT_USERNAME=[africastalking-username]

# App URLs
NEXT_PUBLIC_APP_URL=https://getkaru.io
NEXT_PUBLIC_APP_URL_STAGING=https://staging.getkaru.io
```

## Tech Stack Summary Table

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native + Expo SDK 54+ | OTA updates, Hermes engine, JS talent pool |
| Routing | Expo Router | File-based, deep linking |
| Styling | NativeWind | Tailwind for RN, rapid UI |
| State | Zustand + TanStack Query | Lightweight, offline caching |
| Local DB | WatermelonDB + MMKV | Offline-first, reactive |
| Backend | Supabase (PostgreSQL) | Auth, Storage, Edge Functions, RLS |
| Payments | NotchPay | 1% MTN MoMo + Orange Money |
| Comms | Africa's Talking | WhatsApp + SMS + USSD |
| Push | Expo Notifications + FCM | Free, cross-platform |
| Maps | react-native-maps + OpenStreetMap | Free tiles, Africa coverage |
| Images | expo-image + BlurHash + WebP | Progressive loading, caching |
| Hosting | Vercel | Auto-deploy, global CDN |
| DNS/Email | Cloudflare | Free SSL, email routing |
| Transactional | Resend | Free tier email sending |
