-- Create kids_submissions table
CREATE TABLE IF NOT EXISTS kids_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  kid1_age INTEGER CHECK (kid1_age IS NULL OR (kid1_age >= 1 AND kid1_age <= 15)),
  kid2_age INTEGER CHECK (kid2_age IS NULL OR (kid2_age >= 1 AND kid2_age <= 15)),
  kid3_age INTEGER CHECK (kid3_age IS NULL OR (kid3_age >= 1 AND kid3_age <= 15)),
  kid4_age INTEGER CHECK (kid4_age IS NULL OR (kid4_age >= 1 AND kid4_age <= 15)),
  parent1_discord TEXT NOT NULL,
  parent2_discord TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date range for faster queries
CREATE INDEX IF NOT EXISTS idx_kids_submissions_dates ON kids_submissions(start_date, end_date);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_kids_submissions_created ON kids_submissions(created_at DESC);
