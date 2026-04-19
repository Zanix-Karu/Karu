-- Run in Supabase SQL Editor or as a migration

CREATE TABLE IF NOT EXISTS waitlist_entries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('customer', 'vendor')),
  city        TEXT NOT NULL CHECK (city IN ('douala', 'yaounde', 'other')),
   
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_type ON waitlist_entries(type);
CREATE INDEX IF NOT EXISTS idx_waitlist_city ON waitlist_entries(city);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist_entries(created_at DESC);

-- Row Level Security
ALTER TABLE waitlist_entries ENABLE ROW LEVEL SECURITY;

-- Public can insert only (no read, no update, no delete)
CREATE POLICY "public_insert_only" ON waitlist_entries
  FOR INSERT TO anon WITH CHECK (true);

-- Service role has full access (bypasses RLS automatically)
-- No additional policy needed for service_role
