-- 008: Privacy compliance (Cameroon Law 2024/017)
-- Consent capture on waitlist, data subject request log, breach log, marketing objection.

-- 1. Consent + objection columns on waitlist_entries
ALTER TABLE waitlist_entries
  ADD COLUMN IF NOT EXISTS consent_version TEXT,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS marketing_opt_out BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Data subject request log (audit trail for deletion / export / objection)
CREATE TABLE IF NOT EXISTS data_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,                  -- subject of the request; retained as compliance evidence (see ROPA retention)
  type TEXT NOT NULL CHECK (type IN ('deletion', 'export', 'objection')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'rejected')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'fr')),
  ip_hash TEXT,                         -- HMAC-SHA256, never raw
  detail JSONB,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_data_requests_status ON data_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_requests_email ON data_requests(email);

ALTER TABLE data_requests ENABLE ROW LEVEL SECURITY;

-- service_role only — no public access in any form
CREATE POLICY data_requests_service_role_all ON data_requests
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Breach log (Law 2024/017 breach notification duty)
CREATE TABLE IF NOT EXISTS breach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  affected_count INT,
  notified_authority_at TIMESTAMPTZ,    -- Personal Data Protection Authority notification timestamp
  notified_subjects_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'contained', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE breach_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY breach_log_service_role_all ON breach_log
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
