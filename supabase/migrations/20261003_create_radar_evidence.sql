-- Migration: Radar evidence model (quiz ratings + Bonfire observations)
-- Spec: docs/2026-10-03-radar-score-weighting.html
-- Date: 2026-10-03
--
-- The 6 radar metrics on `societies` (belonging, autonomy, economic, purpose,
-- scalability, qol) are overwritten by the NS-bonfire bot every scoring cycle.
-- Nothing else may write to them, or the bot erases it. This migration adds a
-- separate evidence layer instead:
--
--   radar_config          one row of tunable weights (no migration to retune)
--   quiz_responses        one row per quiz submission
--   quiz_project_feedback one row per (submission, project): relationship + comment
--   quiz_ratings          one row per (feedback, metric): a 1-5 rating
--   bonfire_observations  per-cycle Bonfire scores (phase 2; the bot still
--                         writes `societies` columns until it is changed)
--   radar_evidence        view: every piece of evidence as (value 0-1, weight)
--   society_radar_scores  view: one row per society, blended 0-1 scores
--
-- Additive only: no existing table or column is altered or dropped.
-- All tables have RLS enabled with no policies, like the rest of the schema;
-- the site reads and writes through the service role on the server.

-- ============================================================
-- Metric names (shared by every table below)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'radar_metric') THEN
    CREATE TYPE radar_metric AS ENUM
      ('belonging', 'autonomy', 'economic', 'purpose', 'scalability', 'qol');
  END IF;
END$$;

