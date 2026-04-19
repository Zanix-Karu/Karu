---
inclusion: always
---

# Karu — Project Structure

## Repository Layout

```
karu/
├── .kiro/
│   ├── steering/
│   │   ├── product.md          ← Product identity, copy, tone (always loaded)
│   │   ├── tech.md             ← Tech stack, environment setup (always loaded)
│   │   ├── structure.md        ← This file — file layout, naming (always loaded)
│   │   ├── security.md         ← Security rules, RBAC, data protection (always loaded)
│   │   ├── design.md           ← Brand tokens, components, design system (always loaded)
│   │   ├── api-standards.md    ← REST conventions, error formats (fileMatch: api/)
│   │   └── payment-integration.md ← Mobile money patterns (fileMatch: payment*)
│   ├── specs/
│   │   ├── vendor-onboarding/
│   │   │   ├── requirements.md
│   │   │   ├── design.md
│   │   │   └── tasks.md
│   │   ├── booking-flow/
│   │   │   ├── requirements.md
│   │   │   ├── design.md
│   │   │   └── tasks.md
│   │   └── payment-flow/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── hooks/
│       ├── audit-on-save.kiro.hook
│       └── security-scan.kiro.hook
│
├── apps/
│   ├── web/                    ← Next.js marketing site (getkaru.io)
│   │   ├── app/
│   │   │   ├── page.tsx        ← Landing page
│   │   │   ├── layout.tsx
│   │   │   ├── blog/
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── help/
│   │   │       └── [slug]/page.tsx
│   │   ├── components/
│   │   │   ├── Nav.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Ticker.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── StatsRow.tsx
│   │   │   ├── TrustSection.tsx
│   │   │   ├── CitiesBlock.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   ├── styles/
│   │   │   └── karu-tokens.css ← All CSS variables
│   │   ├── public/
│   │   │   └── favicon.ico
│   │   ├── vercel.json
│   │   └── .env.example
│   │
│   ├── mobile/                 ← Expo React Native app
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login.tsx
│   │   │   │   └── verify.tsx
│   │   │   ├── (customer)/
│   │   │   │   ├── index.tsx   ← Search/browse
│   │   │   │   ├── car/[id].tsx
│   │   │   │   ├── booking/[id].tsx
│   │   │   │   └── profile.tsx
│   │   │   └── (vendor)/
│   │   │       ├── dashboard.tsx
│   │   │       ├── listings.tsx
│   │   │       └── bookings.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   └── assets/
│   │
│   └── vendor-portal/          ← Vendor web dashboard (vendor.getkaru.io)
│       └── app/
│
├── packages/
│   ├── supabase/               ← Shared Supabase client + types
│   │   ├── client.ts
│   │   ├── types.ts            ← Generated from Supabase schema
│   │   └── migrations/
│   │       ├── 001_initial.sql
│   │       ├── 002_waitlist.sql
│   │       └── 003_rls_policies.sql
│   │
│   └── ui/                     ← Shared design tokens (if monorepo)
│       └── tokens.ts
│
├── .env                        ← NEVER commit — in .gitignore
├── .env.example                ← Always commit — template only
├── .gitignore
└── README.md
```

---

## Domain → Codebase Mapping

| Domain | Codebase | Vercel Project |
|---|---|---|
| `getkaru.io` | `apps/web` | karu-web |
| `app.getkaru.io` | `apps/mobile` (web build) | karu-app |
| `vendor.getkaru.io` | `apps/vendor-portal` | karu-vendor |
| `staging.getkaru.io` | `apps/web` (staging branch) | karu-web (preview) |

---

## Naming Conventions

### Files & Folders
- Components: `PascalCase.tsx` (e.g. `BookingCard.tsx`)
- Utilities: `camelCase.ts` (e.g. `formatPrice.ts`)
- Hooks: `use` prefix (e.g. `useBooking.ts`, `useVendor.ts`)
- Types: `PascalCase` with `.types.ts` suffix (e.g. `booking.types.ts`)
- API routes: `kebab-case` (e.g. `/api/booking-confirm`)
- Folders: `kebab-case` (e.g. `vendor-portal/`, `booking-flow/`)

### Database Tables (snake_case)
```
users               ← unified user table (customer, vendor, admin roles)
vendor_profiles     ← vendor-specific extension of users
vehicles            ← physical vehicle assets
listings            ← bookable configurations of vehicles
bookings            ← core transaction entity
availability_blocks ← dates blocked per listing
payments            ← payment records
reviews             ← two-sided reviews
waitlist            ← pre-launch email capture
```

### CSS Classes (BEM-inspired with karu prefix)
```
.karu-[component]               ← base component
.karu-[component]--[modifier]   ← modifier
.karu-[component]__[element]    ← child element
```

### Environment Variables
- `NEXT_PUBLIC_*` — safe to expose client-side
- All others — server-side only, NEVER in client bundles

---

## Blog & Help Content (SEO Subfolders)

Blog and help docs MUST be subfolders, NEVER subdomains:

```
✅ getkaru.io/blog/how-to-rent-a-car-in-douala
✅ getkaru.io/help/payment-methods
❌ blog.getkaru.io/how-to-rent-a-car-in-douala  ← damages SEO authority
❌ help.getkaru.io/payment-methods               ← same problem
```

---

## Git Branch Strategy

```
main          ← production (auto-deploys to getkaru.io)
staging       ← staging (auto-deploys to staging.getkaru.io)
dev           ← active development
feature/*     ← feature branches (e.g. feature/vendor-dashboard)
fix/*         ← bug fix branches
```

Commit message format: `type(scope): description`
```
feat(booking): add vendor approval flow
fix(payment): handle MTN MoMo timeout state
chore(deps): update Supabase client to 2.x
docs(readme): add deployment instructions
```

---

## Staging Environment Rules

Staging environments MUST have:
```html
<!-- In <head> of all staging pages -->
<meta name="robots" content="noindex, nofollow">
```

Staging environment variables use separate Supabase project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-ref].supabase.co
NEXT_PUBLIC_APP_URL=https://staging.getkaru.io
```
