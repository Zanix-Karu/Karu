---
tags: [karu, seo, ai, operations]
created: 2026-05-10
---

# SEO and AI Optimisation

## Strategy

Won't rank #1 for "car rentals" globally (Hertz, Enterprise, Kayak dominate).

Will rank #1 for **Cameroon-specific** searches:
- "car rental Douala"
- "location voiture Yaoundé"
- "rent a car Cameroon"
- "Douala airport car hire"
- "Nsimalen airport car rental"

## Targeted Keywords (17 total)

### English
- car rental Cameroon
- rent a car Douala
- car hire Yaoundé
- airport car rental Cameroon
- Douala airport car hire
- Nsimalen airport car rental
- verified car rental Africa
- mobile money car rental
- MTN MoMo car rental
- diaspora car rental Cameroon

### French
- location voiture Cameroun
- location voiture Douala
- location voiture Yaoundé
- louer voiture Douala
- louer voiture Yaoundé

### Branded
- Karu car rental
- getkaru.io

## Structured Data (JSON-LD)

Three schemas in `app/[locale]/page.tsx`:

### 1. WebApplication
Tells Google this is a travel/booking app.

### 2. LocalBusiness
Shows in Google Maps and local search results. Includes:
- Geographic coordinates (Douala)
- Service area (Douala, Yaoundé, Cameroon)
- Service type: Car Rental

### 3. FAQPage
5 questions with pre-formatted answers. Appears as rich snippets in Google + gets pulled into AI-generated answers:

- "How do I rent a car in Douala, Cameroon?"
- "Is Karu available in Yaoundé?"
- "How are car rental vendors verified on Karu?"
- "Can I book a car in Cameroon before I arrive?"
- "What payment methods does Karu accept?"

## Sitemap

Multi-locale at `/sitemap.xml`:

| URL | Priority |
|-----|----------|
| / | 1.0 |
| /en | 1.0 |
| /fr | 0.9 |
| /en/contact | 0.5 |
| /fr/contact | 0.5 |
| /en/privacy, /fr/privacy | 0.3 |
| /en/terms, /fr/terms | 0.3 |

Submit to:
- Google Search Console
- Bing Webmaster Tools

## Hreflang

`alternates.languages` in metadata tells Google EN and FR are alternates of the same page (no duplicate content penalty).

## AI / LLM Optimisation

### `/llms.txt`
Plain-text summary of Karu for AI crawlers. The emerging standard (like robots.txt for AI).

### `/llms-full.txt`
Detailed context with FAQs, citations, all key facts. Used by Perplexity, ChatGPT browsing, Claude.

### `/.well-known/ai-plugin.json`
OpenAI plugin manifest format. Helps AI agents categorise the site.

### robots.txt
Explicitly allows:
- GPTBot (ChatGPT)
- ChatGPT-User
- Google-Extended (Gemini training)
- Anthropic-ai / ClaudeBot
- PerplexityBot
- Bytespider (TikTok)
- CCBot (Common Crawl)
- Googlebot, Bingbot, Yandex

## Open Graph

- Image: dynamic OG image at `/opengraph-image` (1200×630)
- Title: "Karu — Verified Car Rentals in Douala & Yaoundé, Cameroon"
- Description includes "Pre-arrival booking, MTN Mobile Money"
- Locale: en_CM, fr_CM

## Performance for SEO

Google ranks fast sites higher:
- 0 images (all CSS/SVG)
- Fonts use `display: swap`
- Plausible loads lazily
- 175 KB First Load JS
- 15 KB gzipped HTML

## Off-Page SEO Tasks

To do after launch:

- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Create Google Business Profile for Karu in Douala
- [ ] List on Cameroon business directories
- [ ] Get backlinks from travel blogs covering Cameroon
- [ ] Reach out to diaspora Facebook groups
- [ ] Guest post on car rental / travel blogs

See [[40 - Roadmap]]
