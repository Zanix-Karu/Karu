-- Extend admin_email_log: encryption, transactional tracking, metadata
ALTER TABLE admin_email_log
  ADD COLUMN IF NOT EXISTS html_encrypted  TEXT,
  ADD COLUMN IF NOT EXISTS html_iv         TEXT,
  ADD COLUMN IF NOT EXISTS email_type      TEXT NOT NULL DEFAULT 'broadcast',
  ADD COLUMN IF NOT EXISTS recipient_email TEXT,
  ADD COLUMN IF NOT EXISTS metadata        JSONB;

-- Index for fast filtering by type
CREATE INDEX IF NOT EXISTS idx_email_log_type ON admin_email_log (email_type);
CREATE INDEX IF NOT EXISTS idx_email_log_sent ON admin_email_log (sent_at DESC);
