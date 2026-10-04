'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { submitQuiz } from '@/lib/actions/quiz';
import {
  KNOWLEDGE_QUESTIONS,
  MAX_COMMENT_LENGTH,
  MAX_PROJECTS,
  METRIC_QUESTIONS,
  RADAR_METRICS,
  RELATIONSHIPS,
  type RadarMetric,
  type Relationship,
} from '@/lib/data/quiz';
import type { QuizProjectInput, QuizSociety, QuizSubmitResult } from '@/lib/types/quiz';
import { cn } from '@/lib/utils';

type Step = 'intro' | 'knowledge' | 'projects' | 'rate' | 'done';

const STEPS: { id: Step; label: string }[] = [
  { id: 'knowledge', label: '01 KNOWLEDGE' },
  { id: 'projects', label: '02 PROJECTS' },
  { id: 'rate', label: '03 RATE' },
];

const panel = 'border-2 border-border bg-card p-5 sm:p-6 shadow-brutal-md';
const primaryButton =
  'px-5 py-3 border-2 border-border bg-primary text-primary-foreground font-mono text-sm shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-40 disabled:pointer-events-none';
const secondaryButton =
  'px-5 py-3 border-2 border-border bg-background font-mono text-sm hover:bg-muted transition-colors';

function choiceClass(selected: boolean) {
  return cn(
    'border-2 border-border px-3 py-2 font-mono text-sm text-left transition-colors',
    selected ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'
  );
}

