// Network State quiz: question bank shared by the quiz page, the submit
// action and the results page. Bump QUIZ_VERSION whenever a question, a
// choice or a correct answer changes, so stored answers stay interpretable.

export const QUIZ_VERSION = '2026-10-04';

export interface KnowledgeQuestion {
  id: string;
  question: string;
  choices: { id: string; label: string }[];
  correct: string;
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'author',
    question: 'Who wrote "The Network State" (2022)?',
    choices: [
      { id: 'balaji', label: 'Balaji Srinivasan' },
      { id: 'vitalik', label: 'Vitalik Buterin' },
      { id: 'patri', label: 'Patri Friedman' },
      { id: 'thiel', label: 'Peter Thiel' },
    ],
    correct: 'balaji',
  },
  {
    id: 'progression',
    question: 'In the book, what comes right after a "startup society"?',
    choices: [
      { id: 'union', label: 'Network union' },
      { id: 'archipelago', label: 'Network archipelago' },
      { id: 'state', label: 'Network state' },
      { id: 'charter', label: 'Charter city' },
    ],
    correct: 'union',
  },
  {
    id: 'zuzalu',
    question: 'Zuzalu, the 2023 pop-up city, took place in which country?',
    choices: [
      { id: 'montenegro', label: 'Montenegro' },
      { id: 'portugal', label: 'Portugal' },
      { id: 'thailand', label: 'Thailand' },
      { id: 'mexico', label: 'Mexico' },
    ],
    correct: 'montenegro',
  },
  {
    id: 'prospera',
    question: 'Próspera is a charter city project in which country?',
    choices: [
      { id: 'honduras', label: 'Honduras' },
      { id: 'el-salvador', label: 'El Salvador' },
      { id: 'panama', label: 'Panama' },
      { id: 'costa-rica', label: 'Costa Rica' },
    ],
    correct: 'honduras',
  },
  {
    id: 'liberland',
    question: 'Liberland claims a strip of land between which two countries?',
    choices: [
      { id: 'hr-rs', label: 'Croatia and Serbia' },
      { id: 'at-hu', label: 'Austria and Hungary' },
      { id: 'si-hr', label: 'Slovenia and Croatia' },
      { id: 'rs-hu', label: 'Serbia and Hungary' },
    ],
    correct: 'hr-rs',
  },
  {
    id: 'network-school',
    question: "Network School's campus is in which country?",
    choices: [
      { id: 'malaysia', label: 'Malaysia' },
      { id: 'singapore', label: 'Singapore' },
      { id: 'indonesia', label: 'Indonesia' },
      { id: 'thailand', label: 'Thailand' },
    ],
    correct: 'malaysia',
  },
];

// Database column names, in the radar's display order
export const RADAR_METRICS = ['scalability', 'autonomy', 'qol', 'belonging', 'purpose', 'economic'] as const;
export type RadarMetric = (typeof RADAR_METRICS)[number];

// 5 always means "high on the radar" for that metric.
// [ASSUMPTION] Scalability: high = handles growth well. The bot's scores
// correlate positively with the other metrics, so it reads high as good.
export const METRIC_QUESTIONS: Record<RadarMetric, { label: string; question: string; low: string; high: string }> = {
  scalability: {
    label: 'Scalability',
    question: 'As it grows, does it keep its culture and coordinate well?',
    low: 'Growth is breaking it',
    high: 'Scales well',
  },
  autonomy: {
    label: 'Autonomy',
    question: 'Can members shape decisions, and leave freely?',
    low: 'Top-down, hard to leave',
    high: 'Real say, free to exit',
  },
  qol: {
    label: 'Quality of life',
    question: 'Is life there sustainable: wellbeing, pace, health?',
    low: 'Burnout',
    high: 'Thriving',
  },
  belonging: {
    label: 'Belonging',
    question: 'Do members feel they belong, that it is an "us"?',
    low: 'Strangers sharing a space',
    high: 'Feels like family',
  },
  purpose: {
    label: 'Purpose',
    question: 'Do members share a clear mission?',
    low: 'No shared why',
    high: 'Strongly aligned',
  },
  economic: {
    label: 'Economic opportunity',
    question: 'Can people earn a fair living there?',
    low: 'The game feels rigged',
    high: 'Real opportunity',
  },
};

export const RELATIONSHIPS = [
  { id: 'lived', label: 'Lived there or visited' },
  { id: 'event', label: 'Attended an event' },
  { id: 'online', label: 'Online member' },
  { id: 'outside', label: 'Follow it from outside' },
] as const;
export type Relationship = (typeof RELATIONSHIPS)[number]['id'];

export const MAX_PROJECTS = 3;
export const MAX_COMMENT_LENGTH = 1000;

export function scoreKnowledge(answers: Record<string, string>): number {
  const correct = KNOWLEDGE_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
  return correct / KNOWLEDGE_QUESTIONS.length;
}
