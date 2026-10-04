-- Migration: Radar consensus model (person-level votes, robust blend)
-- Spec: docs/2026-10-04-radar-consensus.html
-- Supersedes the scoring views of 20261003_create_radar_evidence.sql.
-- Date: 2026-10-04
--
-- Model, per society and metric:
--   1. Each person gets ONE vote: a recency-weighted mean of their own
--      ratings (person_half_life_days), weighted by
--      reliability x relationship x knowledge x recency, capped at 1.
--   2. Votes far from the weighted median are down-weighted (Huber).
--   3. The score starts from the current radar value (the bot's column on
--      `societies`) worth baseline_weight votes, and moves only as votes
--      arrive:  score = (k*baseline + sum(w*h*x)) / (k + sum(w*h)).
--
-- With no votes, every score equals today's radar exactly.
-- The bot's columns on `societies` are read, never written.

-- ============================================================
-- Retire the first model's views and its unused table
-- ============================================================
DROP VIEW IF EXISTS society_radar_scores;
DROP VIEW IF EXISTS radar_evidence;
DROP TABLE IF EXISTS bonfire_observations; -- empty; Telegram stances become per-person votes in phase 2

-- ============================================================
-- radar_config: replace the first model's parameters
-- ============================================================
ALTER TABLE radar_config
  DROP COLUMN IF EXISTS prior_value,
  DROP COLUMN IF EXISTS prior_weight,
  DROP COLUMN IF EXISTS bonfire_weight,
  DROP COLUMN IF EXISTS half_life_days,
  DROP COLUMN IF EXISTS certainty_k;

ALTER TABLE radar_config
  -- Today's radar value counts as this many votes
  ADD COLUMN IF NOT EXISTS baseline_weight REAL NOT NULL DEFAULT 2 CHECK (baseline_weight > 0),
  -- Source reliability (Telegram is phase 2)
  ADD COLUMN IF NOT EXISTS quiz_reliability REAL NOT NULL DEFAULT 1.0 CHECK (quiz_reliability >= 0),
  ADD COLUMN IF NOT EXISTS telegram_reliability REAL NOT NULL DEFAULT 0.6 CHECK (telegram_reliability >= 0),
  -- Vote recency: floor + (1 - floor) * 0.5^(age / half_life). Max 2:1 with floor 0.5
  ADD COLUMN IF NOT EXISTS recency_floor REAL NOT NULL DEFAULT 0.5 CHECK (recency_floor BETWEEN 0 AND 1),
  ADD COLUMN IF NOT EXISTS recency_half_life_days REAL NOT NULL DEFAULT 90 CHECK (recency_half_life_days > 0),
  -- Within one person: how fast a newer rating replaces their older one
  ADD COLUMN IF NOT EXISTS person_half_life_days REAL NOT NULL DEFAULT 30 CHECK (person_half_life_days > 0),
  -- Huber outlier down-weighting
  ADD COLUMN IF NOT EXISTS huber_c REAL NOT NULL DEFAULT 1.5 CHECK (huber_c > 0),
  ADD COLUMN IF NOT EXISTS spread_floor REAL NOT NULL DEFAULT 0.1 CHECK (spread_floor > 0),
  ADD COLUMN IF NOT EXISTS huber_min_voters INTEGER NOT NULL DEFAULT 3 CHECK (huber_min_voters >= 1);

-- Knowledge factor now spans 0.8 (score 0) to 1.2 (perfect score)
UPDATE radar_config SET knowledge_base = 0.8, knowledge_span = 0.4, updated_at = NOW() WHERE id;

-- ============================================================
-- View: radar_person_votes
-- One row per (society, metric, person): that person's single vote.
-- ============================================================
CREATE OR REPLACE VIEW radar_person_votes
WITH (security_invoker = true) AS
WITH cfg AS (SELECT * FROM radar_config WHERE id),

