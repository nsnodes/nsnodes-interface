-- Migration: Create tables for Airtable data migration
-- Tables: societies_to_add, vc, grants, draft, influencers
-- Date: 2026-01-30

-- ============================================================
-- Table: societies_to_add
-- Staging table for societies pending review/addition
-- ============================================================
CREATE TABLE IF NOT EXISTS societies_to_add (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  type TEXT,
  category TEXT[], -- Array for multiple selections
  location TEXT,
  mission TEXT,
  founded TEXT,
  x TEXT, -- Twitter/X URL
  x_followers TEXT,
  discord TEXT,
  discord_members TEXT,
  application TEXT,
  events TEXT,
  icon_url TEXT,
  comment_before_adding TEXT, -- Notes about why to add
  airtable_record_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_societies_to_add_name ON societies_to_add(name);

-- ============================================================
-- Table: vc (Venture Capital firms)
-- ============================================================
CREATE TABLE IF NOT EXISTS vc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airtable_id INTEGER, -- Original Airtable auto-number ID
  name TEXT NOT NULL,
  url TEXT,
  contact_person TEXT,
  x TEXT, -- Twitter/X URL
  description TEXT,
  investments TEXT,
  size TEXT,
  portfolio_type_comments TEXT, -- Combined field from Airtable
  airtable_record_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vc_name ON vc(name);

-- ============================================================
-- Table: grants
-- ============================================================
CREATE TABLE IF NOT EXISTS grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airtable_id INTEGER, -- Original Airtable auto-number ID
  name TEXT NOT NULL,
  url TEXT,
  amount TEXT,
  type TEXT[], -- Array for multiple selections
  institution TEXT,
  note TEXT,
  airtable_record_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grants_name ON grants(name);
CREATE INDEX IF NOT EXISTS idx_grants_institution ON grants(institution);

-- ============================================================
-- Table: draft
-- Internal notes/tasks
-- ============================================================
CREATE TABLE IF NOT EXISTS draft (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  notes TEXT,
  assignee TEXT, -- Collaborator name/email
  status TEXT CHECK (status IN ('Todo', 'In progress', 'Done')),
  attachments JSONB, -- Array of attachment objects
  attachment_summary TEXT,
  substack TEXT, -- Rich text content
  airtable_record_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_draft_status ON draft(status);

-- ============================================================
-- Table: influencers
-- ============================================================
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  x TEXT, -- Twitter/X URL
  category TEXT,
  priority INTEGER,
  airtable_record_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_influencers_category ON influencers(category);
CREATE INDEX IF NOT EXISTS idx_influencers_priority ON influencers(priority);

-- ============================================================
-- Add airtable_record_id to societies table if not exists
-- (for tracking synced records)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'societies' AND column_name = 'airtable_record_id'
  ) THEN
    ALTER TABLE societies ADD COLUMN airtable_record_id TEXT UNIQUE;
  END IF;
END $$;
