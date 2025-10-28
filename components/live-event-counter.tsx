"use client";

import { useState, useEffect } from "react";
import { Radio } from "lucide-react";
import type { UIEvent } from "@/lib/types/events";

interface LiveEventCounterProps {
  allEvents: UIEvent[];
}

export function LiveEventCounter({ allEvents }: LiveEventCounterProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveCount, setLiveCount] = useState(0);
  const [nextEvent, setNextEvent] = useState<UIEvent | null>(null);
  const [countdown, setCountdown] = useState("");

  // Helper function to check if an event is currently live
  const isEventLive = (event: UIEvent): boolean => {
    try {
      const now = currentTime;
      const today = now.toISOString().split("T")[0];

      if (event.date !== today) {
        return false;
      }

      const timeStr = event.time;
      const parts = timeStr.split(" – ");
      if (parts.length !== 2) return false;

      const [startTime, endTime] = parts.map((t) => t.trim());

      const parseTime = (timeStr: string): Date => {
        const timeParts = timeStr.split(" ");
        if (timeParts.length !== 2) throw new Error("Invalid time format");

        const [time, period] = timeParts;
        const [hours, minutes] = time.split(":").map(Number);
        let hour24 = hours;

        if (period === "PM" && hours !== 12) hour24 += 12;
        if (period === "AM" && hours === 12) hour24 = 0;

        const date = new Date();
        date.setHours(hour24, minutes, 0, 0);
        return date;
      };

      const startDate = parseTime(startTime);
      let endDate = parseTime(endTime);

      // If end time is before start time, event spans to next day
      if (endDate <= startDate) {
        endDate = new Date(endDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      return now >= startDate && now <= endDate;
    } catch (error) {
      return false;
    }
  };

  // Helper function to get event start date/time
  const getEventStartDateTime = (event: UIEvent): Date | null => {
    try {
      const timeStr = event.time;
      const parts = timeStr.split(" – ");
      if (parts.length !== 2) return null;

      const startTime = parts[0].trim();
      const timeParts = startTime.split(" ");
      if (timeParts.length !== 2) return null;

      const [time, period] = timeParts;
      const [hours, minutes] = time.split(":").map(Number);
      let hour24 = hours;

      if (period === "PM" && hours !== 12) hour24 += 12;
      if (period === "AM" && hours === 12) hour24 = 0;

      // Parse the event date
      const [year, month, day] = event.date.split("-").map(Number);
      const eventDateTime = new Date(year, month - 1, day, hour24, minutes, 0, 0);

      return eventDateTime;
    } catch (error) {
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
  }, [allEvents]);

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
          ) : (
            <>
              <div className="text-base font-bold font-mono mb-0.5">
                NO EVENTS
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                SCHEDULED
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
