-- Add dashboard lifecycle and website health fields to societies.
-- These fields implement the inclusion/exclusion policy without removing rows
-- from the underlying corpus.

DO $$
BEGIN
  CREATE TYPE society_lifecycle_status AS ENUM ('active', 'watchlist', 'dormant', 'archived', 'removed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE society_url_status AS ENUM ('ok', 'redirect', 'timeout', 'error', 'ssl_error', 'unknown');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE societies
  ADD COLUMN IF NOT EXISTS status society_lifecycle_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS status_note TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS url_status society_url_status DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS url_checked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS url_last_success_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS url_status_code INTEGER,
  ADD COLUMN IF NOT EXISTS url_status_note TEXT;

CREATE INDEX IF NOT EXISTS idx_societies_status ON societies(status);
CREATE INDEX IF NOT EXISTS idx_societies_url_status ON societies(url_status);
CREATE INDEX IF NOT EXISTS idx_societies_url_checked_at ON societies(url_checked_at DESC);
