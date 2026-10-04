'use server';

import { createHash, randomUUID } from 'crypto';
import { cookies, headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import {
  KNOWLEDGE_QUESTIONS,
  MAX_COMMENT_LENGTH,
  MAX_PROJECTS,
  QUIZ_VERSION,
  RADAR_METRICS,
  RELATIONSHIPS,
  scoreKnowledge,
  type RadarMetric,
} from '@/lib/data/quiz';
import type {
  ProjectResult,
  QuizResults,
  QuizSociety,
  QuizSubmission,
  QuizSubmitResult,
} from '@/lib/types/quiz';

const RESPONDENT_COOKIE = 'nsq_id';
const MIN_SECONDS = 45; // faster submissions are stored as flagged
const MAX_PER_IP_PER_DAY = 5;
const SPLIT_AGREEMENT = 0.5; // below this, with 3+ voters, the community is split
const SPLIT_MIN_VOTERS = 3;

function hash(value: string): string {
  const salt = process.env.QUIZ_HASH_SALT;
  if (!salt) throw new Error('Missing QUIZ_HASH_SALT environment variable');
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}

async function getRespondentId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(RESPONDENT_COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  jar.set(RESPONDENT_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  return id;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
}

export async function getQuizSocieties(): Promise<QuizSociety[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('societies')
    .select('id, name, icon_url, category, tier')
    .gte('tier', 1)
    .lte('tier', 5)
    .order('tier', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching quiz societies:', error);
    return [];
  }
  return data.map((s) => ({
    id: s.id,
    name: s.name,
    icon: s.icon_url || undefined,
    category: s.category || undefined,
  }));
}

export async function submitQuiz(input: QuizSubmission): Promise<QuizSubmitResult> {
  const total = KNOWLEDGE_QUESTIONS.length;

  // Honeypot: pretend success, store nothing
  if (input.website) return { ok: true, knowledgeScore: 0, correct: 0, total };

  // --- Validate ---------------------------------------------------------
  const knowledgeAnswers: Record<string, string> = {};
  for (const q of KNOWLEDGE_QUESTIONS) {
    const answer = input.knowledgeAnswers?.[q.id];
    if (answer && q.choices.some((c) => c.id === answer)) knowledgeAnswers[q.id] = answer;
  }

  const projects = Array.isArray(input.projects) ? input.projects : [];
  if (projects.length === 0) return { ok: false, error: 'Pick at least one project to rate.' };
  if (projects.length > MAX_PROJECTS) return { ok: false, error: `Rate at most ${MAX_PROJECTS} projects.` };

  const societyIds = projects.map((p) => p.societyId);
  if (new Set(societyIds).size !== societyIds.length) {
    return { ok: false, error: 'Each project can only be rated once per submission.' };
  }

  const relationshipIds: string[] = RELATIONSHIPS.map((r) => r.id);
  for (const p of projects) {
    if (!relationshipIds.includes(p.relationship)) return { ok: false, error: 'Invalid relationship.' };
    for (const [metric, rating] of Object.entries(p.ratings ?? {})) {
      if (!RADAR_METRICS.includes(metric as RadarMetric)) return { ok: false, error: 'Invalid metric.' };
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: 'Ratings must be 1 to 5.' };
    }
    if (Object.keys(p.ratings ?? {}).length === 0) {
      return { ok: false, error: 'Rate at least one metric for each project, or remove it.' };
    }
    if (p.comment && p.comment.length > MAX_COMMENT_LENGTH) {
      return { ok: false, error: `Comments are limited to ${MAX_COMMENT_LENGTH} characters.` };
    }
  }

  const supabase = createServerClient();
  const respondentHash = hash(await getRespondentId());
  const ipHash = hash(await getClientIp());

  const { data: known, error: knownError } = await supabase
    .from('societies')
    .select('id, name')
    .in('id', societyIds);
  if (knownError || !known || known.length !== societyIds.length) {
    return { ok: false, error: 'Unknown project.' };
  }

  // --- Gates --------------------------------------------------------------
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recent } = await supabase
    .from('quiz_responses')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', dayAgo);
  if ((recent ?? 0) >= MAX_PER_IP_PER_DAY) {
    return { ok: false, error: 'Too many submissions from this network today. Try again tomorrow.' };
  }

  // One rating per project per person per UTC day (also enforced by the DB)
  const today = new Date().toISOString().slice(0, 10);
  const { data: already } = await supabase
    .from('quiz_project_feedback')
    .select('society_id')
    .eq('respondent_hash', respondentHash)
    .eq('created_day', today)
    .in('society_id', societyIds);
  if (already && already.length > 0) {
    const names = known.filter((s) => already.some((a) => a.society_id === s.id)).map((s) => s.name);
    return { ok: false, error: `You already rated ${names.join(', ')} today. Remove it or come back tomorrow.` };
  }

  const durationSeconds = Math.max(0, Math.round((Date.now() - Number(input.startedAt)) / 1000));
  const flagReasons: string[] = [];
  if (!Number.isFinite(durationSeconds) || durationSeconds < MIN_SECONDS) flagReasons.push('too_fast');
  for (const p of projects) {
    const values = Object.values(p.ratings);
    if (values.length >= 4 && values.every((v) => v === values[0]) && (values[0] === 1 || values[0] === 5)) {
      flagReasons.push('uniform_extreme');
      break;
    }
  }

  // --- Write --------------------------------------------------------------
  const knowledgeScore = scoreKnowledge(knowledgeAnswers);
  const { data: response, error: responseError } = await supabase
    .from('quiz_responses')
    .insert({
      respondent_hash: respondentHash,
      ip_hash: ipHash,
      knowledge_answers: knowledgeAnswers,
      knowledge_score: knowledgeScore,
      quiz_version: QUIZ_VERSION,
      duration_seconds: durationSeconds,
      status: flagReasons.length > 0 ? 'flagged' : 'accepted',
      flag_reason: flagReasons.length > 0 ? flagReasons.join(',') : null,
    })
    .select('id')
    .single();
  if (responseError || !response) {
    console.error('Error saving quiz response:', responseError);
    return { ok: false, error: 'Could not save your answers. Please try again.' };
  }

  const { data: feedback, error: feedbackError } = await supabase
    .from('quiz_project_feedback')
    .insert(
      projects.map((p) => ({
        response_id: response.id,
        society_id: p.societyId,
        respondent_hash: respondentHash,
        relationship: p.relationship,
        comment: p.comment?.trim() || null,
      }))
    )
    .select('id, society_id');

  const ratingRows = (feedback ?? []).flatMap((f) => {
    const p = projects.find((x) => x.societyId === f.society_id)!;
    return Object.entries(p.ratings).map(([metric, rating]) => ({ feedback_id: f.id, metric, rating }));
  });
  const { error: ratingsError } = feedbackError
    ? { error: feedbackError }
    : await supabase.from('quiz_ratings').insert(ratingRows);

  if (feedbackError || ratingsError) {
    console.error('Error saving quiz feedback:', feedbackError ?? ratingsError);
    // Remove the partial submission (cascades to feedback and ratings)
    await supabase.from('quiz_responses').delete().eq('id', response.id);
    return { ok: false, error: 'Could not save your ratings. Please try again.' };
  }

  const correct = Math.round(knowledgeScore * total);
  return { ok: true, knowledgeScore, correct, total };
}

