-- Admin email broadcast log
CREATE TABLE IF NOT EXISTS admin_email_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject     TEXT NOT NULL,
  recipient_count INT NOT NULL DEFAULT 0,
  segment     JSONB,
  resend_id   TEXT,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
