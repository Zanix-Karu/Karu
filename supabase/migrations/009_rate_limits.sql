-- 009: Persistent rate limiting (replaces the in-memory limiter that resets on
-- every serverless cold start). Fixed-window counter keyed by an opaque string
-- (e.g. "privacy_request:<hashed-ip>"). Atomic check-and-increment via RPC so
-- concurrent invocations on different serverless instances share one counter.

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- service_role only; no public access in any form
DROP POLICY IF EXISTS rate_limits_service_role_all ON rate_limits;
CREATE POLICY rate_limits_service_role_all ON rate_limits
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Atomic fixed-window check-and-increment.
-- Returns TRUE when the request is ALLOWED, FALSE when the limit is exceeded.
-- p_limit = max requests per window; p_window_seconds = window length.
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key TEXT,
  p_limit INT,
  p_window_seconds INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
  v_window_start TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Upsert the row, locking it for this transaction.
  INSERT INTO rate_limits (key, count, window_start)
  VALUES (p_key, 0, v_now)
  ON CONFLICT (key) DO NOTHING;

  SELECT count, window_start INTO v_count, v_window_start
  FROM rate_limits
  WHERE key = p_key
  FOR UPDATE;

  -- Window expired → reset.
  IF v_now - v_window_start > make_interval(secs => p_window_seconds) THEN
    UPDATE rate_limits
    SET count = 1, window_start = v_now
    WHERE key = p_key;
    RETURN TRUE;
  END IF;

  -- Within window but at/over the limit → deny (do not increment further).
  IF v_count >= p_limit THEN
    RETURN FALSE;
  END IF;

  -- Within window and under the limit → increment and allow.
  UPDATE rate_limits SET count = count + 1 WHERE key = p_key;
  RETURN TRUE;
END;
$$;

-- Opportunistic cleanup of stale rows (call occasionally; not on the hot path).
CREATE OR REPLACE FUNCTION prune_rate_limits(p_older_than_seconds INT DEFAULT 86400)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - make_interval(secs => p_older_than_seconds);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;
