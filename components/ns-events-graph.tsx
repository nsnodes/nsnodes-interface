"use client";

import { useMemo } from "react";
import { UIEvent } from "@/lib/types/events";

interface NSEventsGraphProps {
  allEvents: UIEvent[];
}

export function NSEventsGraph({ allEvents }: NSEventsGraphProps) {
  // Process events to count by day, filtering from Oct 22 to today
  const dailyData = useMemo(() => {
    const startDate = new Date('2025-10-22');
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Include all of today

    const counts = new Map<string, number>();

    // Filter events within date range and count by day
    allEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate >= startDate && eventDate <= today) {
        counts.set(event.date, (counts.get(event.date) || 0) + 1);
      }
    });

    // Create array with all dates in range (including days with 0 events)
    const allDates: Array<{ date: string; count: number }> = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0];
      allDates.push({
        date: dateStr,
        count: counts.get(dateStr) || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allDates;
  }, [allEvents]);

  // Get max count for scaling
  const maxCount = Math.max(...dailyData.map(d => d.count), 1);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get day name (Mon, Tue, etc.)
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (dailyData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground font-mono text-sm">
        No event data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-border bg-background p-6">
        {/* Vertical bar chart */}
        <div className="flex items-end justify-between gap-1" style={{ height: '350px' }}>
          {dailyData.map(({ date, count }) => {
            const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const barHeight = count > 0 ? `${heightPercent}%` : '0%';

            return (
              <div key={date} className="flex flex-col items-center justify-end flex-1" style={{ height: '100%' }}>
                {/* Bar container with count on top */}
                <div className="w-full flex flex-col items-center justify-end" style={{ height: '270px' }}>
                  {/* Count label on top of bar */}
                  {count > 0 && (
                    <div className="text-xs font-mono font-bold text-center mb-1">
                      {count}
                    </div>
                  )}
                  {/* Bar */}
                  {count > 0 && (
                    <div
                      className="bg-primary transition-all hover:opacity-80 w-full max-w-[40px]"
                      style={{ height: barHeight }}
                      title={`${getDayName(date)}, ${formatDate(date)}: ${count} events`}
                    />
                  )}
                </div>
                {/* Date and day labels */}
                <div className="flex flex-col items-center mt-2 gap-0.5">
                  <div className="text-[10px] font-mono font-bold text-center whitespace-nowrap">
                    {formatDate(date)}
                  </div>
                  <div className="text-[9px] font-mono text-muted-foreground text-center">
                    {getDayName(date)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-border">
          <div className="flex justify-between text-xs font-mono text-muted-foreground">
            <span>Total Days: {dailyData.length}</span>
            <span>Peak Day: {maxCount} events</span>
            <span>Total Events: {dailyData.reduce((sum, d) => sum + d.count, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
