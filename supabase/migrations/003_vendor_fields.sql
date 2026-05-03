-- Add vendor-specific fields to waitlist_entries

ALTER TABLE waitlist_entries
  ADD COLUMN IF NOT EXISTS business_name TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_count TEXT;

-- Index for vendor queries
CREATE INDEX IF NOT EXISTS idx_waitlist_vendor_fields
  ON waitlist_entries(type) WHERE type = 'vendor';