-- ============================================================
-- Table: radar_config (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS radar_config (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id), -- enforces a single row

  -- Neutral prior: every score starts at prior_value worth prior_weight ratings
  prior_value REAL NOT NULL DEFAULT 0.5 CHECK (prior_value BETWEEN 0 AND 1),
  prior_weight REAL NOT NULL DEFAULT 3 CHECK (prior_weight >= 0),

  -- One Bonfire reading at confidence 1.0 counts as this many ratings
  bonfire_weight REAL NOT NULL DEFAULT 5 CHECK (bonfire_weight >= 0),

  -- Quiz relationship weights
  weight_lived REAL NOT NULL DEFAULT 1.0 CHECK (weight_lived >= 0),
  weight_event REAL NOT NULL DEFAULT 0.6 CHECK (weight_event >= 0),
  weight_online REAL NOT NULL DEFAULT 0.5 CHECK (weight_online >= 0),
  weight_outside REAL NOT NULL DEFAULT 0.25 CHECK (weight_outside >= 0),

  -- Knowledge factor = knowledge_base + knowledge_span * knowledge_score
  -- (defaults give 0.75 for a score of 0, 1.25 for a perfect score)
  knowledge_base REAL NOT NULL DEFAULT 0.75 CHECK (knowledge_base >= 0),
  knowledge_span REAL NOT NULL DEFAULT 0.5 CHECK (knowledge_span >= 0),

  -- Evidence loses half its weight every half_life_days
  half_life_days REAL NOT NULL DEFAULT 180 CHECK (half_life_days > 0),

  -- certainty = evidence / (evidence + certainty_k)
  certainty_k REAL NOT NULL DEFAULT 5 CHECK (certainty_k > 0),

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO radar_config (id) VALUES (TRUE) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Table: quiz_responses
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Salted hashes only; never store a raw IP or cookie value
  respondent_hash TEXT NOT NULL,
  ip_hash TEXT NOT NULL,

  -- Knowledge section: { "<question_id>": "<choice_id>" }. Correct answers
  -- live in the app's question bank; the score is computed server-side.
  knowledge_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  knowledge_score REAL NOT NULL CHECK (knowledge_score BETWEEN 0 AND 1),
  quiz_version TEXT NOT NULL,

  duration_seconds INTEGER CHECK (duration_seconds IS NULL OR duration_seconds >= 0),

  -- Only 'accepted' responses count toward scores
  status TEXT NOT NULL DEFAULT 'accepted'
    CHECK (status IN ('accepted', 'flagged', 'rejected')),
  flag_reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_responses_ip_created ON quiz_responses(ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_respondent ON quiz_responses(respondent_hash);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created ON quiz_responses(created_at DESC);

-- ============================================================
-- Table: quiz_project_feedback
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_project_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES quiz_responses(id) ON DELETE CASCADE,
  society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,

  -- Denormalised from quiz_responses for the one-per-day constraint below
  respondent_hash TEXT NOT NULL,

  relationship TEXT NOT NULL
    CHECK (relationship IN ('lived', 'event', 'online', 'outside')),

  comment TEXT CHECK (comment IS NULL OR char_length(comment) <= 1000),
  comment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (comment_status IN ('pending', 'approved', 'hidden')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_day DATE GENERATED ALWAYS AS ((created_at AT TIME ZONE 'UTC')::date) STORED,

  UNIQUE (response_id, society_id),
  -- One rating of a given project per respondent per UTC day
  UNIQUE (respondent_hash, society_id, created_day)
);

CREATE INDEX IF NOT EXISTS idx_quiz_feedback_society ON quiz_project_feedback(society_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_feedback_comment_status ON quiz_project_feedback(comment_status)
  WHERE comment IS NOT NULL;

-- ============================================================
-- Table: quiz_ratings
-- "Don't know" is recorded by not inserting a row.
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_ratings (
  feedback_id UUID NOT NULL REFERENCES quiz_project_feedback(id) ON DELETE CASCADE,
  metric radar_metric NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  PRIMARY KEY (feedback_id, metric)
);

-- ============================================================
-- Table: bonfire_observations (phase 2)
-- One row per (scoring cycle, society, metric), covering only episodes not
-- scored before. Once a society has any row here, its legacy `societies`
-- columns stop counting as evidence (see radar_evidence).
-- ============================================================
CREATE TABLE IF NOT EXISTS bonfire_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
  metric radar_metric NOT NULL,
  value REAL NOT NULL CHECK (value BETWEEN 0 AND 1),
  confidence REAL NOT NULL CHECK (confidence BETWEEN 0 AND 1),
  signals INTEGER NOT NULL DEFAULT 1 CHECK (signals >= 0),
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bonfire_obs_society ON bonfire_observations(society_id, metric, observed_at DESC);

-- ============================================================
-- RLS: enabled, no policies (service role only, like the rest of public)
-- ============================================================
ALTER TABLE radar_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_project_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bonfire_observations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- View: radar_evidence
-- Every piece of evidence as (society, metric, source, value 0-1, weight),
-- with age decay already applied to the weight.
-- ============================================================
CREATE OR REPLACE VIEW radar_evidence
WITH (security_invoker = true) AS
WITH cfg AS (SELECT * FROM radar_config WHERE id),

quiz AS (
  SELECT
    f.society_id,
    r.metric,
    'quiz'::text AS source,
    (r.rating - 1) / 4.0 AS value,
    (CASE f.relationship
       WHEN 'lived'   THEN cfg.weight_lived
       WHEN 'event'   THEN cfg.weight_event
       WHEN 'online'  THEN cfg.weight_online
       WHEN 'outside' THEN cfg.weight_outside
     END)
      * (cfg.knowledge_base + cfg.knowledge_span * q.knowledge_score) AS base_weight,
    f.created_at AS observed_at
  FROM quiz_ratings r
  JOIN quiz_project_feedback f ON f.id = r.feedback_id
  JOIN quiz_responses q ON q.id = f.response_id
  CROSS JOIN cfg
  WHERE q.status = 'accepted'
),

bonfire AS (
  SELECT
    b.society_id,
    b.metric,
    'bonfire'::text AS source,
    b.value::double precision AS value,
    cfg.bonfire_weight * b.confidence AS base_weight,
    b.observed_at
  FROM bonfire_observations b
  CROSS JOIN cfg
),

-- Legacy: the bot's EMA values on `societies`, as one reading per metric.
-- Skipped when the bot never touched the row (radar_updated_at IS NULL:
-- the flat 0.5 placeholders) or once phase-2 observations exist.
bonfire_legacy AS (
  SELECT
    s.id AS society_id,
    m.metric,
    'bonfire'::text AS source,
    m.value,
    cfg.bonfire_weight * COALESCE(s.confidence, 0.5) AS base_weight,
    s.radar_updated_at AS observed_at
  FROM societies s
  CROSS JOIN cfg
  CROSS JOIN LATERAL (VALUES
    ('belonging'::radar_metric,   s.belonging),
    ('autonomy'::radar_metric,    s.autonomy),
    ('economic'::radar_metric,    s.economic),
    ('purpose'::radar_metric,     s.purpose),
    ('scalability'::radar_metric, s.scalability),
    ('qol'::radar_metric,         s.qol)
  ) AS m(metric, value)
  WHERE s.radar_updated_at IS NOT NULL
    AND m.value IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM bonfire_observations b WHERE b.society_id = s.id)
),

all_evidence AS (
  SELECT * FROM quiz
  UNION ALL SELECT * FROM bonfire
  UNION ALL SELECT * FROM bonfire_legacy
)

SELECT
  e.society_id,
  e.metric,
  e.source,
  e.value,
  e.base_weight
    * power(0.5, GREATEST(EXTRACT(EPOCH FROM (NOW() - e.observed_at)) / 86400.0, 0) / cfg.half_life_days)
    AS weight,
  e.observed_at
FROM all_evidence e
CROSS JOIN cfg;

-- ============================================================
-- View: society_radar_scores
-- One row per society. Scores are 0-1, same scale as the legacy columns.
--   score     = (prior_weight*prior_value + sum(w*v)) / (prior_weight + sum(w))
--   certainty = sum(w) / (sum(w) + certainty_k), averaged over the 6 metrics
-- ============================================================
CREATE OR REPLACE VIEW society_radar_scores
WITH (security_invoker = true) AS
WITH cfg AS (SELECT * FROM radar_config WHERE id),

per_metric AS (
  SELECT
    society_id,
    metric,
    SUM(weight) AS evidence,
    SUM(weight * value) AS weighted_sum,
    SUM(weight) FILTER (WHERE source = 'quiz') AS quiz_evidence,
    SUM(weight * value) FILTER (WHERE source = 'quiz') AS quiz_weighted_sum,
    SUM(weight) FILTER (WHERE source = 'bonfire') AS bonfire_evidence
  FROM radar_evidence
  GROUP BY society_id, metric
),

scored AS (
  SELECT
    p.society_id,
    p.metric,
    (cfg.prior_weight * cfg.prior_value + p.weighted_sum) / (cfg.prior_weight + p.evidence) AS score,
    p.quiz_weighted_sum / NULLIF(p.quiz_evidence, 0) AS quiz_only,
    p.evidence / (p.evidence + cfg.certainty_k) AS certainty,
    COALESCE(p.quiz_evidence, 0) AS quiz_evidence,
    COALESCE(p.bonfire_evidence, 0) AS bonfire_evidence
  FROM per_metric p
  CROSS JOIN cfg
),

quiz_counts AS (
  SELECT f.society_id, COUNT(*) AS quiz_ratings_count
  FROM quiz_project_feedback f
  JOIN quiz_responses q ON q.id = f.response_id
  WHERE q.status = 'accepted'
  GROUP BY f.society_id
)

-- A metric with no evidence falls back to the prior, so the radar never
-- receives a null (the component treats null as 0).
SELECT
  s.id AS society_id,
  s.name,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'belonging'),   MAX(cfg.prior_value)) AS belonging,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'autonomy'),    MAX(cfg.prior_value)) AS autonomy,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'economic'),    MAX(cfg.prior_value)) AS economic,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'purpose'),     MAX(cfg.prior_value)) AS purpose,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'scalability'), MAX(cfg.prior_value)) AS scalability,
  COALESCE(MAX(sc.score) FILTER (WHERE sc.metric = 'qol'),         MAX(cfg.prior_value)) AS qol,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'belonging')   AS quiz_belonging,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'autonomy')    AS quiz_autonomy,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'economic')    AS quiz_economic,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'purpose')     AS quiz_purpose,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'scalability') AS quiz_scalability,
  MAX(sc.quiz_only) FILTER (WHERE sc.metric = 'qol')         AS quiz_qol,
  -- Divide by 6, not AVG: a metric with no evidence has certainty 0
  SUM(sc.certainty) / 6.0 AS certainty,
  SUM(sc.quiz_evidence) / 6.0 AS quiz_evidence,
  SUM(sc.bonfire_evidence) / 6.0 AS bonfire_evidence,
  COALESCE(MAX(qc.quiz_ratings_count), 0) AS quiz_ratings_count
FROM societies s
JOIN scored sc ON sc.society_id = s.id
CROSS JOIN cfg
LEFT JOIN quiz_counts qc ON qc.society_id = s.id
GROUP BY s.id, s.name;

COMMENT ON VIEW society_radar_scores IS
  'Blended radar scores (0-1) per society from quiz ratings and Bonfire. Societies with no evidence are absent: show no radar for them.';
