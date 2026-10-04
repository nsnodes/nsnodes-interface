// Network State quiz: question bank shared by the quiz page, the submit
// action and the results page. Bump QUIZ_VERSION whenever a question, a
// choice or a correct answer changes, so stored answers stay interpretable.

export const QUIZ_VERSION = '2026-10-04b';

// Vocabulary questions: each teaches one term of the space. The
// explanation is shown as soon as the question is answered.
export interface KnowledgeQuestion {
  id: string;
  question: string;
  choices: { id: string; label: string }[];
  correct: string;
  explanation: string;
}

export const KNOWLEDGE_QUESTIONS: KnowledgeQuestion[] = [
  {
    id: 'network-state',
    question: 'What is a network state?',
    choices: [
      { id: 'online-first', label: 'An aligned online community that crowdfunds land around the world and aims for diplomatic recognition' },
      { id: 'e-gov', label: 'A country that runs its public services online, like Estonia' },
      { id: 'blockchain', label: 'A blockchain that issues its own passports' },
      { id: 'alliance', label: 'An alliance of countries that share a digital currency' },
    ],
    correct: 'online-first',
    explanation:
      'A network state starts as a community online, gathers in physical places scattered across the map, and only later seeks recognition from existing states. Cloud first, land last.',
  },
  {
    id: 'ns',
    question: 'On nsnodes.com, what does "NS" stand for?',
    choices: [
      { id: 'school', label: 'Network School' },
      { id: 'state', label: 'Network State' },
      { id: 'society', label: 'Node Society' },
      { id: 'sovereignty', label: 'New Sovereignty' },
    ],
    correct: 'school',
    explanation:
      'NS is Network School, a live-in community where members learn, train and build together. It is one concrete step toward the broader idea of a network state, which is a different thing.',
  },
  {
    id: 'startup-society',
    question: 'What is a startup society?',
    choices: [
      { id: 'mission', label: 'A community built around a shared mission, before it has land or recognition' },
      { id: 'coworking', label: 'A co-working space for startup founders' },
      { id: 'company-housing', label: 'A company that houses its employees' },
      { id: 'registered', label: 'A legal entity registered inside an SEZ' },
    ],
    correct: 'mission',
    explanation:
      'A startup society is the early stage: people who share a purpose, organise online and start meeting in person. With enough members and funding it can grow toward a network state.',
  },
  {
    id: 'sez',
    question: 'What is an SEZ?',
    choices: [
      { id: 'zone', label: "An area inside a country with its own business, tax or trade rules, set by that country" },
      { id: 'no-country', label: 'Land outside the control of any country' },
      { id: 'treaty', label: 'A free trade agreement between two countries' },
      { id: 'crypto', label: 'A district where only crypto payments are accepted' },
    ],
    correct: 'zone',
    explanation:
      'A Special Economic Zone stays part of its host country, but runs on different economic rules. Shenzhen is the famous example. Many projects in this space build on SEZ law rather than starting from nothing.',
  },
  {
    id: 'charter-city',
    question: 'What makes a charter city different from an ordinary city?',
    choices: [
      { id: 'charter', label: 'The host country grants it its own charter: its own rules and administration' },
      { id: 'company-town', label: 'One company owns all the land and employs everyone' },
      { id: 'constitution', label: 'It has a written city constitution' },
      { id: 'leased', label: 'It rents its land from a neighbouring country' },
    ],
    correct: 'charter',
    explanation:
      'A charter city goes further than an SEZ: beyond economic rules, it can set much of its own governance under an agreement with the host country. Próspera in Honduras is the best-known attempt.',
  },
  {
    id: 'intentional-community',
    question: 'What is an intentional community?',
    choices: [
      { id: 'chosen', label: 'People who choose to live together around shared values, often sharing land, resources or work' },
      { id: 'zoned', label: 'A neighbourhood zoned for a single profession' },
      { id: 'paid-forum', label: 'An online forum with a membership fee' },
      { id: 'resettled', label: 'A community created by government resettlement' },
    ],
    correct: 'chosen',
    explanation:
      'Ecovillages, co-living houses and communes are all intentional communities. They are the oldest relative of the startup society: the difference is mostly scale, ambition and how much happens online.',
  },
  {
    id: 'pop-up-city',
    question: 'What is a pop-up city?',
    choices: [
      { id: 'temporary', label: 'A gathering of weeks to months where people co-live and co-work to try new ways of living' },
      { id: 'containers', label: 'A city built from shipping containers' },
      { id: 'festival', label: 'A one-weekend festival with no residents' },
      { id: 'disaster', label: 'An emergency camp after a natural disaster' },
    ],
    correct: 'temporary',
    explanation:
      'Pop-up cities like Zuzalu let a community test living together before committing to land. Many permanent projects started as one.',
  },
  {
    id: 'exit',
    question: 'In governance debates, what does "exit" mean?',
    choices: [
      { id: 'leave', label: "Leaving a system you disagree with, instead of trying to change it from inside" },
      { id: 'referendum', label: 'A referendum to leave a political union' },
      { id: 'sell', label: 'Selling your stake in a project' },
      { id: 'recall', label: 'Removing a leader by vote' },
    ],
    correct: 'leave',
    explanation:
      'Exit and voice are the two ways to respond to a system: leave it, or speak up to change it. The freedom to exit is why the Autonomy metric asks whether members can leave freely.',
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
