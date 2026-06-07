---
tags: [karu, engineering, structure]
created: 2026-05-10
---

# Folder Structure

```
karu-web/
├── app/                                # Next.js App Router
│   ├── [locale]/                       # i18n root (en | fr)
│   │   ├── layout.tsx                  # Fonts, metadata, Speed Insights
│   │   ├── page.tsx                    # Landing page + JSON-LD
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── admin/
│   │   ├── (protected)/
│   │   │   ├── analytics/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── emails/page.tsx
│   │   │   ├── map/page.tsx
│   │   │   ├── waitlist/page.tsx
│   │   │   └── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Redirect to dashboard
│   ├── api/
│   │   ├── admin/
│   │   │   ├── data/route.ts
│   │   │   ├── emails/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── send/route.ts
│   │   └── waitlist/
│   │       ├── route.ts
│   │       └── count/route.ts
│   ├── maintenance/
│   │   ├── layout.tsx
│   │   └── page.tsx                    # Animated maintenance page
│   ├── globals.css                     # Design tokens + animations
│   ├── opengraph-image.tsx             # Dynamic OG image
│   ├── robots.ts                       # Open to all crawlers
│   └── sitemap.ts                      # Multi-locale sitemap
│
├── components/
│   ├── landing/                        # See [[21 - Component Library]]
│   │   ├── HeroSection.tsx
│   │   ├── AnimatedHeroContent.tsx
│   │   ├── TickerBand.tsx
│   │   ├── AboutSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── StepCard.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── CitiesSection.tsx
│   │   ├── CityCard.tsx
│   │   ├── WaitlistSection.tsx
│   │   ├── FooterSection.tsx
│   │   └── StatsRow.tsx (unused)
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── TrendChart.tsx
│   │   ├── MapView.tsx
│   │   ├── WaitlistTable.tsx
│   │   └── EmailCenter.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   └── LocaleSwitcher.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Icon.tsx
│       ├── Ticker.tsx
│       ├── AnimatedCounter.tsx
│       ├── ScrollReveal.tsx
│       ├── BackToTop.tsx
│       └── CustomCursor.tsx
│
├── lib/
│   ├── supabase-admin.ts               # Server Supabase client
│   ├── validations.ts                  # Zod schemas + sanitisation
│   ├── crypto.ts                       # HMAC-SHA256 IP hashing
│   ├── animations.ts                   # Framer Motion variants
│   ├── email-template.ts               # Karu email wrapper
│   ├── email-encrypt.ts                # AES encryption
│   ├── admin-auth.ts                   # JWT helpers
│   ├── sentiment.ts                    # Lead scoring
│   ├── easing.ts                       # Easing curves
│   └── rate-limit.ts                   # In-memory (unused in prod)
│
├── emails/
│   └── WaitlistConfirmEmail.tsx        # Bilingual confirm email
│
├── messages/
│   ├── en.json                         # English UI strings
│   └── fr.json                         # French UI strings
│
├── i18n/
│   └── request.ts                      # next-intl config
│
├── supabase/
│   ├── README.md
│   ├── migrations/
│   │   ├── 001_waitlist_entries.sql
│   │   ├── 002_waitlist_karu.sql
│   │   ├── 003_vendor_fields.sql
│   │   ├── 004_add_locale.sql
│   │   ├── 005_add_geo_columns.sql
│   │   ├── 006_email_log.sql
│   │   └── 007_email_log_extended.sql
│   ├── seed_sample_data.sql
│   └── seed_email_log.sql
│
├── public/
│   ├── llms.txt                        # AI crawler summary
│   ├── llms-full.txt                   # Detailed AI context
│   ├── humans.txt
│   └── .well-known/
│       ├── security.txt
│       └── ai-plugin.json
│
├── tests/
│   ├── unit/
│   │   ├── counter.test.ts
│   │   ├── crypto.test.ts
│   │   └── validations.test.ts
│   └── e2e/
│       ├── keyboard.spec.ts
│       └── waitlist.spec.ts
│
├── scripts/
│   ├── check-translations.js
│   └── test-emails.ts
│
├── docs/
│   └── obsidian/                       # This vault
│
├── middleware.ts                       # i18n + admin auth + maintenance
├── next.config.mjs                     # Security headers, CSP
├── tailwind.config.ts                  # Design tokens
├── tsconfig.json
├── .env.example                        # Template
└── .gitignore
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase.tsx | `HeroSection.tsx` |
| Hooks | useCamelCase.ts | `useScrollProgress.ts` |
| Utils | camelCase.ts | `formatCurrency.ts` |
| API routes | always `route.ts` | `app/api/waitlist/route.ts` |
| Translation keys | dot.snake_case | `hero.cta_primary` |
| Supabase tables | snake_case_plural | `waitlist_entries` |
| Env vars | SCREAMING_SNAKE_CASE | `RESEND_API_KEY` |

See [[10 - Tech Stack]] for what each piece does.
