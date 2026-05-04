-- Add locale field to track which language the user registered in

ALTER TABLE waitlist_entries
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'en'
    CHECK (locale IN ('en', 'fr'));
