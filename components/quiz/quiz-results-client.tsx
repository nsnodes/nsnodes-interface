'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getQuizResults } from '@/lib/actions/quiz';
import { METRIC_QUESTIONS, RADAR_METRICS } from '@/lib/data/quiz';
import { RADAR_COLORS } from '@/components/society/society-radar';
import type { QuizResults } from '@/lib/types/quiz';
import { cn } from '@/lib/utils';

const REFRESH_MS = 10_000;
const panel = 'border-2 border-border bg-card p-5 sm:p-6 shadow-brutal-md';

function pct(share: number) {
  return `${Math.round(share * 100)}%`;
}

export function QuizResultsClient({ initial }: { initial: QuizResults }) {
  const [results, setResults] = useState(initial);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (document.hidden) return;
      try {
        setResults(await getQuizResults());
      } catch (err) {
        console.error('Failed to refresh quiz results:', err);
      }
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'RESPONSES', value: results.responses },
    { label: 'PEOPLE', value: results.respondents },
    { label: 'AVG KNOWLEDGE', value: results.avgKnowledge != null ? pct(results.avgKnowledge) : '–' },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">[ LIVE QUIZ RESULTS ]</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Updates every 10 seconds · last update {new Date(results.updatedAt).toLocaleTimeString()}
          </p>
        </div>
        <Link
          href="/quiz"
          className="self-start sm:self-auto px-5 py-3 border-2 border-border bg-primary text-primary-foreground font-mono text-sm shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          [ TAKE THE QUIZ ]
        </Link>
      </header>

      <section className="grid grid-cols-3 gap-3" aria-label="Totals">
        {stats.map((s) => (
          <div key={s.label} className="border-2 border-border bg-card p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums">{s.value}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono">[ WHAT PEOPLE KNOW ]</h2>
        <div className={cn(panel, 'space-y-4')}>
          {results.knowledge.map((k) => (
            <div key={k.id} className="space-y-1">
              <div className="flex justify-between gap-4 font-mono text-sm">
                <span>{k.question}</span>
                <span className="tabular-nums shrink-0">{k.answered > 0 ? pct(k.correctShare) : '–'}</span>
              </div>
              <div className="h-2 border border-border bg-background" aria-hidden="true">
                <div className="h-full bg-primary" style={{ width: pct(k.correctShare) }} />
              </div>
              <p className="font-mono text-xs text-muted-foreground">Answer: {k.correctLabel}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono">[ HOW RATINGS MOVE THE RADAR ]</h2>
        <p className="font-mono text-xs text-muted-foreground max-w-3xl">
          Each project starts from its current radar. Every person gets one vote per metric, weighted by how well they
          know the project, with recent votes counting slightly more. Votes far from the consensus count less.
        </p>

        {results.projects.length === 0 ? (
          <div className={cn(panel, 'text-center font-mono text-sm text-muted-foreground')}>
            No ratings yet. Be the first.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {results.projects.map((p) => (
              <article key={p.societyId} className={cn(panel, 'space-y-4')}>
                <header className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-mono font-bold text-lg">{p.name}</h3>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    {p.split && (
                      <span className="border-2 border-border px-2 py-0.5 bg-background">COMMUNITY SPLIT</span>
                    )}
                    <span className="text-muted-foreground">
                      {p.voters} {p.voters === 1 ? 'voter' : 'voters'}
                    </span>
                  </div>
                </header>

                <table className="w-full font-mono text-xs">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="text-left font-normal pb-2">METRIC</th>
                      <th className="text-left font-normal pb-2 w-2/5">RADAR</th>
                      <th className="text-right font-normal pb-2">WAS</th>
                      <th className="text-right font-normal pb-2">NOW</th>
                      <th className="text-right font-normal pb-2">QUIZ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.metrics.map((m) => {
                      const delta = m.score - m.baseline;
                      const color = RADAR_COLORS[RADAR_METRICS.indexOf(m.metric)];
                      return (
                        <tr key={m.metric} className="border-t border-border">
                          <td className="py-2 pr-2">{METRIC_QUESTIONS[m.metric].label}</td>
                          <td className="py-2 pr-2">
                            <div className="relative h-2 bg-background border border-border" aria-hidden="true">
                              <div className="absolute inset-y-0 left-0" style={{ width: `${m.score}%`, backgroundColor: color }} />
                              <div
                                className="absolute -top-1 -bottom-1 w-0.5 bg-foreground"
                                style={{ left: `${m.baseline}%` }}
                                title="Before quiz votes"
                              />
                            </div>
                          </td>
                          <td className="py-2 text-right tabular-nums text-muted-foreground">{m.baseline}</td>
                          <td className="py-2 text-right tabular-nums font-bold">
                            {m.score}
                            {delta !== 0 && (
                              <span className="font-normal text-muted-foreground">
                                {' '}
                                ({delta > 0 ? '+' : ''}
                                {delta})
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-right tabular-nums">{m.quizConsensus ?? '–'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {p.comments.length > 0 && (
                  <ul className="space-y-2 border-t-2 border-border pt-3">
                    {p.comments.slice(0, 3).map((c, i) => (
                      <li key={i} className="font-mono text-xs">
                        &ldquo;{c}&rdquo;
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