stances AS (
  SELECT
    f.society_id,
    r.metric,
    f.respondent_hash AS person,
    'quiz'::text AS source,
    (r.rating - 1) / 4.0 AS value,
    f.relationship,
    q.knowledge_score,
    f.created_at,
    EXTRACT(EPOCH FROM (NOW() - f.created_at)) / 86400.0 AS age_days
  FROM quiz_ratings r
  JOIN quiz_project_feedback f ON f.id = r.feedback_id
  JOIN quiz_responses q ON q.id = f.response_id
  WHERE q.status = 'accepted'
),

-- The person's latest stance sets their relationship, knowledge and recency
latest AS (
  SELECT DISTINCT ON (society_id, metric, person)
    society_id, metric, person, source, relationship, knowledge_score, age_days
  FROM stances
  ORDER BY society_id, metric, person, created_at DESC
),

-- Their value: newer ratings count more (person_half_life_days)
own AS (
  SELECT
    s.society_id, s.metric, s.person,
    SUM(s.value * power(0.5, GREATEST(s.age_days, 0) / cfg.person_half_life_days))
      / SUM(power(0.5, GREATEST(s.age_days, 0) / cfg.person_half_life_days)) AS value,
    COUNT(*) AS stances,
    MAX(s.created_at) AS latest_at
  FROM stances s
  CROSS JOIN cfg
  GROUP BY s.society_id, s.metric, s.person
)

SELECT
  o.society_id,
  o.metric,
  o.person,
  l.source,
  o.value,
  LEAST(1.0,
    (CASE l.source WHEN 'quiz' THEN cfg.quiz_reliability ELSE cfg.telegram_reliability END)
    * (CASE l.relationship
         WHEN 'lived'   THEN cfg.weight_lived
         WHEN 'event'   THEN cfg.weight_event
         WHEN 'online'  THEN cfg.weight_online
         WHEN 'outside' THEN cfg.weight_outside
       END)
    * (cfg.knowledge_base + cfg.knowledge_span * l.knowledge_score)
    * (cfg.recency_floor + (1 - cfg.recency_floor)
         * power(0.5, GREATEST(l.age_days, 0) / cfg.recency_half_life_days))
  ) AS weight,
  o.stances,
  o.latest_at
FROM own o
JOIN latest l USING (society_id, metric, person)
CROSS JOIN cfg;

-- ============================================================
-- View: radar_metric_consensus
-- One row per (society, metric) for every society, voted or not.
-- ============================================================
CREATE OR REPLACE VIEW radar_metric_consensus
WITH (security_invoker = true) AS
WITH cfg AS (SELECT * FROM radar_config WHERE id),

-- Today's radar value is the baseline (flat 0.5 where never scored)
baseline AS (
  SELECT s.id AS society_id, s.name, m.metric, COALESCE(m.value, 0.5) AS baseline
  FROM societies s
  CROSS JOIN LATERAL (VALUES
    ('belonging'::radar_metric,   s.belonging),
    ('autonomy'::radar_metric,    s.autonomy),
    ('economic'::radar_metric,    s.economic),
    ('purpose'::radar_metric,     s.purpose),
    ('scalability'::radar_metric, s.scalability),
    ('qol'::radar_metric,         s.qol)
  ) AS m(metric, value)
),

