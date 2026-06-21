-- 010: Allow 'processing' on data_requests.status (idempotent constraint fix).
--
-- Why: the privacy confirm route (app/api/privacy/confirm) atomically claims a
-- request by moving it pending -> processing before executing the action. The
-- original 008 CHECK only allowed ('pending','completed','expired','rejected'),
-- so that UPDATE failed the constraint and every deletion/export/objection
-- returned a false "already processed" error.
--
-- 008 has since been corrected to include 'processing', but CREATE TABLE
-- IF NOT EXISTS will NOT alter a table that already exists. This migration
-- repairs any database that was created with the old constraint, and is a
-- harmless no-op (drops then re-adds the same definition) on a fresh one.

DO $$
BEGIN
  -- Only act if the table exists (it's created in 008).
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'data_requests'
  ) THEN
    -- Drop the existing status CHECK constraint, whatever it was named.
    EXECUTE (
      SELECT string_agg(
        format('ALTER TABLE public.data_requests DROP CONSTRAINT %I;', conname),
        ' '
      )
      FROM pg_constraint
      WHERE conrelid = 'public.data_requests'::regclass
        AND contype = 'c'
        AND pg_get_constraintdef(oid) ILIKE '%status%'
    );

    -- Re-add it with 'processing' included.
    ALTER TABLE public.data_requests
      ADD CONSTRAINT data_requests_status_check
      CHECK (status IN ('pending', 'processing', 'completed', 'expired', 'rejected'));
  END IF;
END $$;
