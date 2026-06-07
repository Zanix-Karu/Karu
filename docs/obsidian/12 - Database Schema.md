---
tags: [karu, engineering, database, supabase]
created: 2026-05-10
---

# Database Schema

## Provider

**Supabase** (PostgreSQL) with Row Level Security enabled.

- Region: EU West (Ireland) — for [[32 - Security#Cameroon Data Protection|GDPR-style]] compliance
- Connection: service_role key (server only), anon key (client)
- Server client: `lib/supabase-admin.ts`

## Tables

### `waitlist_entries`

```sql
CREATE TABLE waitlist_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('customer', 'vendor')),
  city TEXT NOT NULL CHECK (city IN ('douala', 'yaounde', 'other')),
  locale TEXT DEFAULT 'en',
  ip_hash TEXT,                    -- HMAC-SHA256, non-reversible
  business_name TEXT,              -- vendor only
  business_email TEXT,             -- vendor only
  phone TEXT,                      -- vendor only
  vehicle_count TEXT,              -- vendor only ('1-5', '6-20', '21+')
  country TEXT,                    -- ISO code from Vercel headers
  region TEXT,
  city_geo TEXT,                   -- city from IP geolocation
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- `idx_waitlist_type` — filter by customer/vendor
- `idx_waitlist_city` — filter by city
- `idx_waitlist_created` — sort by date DESC

**RLS Policies**:
- `public_insert_only`: anon can INSERT only
- `service_role_all`: server has full access

### `admin_email_log`

```sql
CREATE TABLE admin_email_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  recipient_count INT NOT NULL DEFAULT 0,
  segment JSONB,                   -- {type, city, locale}
  resend_id TEXT,                  -- Resend message ID
  sent_at TIMESTAMPTZ DEFAULT now(),
  html_encrypted TEXT,             -- AES-encrypted body
  html_iv TEXT,                    -- Initialisation vector
  email_type TEXT DEFAULT 'broadcast'
                                   -- 'broadcast', 'single',
                                   -- 'customer_signup', 'vendor_signup'
);
```

**Indexes**:
- `idx_email_log_type`
- `idx_email_log_sent`

**RLS**: service_role only (no public access).

## Migrations

All in `supabase/migrations/`:

| File | Purpose |
|------|---------|
| `001_waitlist_entries.sql` | Initial table |
| `002_waitlist_karu.sql` | Karu rebrand updates |
| `003_vendor_fields.sql` | business_name, phone, vehicle_count |
| `004_add_locale.sql` | Locale tracking |
| `005_add_geo_columns.sql` | country, region, lat, lng |
| `006_email_log.sql` | admin_email_log table |
| `007_email_log_extended.sql` | Encryption columns |

## Common Queries

### All waitlist entries (admin)
```sql
SELECT * FROM waitlist_entries ORDER BY created_at DESC;
```

### Count signups
```sql
SELECT COUNT(*) FROM waitlist_entries;
```

### Filter by segment
```sql
SELECT * FROM waitlist_entries
WHERE type = 'vendor' AND city = 'douala';
```

### Drop and recreate
See [[43 - Launch Checklist#Reset Database]] for the full schema.

## Lead Scoring (Computed in App)

`lib/sentiment.ts` calculates a score 0-100 per entry:

| Tier | Score |
|------|-------|
| 🔥 HOT | 70+ |
| ⚠️ WARM | 40-69 |
| ❄️ COLD | 0-39 |

Factors: type (vendor +30), business email present (+20), phone present (+15), vehicle count 21+ (+20).

See `components/admin/WaitlistTable.tsx`.

## Privacy

- IPs **never** stored as plain text — HMAC-SHA256 with secret salt
- Email bodies encrypted with AES (key in env)
- Geographic data approximate (city-level, not address)

See [[32 - Security]] for full security model.
