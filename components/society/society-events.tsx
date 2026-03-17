'use client';

import { Calendar } from 'lucide-react';
import Link from 'next/link';
import type { UIEvent } from '@/lib/types/events';
import { useClientTimezone } from '@/lib/hooks/useClientTimezone';

interface SocietyEventsProps {
  events: UIEvent[];
  societyName: string;
}

export function SocietyEvents({ events, societyName }: SocietyEventsProps) {
  const clientEvents = useClientTimezone(events);

  if (clientEvents.length === 0) return null;

  const upcomingEvents = [...clientEvents]
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 5);

  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono font-bold text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          [ UPCOMING EVENTS ] ({clientEvents.length})
        </h2>
      </div>
      <div className="divide-y divide-border">
        {upcomingEvents.map((event, i) => (
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
      <div className="p-4 border-t border-border">
        <Link
          href={`/events?networkState=${encodeURIComponent(societyName)}#upcoming-events`}
          className="block text-center text-xs font-mono text-primary hover:underline"
        >
          {clientEvents.length > 5
            ? `View all ${clientEvents.length} events on Events page →`
            : `See events on calendar →`
          }
        </Link>
      </div>
    </div>
  );
}
