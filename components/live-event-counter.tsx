"use client";

import { useState, useEffect } from "react";
import { Radio } from "lucide-react";
import type { UIEvent } from "@/lib/types/events";

interface LiveEventCounterProps {
  allEvents: UIEvent[];
  hideNoEvents?: boolean; // Optional: hide "NO EVENTS SCHEDULED" message
}

export function LiveEventCounter({ allEvents, hideNoEvents = false }: LiveEventCounterProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveCount, setLiveCount] = useState(0);
  const [nextEvent, setNextEvent] = useState<UIEvent | null>(null);
  const [countdown, setCountdown] = useState("");

  // Helper function to check if an event is currently live
  const isEventLive = (event: UIEvent): boolean => {
    try {
      const now = currentTime;

      // Use the ISO timestamps for accurate comparison
      // This works for multi-day events and events in any timezone
      const startTime = new Date(event.start_at);
      const endTime = new Date(event.end_at);

      return now >= startTime && now < endTime;
    } catch {
      return false;
    }
  };

  // Helper function to get event start date/time
  const getEventStartDateTime = (event: UIEvent): Date | null => {
    try {
      // Use the ISO timestamp for accurate start time
      return new Date(event.start_at);
    } catch {
      return null;
    }
  };

  // Format countdown time
  const formatCountdown = (ms: number): string => {
    if (ms <= 0) return "NOW";

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Update live events and countdown every second
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      setCurrentTime(now);

      // Count live events
      const liveEvents = allEvents.filter(isEventLive);

      // Debug: log live events
      if (liveEvents.length > 0) {
        console.log('🔴 Live events:', liveEvents.length);
        liveEvents.forEach(e => {
          const start = new Date(e.start_at);
          const end = new Date(e.end_at);
          console.log(`  - ${e.title}`);
          console.log(`    Start: ${e.start_at} (${start.toLocaleString()})`);
          console.log(`    End: ${e.end_at} (${end.toLocaleString()})`);
          console.log(`    Now: ${now.toISOString()} (${now.toLocaleString()})`);
          console.log(`    Live check: now >= start (${now >= start}) && now < end (${now < end})`);
        });
      }

      setLiveCount(liveEvents.length);

      // Find next upcoming event
      if (liveEvents.length === 0) {
        // Get all future events
        const futureEvents = allEvents
          .map((event) => ({
            event,
            startTime: getEventStartDateTime(event),
          }))
          .filter((item) => item.startTime && item.startTime > now)
          .sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime());

        if (futureEvents.length > 0) {
          const next = futureEvents[0];
          setNextEvent(next.event);
          const timeUntil = next.startTime!.getTime() - now.getTime();
          setCountdown(formatCountdown(timeUntil));
        } else {
          setNextEvent(null);
          setCountdown("");
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents]);

  // If hideNoEvents is true and there are no live events and no next event, don't render anything
  if (hideNoEvents && liveCount === 0 && !nextEvent) {
    return null;
  }

  return (
    <div className="border-2 border-border p-3 text-center bg-background relative overflow-hidden">
      {liveCount > 0 ? (
        <>
          {/* Live Now */}
          <div className="flex justify-center mb-1">
            <div className="relative">
              <Radio className="h-4 w-4 text-red-500" />
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </div>
          </div>
          <div className="text-xl font-bold font-mono mb-0.5 text-red-500 animate-pulse">
            {liveCount}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            {liveCount === 1 ? 'EVENT LIVE NOW' : 'EVENTS LIVE NOW'}
          </div>
        </>
      ) : (
        <>
          {/* Countdown to Next Event */}
          <div className="flex justify-center mb-1">
            <Radio className="h-4 w-4 text-muted-foreground" />
          </div>
          {nextEvent ? (
            <>
              <div className="text-lg font-bold font-mono mb-0.5">
                {countdown}
              </div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                UNTIL NEXT EVENT
              </div>
              <div className="text-xs font-mono font-bold truncate">
                {nextEvent.title}
              </div>
            </>
          ) : !hideNoEvents ? (
            <>
              <div className="text-base font-bold font-mono mb-0.5">
                NO EVENTS
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                SCHEDULED
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
