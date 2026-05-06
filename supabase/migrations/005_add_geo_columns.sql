6-- Add geolocation columns captured from Vercel's edge headers at signup time

ALTER TABLE waitlist_entries
  ADD COLUMN IF NOT EXISTS country     TEXT,
  ADD COLUMN IF NOT EXISTS region      TEXT,
  ADD COLUMN IF NOT EXISTS city_geo    TEXT,
  ADD COLUMN IF NOT EXISTS lat         DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS lng         DECIMAL(10, 7),
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT now();
