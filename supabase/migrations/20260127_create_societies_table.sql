-- Create societies table for API access
-- This table syncs with Airtable via webhook

CREATE TABLE IF NOT EXISTS societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields (matching SocietyDatabase interface)
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Physical', 'Online', 'Popup', 'Decentralized')),
  tier INTEGER NOT NULL DEFAULT 3 CHECK (tier >= 1 AND tier <= 5),

  -- Social links
  x TEXT NOT NULL DEFAULT '',
  discord TEXT NOT NULL DEFAULT '',
  telegram TEXT,

  -- Content
  mission TEXT NOT NULL DEFAULT '',
  application TEXT NOT NULL DEFAULT '',

  -- Optional fields
  location TEXT,
  icon_url TEXT,
  category TEXT,
  founded TEXT,

  -- Sync metadata
  airtable_record_id TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_societies_type ON societies(type);
CREATE INDEX IF NOT EXISTS idx_societies_tier ON societies(tier);
CREATE INDEX IF NOT EXISTS idx_societies_category ON societies(category);
CREATE INDEX IF NOT EXISTS idx_societies_name_url_search ON societies USING gin(to_tsvector('english', name || ' ' || url));
CREATE INDEX IF NOT EXISTS idx_societies_updated ON societies(updated_at DESC);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_societies_updated_at
  BEFORE UPDATE ON societies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
