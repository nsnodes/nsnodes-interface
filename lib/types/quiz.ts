import type { RadarMetric, Relationship } from '@/lib/data/quiz';

export interface QuizSociety {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface QuizProjectInput {
  societyId: string;
  relationship: Relationship;
  // Missing metric = "don't know"
  ratings: Partial<Record<RadarMetric, number>>;
  comment?: string;
}

export interface QuizSubmission {
  knowledgeAnswers: Record<string, string>;
  projects: QuizProjectInput[];
  startedAt: number; // epoch ms, set when the quiz starts
  website?: string; // honeypot: must stay empty
}

export type QuizSubmitResult =
  | { ok: true; knowledgeScore: number; correct: number; total: number }
  | { ok: false; error: string };

export interface MetricResult {
  metric: RadarMetric;
  baseline: number; // 0-100, the radar before any votes
  score: number; // 0-100, the radar now
  quizConsensus: number | null; // 0-100, voters only
  voters: number;
  agreement: number | null; // 0-1
}

export interface ProjectResult {
  societyId: string;
  name: string;
  voters: number;
  split: boolean;
  metrics: MetricResult[];
  comments: string[];
}

export interface QuizResults {
  responses: number;
  respondents: number;
  avgKnowledge: number | null; // 0-1
  knowledge: { id: string; question: string; correctLabel: string; answered: number; correctShare: number }[];
  projects: ProjectResult[];
  updatedAt: string;
}
