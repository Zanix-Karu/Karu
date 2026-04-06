# Supabase Migrations

## Running Migrations

### Option 1 — Supabase SQL Editor (recommended for initial setup)

1. Go to your [Supabase project dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Open `migrations/001_waitlist_entries.sql`
4. Paste the contents and click **Run**

### Option 2 — Supabase CLI

```bash
# Install the CLI if you haven't already
npm install -g supabase

# Link to your project (get the project ref from your dashboard URL)
supabase link --project-ref <your-project-ref>

# Push all pending migrations
supabase db push
```

### Option 3 — Direct psql connection

```bash
psql "postgresql://postgres:<password>@<host>:5432/postgres" \
  -f migrations/001_waitlist_entries.sql
```

Connection string is available in your Supabase dashboard under **Settings → Database**.

## Migrations

| File | Description |
|---|---|
| `001_waitlist_entries.sql` | Creates `waitlist_entries` table, indexes, and RLS policies |

## RLS Policy Summary

The `waitlist_entries` table uses Row Level Security:

- **anon** role: INSERT only — public users can join the waitlist but cannot read, update, or delete entries
- **service_role**: Full access (bypasses RLS) — used server-side via `SUPABASE_SERVICE_ROLE_KEY` for admin operations and analytics

> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It is server-only.