export function QuizClient({ societies }: { societies: QuizSociety[] }) {
  const [step, setStep] = useState<Step>('intro');
  const [startedAt, setStartedAt] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<QuizProjectInput[]>([]);
  const [search, setSearch] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Extract<QuizSubmitResult, { ok: true }> | null>(null);

  const societyById = useMemo(() => new Map(societies.map((s) => [s.id, s])), [societies]);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const picked = new Set(projects.map((p) => p.societyId));
    return societies.filter((s) => !picked.has(s.id) && s.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search, societies, projects]);

  const allAnswered = KNOWLEDGE_QUESTIONS.every((q) => answers[q.id]);
  const everyProjectRated = projects.length > 0 && projects.every((p) => Object.keys(p.ratings).length > 0);

  function updateProject(societyId: string, change: Partial<QuizProjectInput>) {
    setProjects((prev) => prev.map((p) => (p.societyId === societyId ? { ...p, ...change } : p)));
  }

  function setRating(societyId: string, metric: RadarMetric, rating: number | null) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.societyId !== societyId) return p;
        const ratings = { ...p.ratings };
        if (rating === null) delete ratings[metric];
        else ratings[metric] = rating;
        return { ...p, ratings };
      })
    );
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await submitQuiz({ knowledgeAnswers: answers, projects, startedAt, website });
      if (res.ok) {
        setResult(res);
        setStep('done');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function goTo(next: Step) {
    setError('');
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <header className="space-y-3">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">[ NETWORK STATE QUIZ ]</h1>
        <p className="text-muted-foreground font-mono text-sm sm:text-base">
          Learn the vocabulary of the space, then rate the projects you know first-hand. Your ratings move the community radar on
          each project page.
        </p>
      </header>

      {step !== 'intro' && step !== 'done' && (
        <ol className="grid grid-cols-3 gap-2" aria-label="Quiz progress">
          {STEPS.map((s) => (
            <li
              key={s.id}
              aria-current={s.id === step ? 'step' : undefined}
              className={cn(
                'border-2 border-border px-2 py-2 font-mono text-xs text-center',
                s.id === step ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
              )}
            >
              {s.label}
            </li>
          ))}
        </ol>
      )}

      {/* Honeypot: hidden from people, filled in by bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {step === 'intro' && (
        <section className={cn(panel, 'space-y-5')}>
          <ul className="space-y-2 font-mono text-sm">
            <li>&gt; {KNOWLEDGE_QUESTIONS.length} key terms of the space: network state, SEZ, charter city and more, each explained as you answer</li>
            <li>&gt; Pick up to {MAX_PROJECTS} projects you know</li>
            <li>&gt; Rate each on the 6 radar metrics. &quot;Don&apos;t know&quot; is always fine</li>
          </ul>
          <p className="font-mono text-xs text-muted-foreground">
            About 3 minutes. No account needed. We store a salted hash of your browser cookie and IP to stop
            duplicate votes, never the raw values.
          </p>
          <button
            className={primaryButton}
            onClick={() => {
              setStartedAt(Date.now());
              goTo('knowledge');
            }}
          >
            [ START ]
          </button>
        </section>
      )}

      {step === 'knowledge' && (
        <section className="space-y-5">
          {KNOWLEDGE_QUESTIONS.map((q, i) => (
            <fieldset key={q.id} className={panel}>
              <legend className="sr-only">{q.question}</legend>
              <p className="font-mono text-sm font-bold mb-3" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}. {q.question}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.choices.map((c) => {
                  const answered = answers[q.id] !== undefined;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={answers[q.id] === c.id}
                      disabled={answered}
                      className={cn(
                        choiceClass(answers[q.id] === c.id),
                        answered && c.id === q.correct && 'ring-2 ring-green-600',
                        answered && 'cursor-default'
                      )}
                      // The first answer counts: it is locked, then explained
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: c.id }))}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              {answers[q.id] && (
                <p className="mt-3 font-mono text-xs sm:text-sm" role="status">
                  <span className="font-bold">{answers[q.id] === q.correct ? '✓ Correct. ' : '✗ Not quite. '}</span>
                  {q.explanation}
                </p>
              )}
            </fieldset>
          ))}
          <div className="flex justify-end">
            <button className={primaryButton} disabled={!allAnswered} onClick={() => goTo('projects')}>
              [ NEXT: PROJECTS ]
            </button>
          </div>
        </section>
      )}

      {step === 'projects' && (
        <section className="space-y-5">
          <div className={cn(panel, 'space-y-3')}>
            <label htmlFor="project-search" className="block font-mono text-sm font-bold">
              Which projects do you know? ({projects.length}/{MAX_PROJECTS})
            </label>
            <input
              id="project-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={projects.length >= MAX_PROJECTS}
              placeholder={projects.length >= MAX_PROJECTS ? 'Maximum reached' : 'Search: Network School, Zuzalu, Próspera…'}
              className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {matches.length > 0 && (
              <ul className="border-2 border-border divide-y-2 divide-border">
                {matches.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 font-mono text-sm text-left bg-background hover:bg-muted"
                      onClick={() => {
                        setProjects((p) => [...p, { societyId: s.id, relationship: 'outside', ratings: {} }]);
                        setSearch('');
                      }}
                    >
                      + {s.name}
                      {s.category && <span className="text-muted-foreground"> · {s.category}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {projects.map((p) => (
            <div key={p.societyId} className={cn(panel, 'space-y-3')}>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-mono font-bold">{societyById.get(p.societyId)?.name}</h2>
                <button
                  type="button"
                  className="font-mono text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setProjects((prev) => prev.filter((x) => x.societyId !== p.societyId))}
                >
                  [ REMOVE ]
                </button>
              </div>
              <p className="font-mono text-xs text-muted-foreground">How do you know it?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RELATIONSHIPS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={p.relationship === r.id}
                    className={choiceClass(p.relationship === r.id)}
                    onClick={() => updateProject(p.societyId, { relationship: r.id as Relationship })}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-between gap-3">
            <button className={secondaryButton} onClick={() => goTo('knowledge')}>
              [ BACK ]
            </button>
            <button className={primaryButton} disabled={projects.length === 0} onClick={() => goTo('rate')}>
              [ NEXT: RATE ]
            </button>
          </div>
        </section>
      )}

      {step === 'rate' && (
        <section className="space-y-6">
          {projects.map((p) => (
            <div key={p.societyId} className={cn(panel, 'space-y-5')}>
              <h2 className="font-mono font-bold text-lg">{societyById.get(p.societyId)?.name}</h2>
              {RADAR_METRICS.map((metric) => {
                const q = METRIC_QUESTIONS[metric];
                const current = p.ratings[metric];
                return (
                  <fieldset key={metric} className="space-y-2">
                    <legend className="font-mono text-sm">
                      <span className="font-bold">{q.label}:</span> {q.question}
                    </legend>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground w-full sm:w-auto sm:min-w-28">{q.low}</span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-pressed={current === n}
                          aria-label={`${q.label} ${n} of 5`}
                          className={cn(choiceClass(current === n), 'w-11 text-center')}
                          onClick={() => setRating(p.societyId, metric, n)}
                        >
                          {n}
                        </button>
                      ))}
                      <span className="font-mono text-xs text-muted-foreground sm:min-w-24">{q.high}</span>
                      <button
                        type="button"
                        aria-pressed={current === undefined}
                        className={cn(choiceClass(current === undefined), 'text-xs')}
                        onClick={() => setRating(p.societyId, metric, null)}
                      >
                        Don&apos;t know
                      </button>
                    </div>
                  </fieldset>
                );
              })}
              <div className="space-y-1">
                <label htmlFor={`comment-${p.societyId}`} className="block font-mono text-sm font-bold">
                  Anything else? <span className="font-normal text-muted-foreground">(optional, reviewed before it&apos;s shown)</span>
                </label>
                <textarea
                  id={`comment-${p.societyId}`}
                  value={p.comment ?? ''}
                  maxLength={MAX_COMMENT_LENGTH}
                  rows={3}
                  onChange={(e) => updateProject(p.societyId, { comment: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          ))}

          {error && (
            <div role="alert" className="p-3 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-3">
            <button className={secondaryButton} onClick={() => goTo('projects')}>
              [ BACK ]
            </button>
            <button className={primaryButton} disabled={!everyProjectRated || submitting} onClick={handleSubmit}>
              {submitting ? '[ SUBMITTING… ]' : '[ SUBMIT ]'}
            </button>
          </div>
          {!everyProjectRated && (
            <p className="font-mono text-xs text-muted-foreground text-right">
              Rate at least one metric per project, or remove the project.
            </p>
          )}
        </section>
      )}

      {step === 'done' && result && (
        <section className={cn(panel, 'space-y-4')}>
          <h2 className="font-mono font-bold text-xl">[ THANKS ]</h2>
          <p className="font-mono text-sm">
            You got <span className="font-bold">{result.correct}/{result.total}</span> knowledge questions right. Your
            ratings are in.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/quiz/results" className={primaryButton}>
              [ SEE LIVE RESULTS ]
            </Link>
            <Link href="/societies" className={secondaryButton}>
              [ BROWSE SOCIETIES ]
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