votes AS (
  SELECT v.*,
    SUM(weight) OVER (PARTITION BY society_id, metric ORDER BY value, person
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_w,
    SUM(weight) OVER (PARTITION BY society_id, metric) AS total_w,
    COUNT(*)    OVER (PARTITION BY society_id, metric) AS voters
  FROM radar_person_votes v
  WHERE weight > 0
),

-- Weighted median: first value whose cumulative weight reaches half
median AS (
  SELECT society_id, metric, MIN(value) AS med
  FROM votes
  WHERE cum_w >= total_w / 2
  GROUP BY society_id, metric
),

deviations AS (
  SELECT v.society_id, v.metric, v.person, v.weight, ABS(v.value - md.med) AS dev
  FROM votes v
  JOIN median md USING (society_id, metric)
),

-- Weighted median absolute deviation
mad AS (
  SELECT society_id, metric, MIN(dev) AS mad
  FROM (
    SELECT d.*,
      SUM(weight) OVER (PARTITION BY society_id, metric ORDER BY dev, person
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_w,
      SUM(weight) OVER (PARTITION BY society_id, metric) AS total_w
    FROM deviations d
  ) x
  WHERE cum_w >= total_w / 2
  GROUP BY society_id, metric
),

-- Huber weight: full weight within huber_c * spread of the median
huber AS (
  SELECT
    v.society_id, v.metric, v.value, v.weight, v.voters,
    CASE
      WHEN v.voters < cfg.huber_min_voters THEN 1.0
      ELSE LEAST(1.0,
        cfg.huber_c * GREATEST(1.4826 * mad.mad, cfg.spread_floor)
          / NULLIF(ABS(v.value - md.med), 0))
    END AS h
  FROM votes v
  JOIN median md USING (society_id, metric)
  JOIN mad USING (society_id, metric)
  CROSS JOIN cfg
),

agg AS (
  SELECT
    society_id, metric,
    MAX(voters) AS voters,
    SUM(weight * COALESCE(h, 1.0)) AS sum_wh,
    SUM(weight * COALESCE(h, 1.0) * value) AS sum_whx,
    SUM(weight) AS sum_w,
    SUM(weight * weight) AS sum_w2,
    SUM(weight * value) / NULLIF(SUM(weight), 0) AS mean_w
  FROM huber
  GROUP BY society_id, metric
),

dispersion AS (
  SELECT h.society_id, h.metric,
    sqrt(SUM(h.weight * power(h.value - a.mean_w, 2)) / NULLIF(SUM(h.weight), 0)) AS sd_w
  FROM huber h
  JOIN agg a USING (society_id, metric)
  GROUP BY h.society_id, h.metric
)

SELECT
  b.society_id,
  b.name,
  b.metric,
  b.baseline,
  (cfg.baseline_weight * b.baseline + COALESCE(a.sum_whx, 0))
    / (cfg.baseline_weight + COALESCE(a.sum_wh, 0)) AS score,
  a.sum_whx / NULLIF(a.sum_wh, 0) AS quiz_consensus,
  md.med AS quiz_median,
  COALESCE(a.voters, 0) AS voters,
  COALESCE(power(a.sum_w, 2) / NULLIF(a.sum_w2, 0), 0) AS n_eff,
  -- 1 = everyone agrees, 0 = maximally split. Null below 2 voters.
  CASE WHEN a.voters >= 2 THEN GREATEST(0, 1 - d.sd_w / 0.5) END AS agreement
FROM baseline b
CROSS JOIN cfg
LEFT JOIN agg a USING (society_id, metric)
LEFT JOIN median md USING (society_id, metric)
LEFT JOIN dispersion d USING (society_id, metric);

-- ============================================================
-- View: society_radar_consensus
-- One row per society, wide, for the radar component.
-- ============================================================
CREATE OR REPLACE VIEW society_radar_consensus
WITH (security_invoker = true) AS
SELECT
  c.society_id,
  c.name,
  MAX(c.score) FILTER (WHERE c.metric = 'belonging')   AS belonging,
  MAX(c.score) FILTER (WHERE c.metric = 'autonomy')    AS autonomy,
  MAX(c.score) FILTER (WHERE c.metric = 'economic')    AS economic,
  MAX(c.score) FILTER (WHERE c.metric = 'purpose')     AS purpose,
  MAX(c.score) FILTER (WHERE c.metric = 'scalability') AS scalability,
  MAX(c.score) FILTER (WHERE c.metric = 'qol')         AS qol,
  (SELECT COUNT(DISTINCT v.person) FROM radar_person_votes v WHERE v.society_id = c.society_id) AS voters
FROM radar_metric_consensus c
GROUP BY c.society_id, c.name;

COMMENT ON VIEW society_radar_consensus IS
  'Radar scores (0-1) per society: today''s radar value moved by person-level quiz consensus. Equals the societies columns when nobody has voted.';
