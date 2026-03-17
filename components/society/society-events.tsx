'use client';

import { useState } from 'react';
import { Calendar, List, Clock } from 'lucide-react';
import Link from 'next/link';
import type { UIEvent } from '@/lib/types/events';
import { useClientTimezone } from '@/lib/hooks/useClientTimezone';

interface SocietyEventsProps {
  events: UIEvent[];
  societyName: string;
}

function TimelineView({ events }: { events: UIEvent[] }) {
  // Group events by date
  const grouped = new Map<string, UIEvent[]>();
  for (const event of events) {
    const key = event.date;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(event);
  }

  return (
    <div className="p-4 space-y-0">
      {Array.from(grouped.entries()).map(([date, dateEvents], gi) => (
        <div key={date} className="relative flex gap-4">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary border-2 border-primary flex-shrink-0 mt-1" />
            {gi < grouped.size - 1 && (
              <div className="w-px flex-1 bg-border min-h-[2rem]" />
            )}
          </div>

          <div className="flex-1 pb-6 last:pb-0">
            {/* Date header */}
            <div className="text-xs font-mono font-bold text-muted-foreground mb-2">{date}</div>

            <div className="space-y-2">
              {dateEvents.map((event, i) => (
                <a
                  key={i}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border border-border bg-background hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="font-mono font-bold text-sm">{event.title}</div>
                      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="text-xs font-mono text-muted-foreground truncate">
                          {event.location}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 border border-border bg-muted whitespace-nowrap flex-shrink-0">
                      {event.type}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TableView({ events }: { events: UIEvent[] }) {
  return (
    <div className="divide-y divide-border">
      {events.map((event, i) => (
        <a
          key={i}
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 hover:bg-accent transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="font-mono font-bold text-sm">{event.title}</div>
              <div className="text-xs font-mono text-muted-foreground">
                {event.date} · {event.time}
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                {event.location}
              </div>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 border border-border bg-muted whitespace-nowrap flex-shrink-0">
              {event.type}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

export function SocietyEvents({ events, societyName }: SocietyEventsProps) {
  const [view, setView] = useState<'timeline' | 'table'>('timeline');
  const clientEvents = useClientTimezone(events);

  if (clientEvents.length === 0) return null;

  const upcomingEvents = [...clientEvents]
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 8);

  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-mono font-bold text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          [ UPCOMING EVENTS ] ({clientEvents.length})
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setView('timeline')}
            className={`p-1.5 border border-border transition-colors ${view === 'timeline' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
            title="Timeline view"
          >
            <Calendar className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setView('table')}
            className={`p-1.5 border border-border transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-accent'}`}
            title="Table view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {view === 'timeline' ? (
        <TimelineView events={upcomingEvents} />
      ) : (
        <TableView events={upcomingEvents} />
      )}

      <div className="p-4 border-t border-border">
        <Link
          href={`/events?networkState=${encodeURIComponent(societyName)}#upcoming-events`}
          className="block text-center text-xs font-mono text-primary hover:underline"
        >
          {clientEvents.length > 8
            ? `View all ${clientEvents.length} events on Events page →`
            : `See events on calendar →`
          }
        </Link>
      </div>
    </div>
  );
}