export async function getQuizResults(): Promise<QuizResults> {
  const supabase = createServerClient();

  const [{ data: responses }, { data: consensus }, { data: comments }] = await Promise.all([
    supabase.from('quiz_responses').select('respondent_hash, knowledge_answers, knowledge_score').eq('status', 'accepted'),
    supabase
      .from('radar_metric_consensus')
      .select('society_id, name, metric, baseline, score, quiz_consensus, voters, agreement')
      .gt('voters', 0),
    supabase
      .from('quiz_project_feedback')
      .select('society_id, comment, created_at')
      .eq('comment_status', 'approved')
      .not('comment', 'is', null)
      .order('created_at', { ascending: false }),
  ]);

  const accepted = responses ?? [];
  const knowledge = KNOWLEDGE_QUESTIONS.map((q) => {
    const answered = accepted.filter((r) => r.knowledge_answers?.[q.id]);
    const right = answered.filter((r) => r.knowledge_answers[q.id] === q.correct).length;
    return {
      id: q.id,
      question: q.question,
      correctLabel: q.choices.find((c) => c.id === q.correct)!.label,
      answered: answered.length,
      correctShare: answered.length > 0 ? right / answered.length : 0,
    };
  });

  const bySociety = new Map<string, ProjectResult>();
  for (const row of consensus ?? []) {
    let project = bySociety.get(row.society_id);
    if (!project) {
      project = { societyId: row.society_id, name: row.name, voters: 0, split: false, metrics: [], comments: [] };
      bySociety.set(row.society_id, project);
    }
    project.voters = Math.max(project.voters, row.voters);
    if (row.voters >= SPLIT_MIN_VOTERS && row.agreement != null && row.agreement < SPLIT_AGREEMENT) project.split = true;
    project.metrics.push({
      metric: row.metric,
      baseline: Math.round(row.baseline * 100),
      score: Math.round(row.score * 100),
      quizConsensus: row.quiz_consensus != null ? Math.round(row.quiz_consensus * 100) : null,
      voters: row.voters,
      agreement: row.agreement,
    });
  }
  for (const c of comments ?? []) bySociety.get(c.society_id)?.comments.push(c.comment);
  for (const p of bySociety.values()) {
    p.metrics.sort((a, b) => RADAR_METRICS.indexOf(a.metric) - RADAR_METRICS.indexOf(b.metric));
  }

  return {
    responses: accepted.length,
    respondents: new Set(accepted.map((r) => r.respondent_hash)).size,
    avgKnowledge: accepted.length > 0 ? accepted.reduce((s, r) => s + r.knowledge_score, 0) / accepted.length : null,
    knowledge,
    projects: [...bySociety.values()].sort((a, b) => b.voters - a.voters || a.name.localeCompare(b.name)),
    updatedAt: new Date().toISOString(),
  };
}
