"use client";

import { Calendar, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { getEvents, getAllNetworkSchoolEvents } from "@/lib/actions/events";
import type { UIEvent } from "@/lib/types/events";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { NSEventsGraph } from "@/components/ns-events-graph";
import { LiveEventCounter } from "@/components/live-event-counter";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

export default function NetworkSchoolEventsPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [allEvents, setAllEvents] = useState<UIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const moreStatsRef = useRef<HTMLDivElement>(null);
  const statsBoxRef = useRef<HTMLDivElement>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);
  const clientAllEvents = useClientTimezone(allEvents);

  // Fetch events on component mount
  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedEvents, allNSEvents] = await Promise.all([
          getEvents(),
          getAllNetworkSchoolEvents()
        ]);

        if (isMounted) {
          setEvents(fetchedEvents);
          setAllEvents(allNSEvents);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load events:", err);
          setError("Failed to load events. Please try refreshing the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate stats from all events (historic + future) - use client-side timezone
  const stats = useMemo(() => {
    // Filter for both Network School and Ârc events
    const nsAndArcEvents = clientEvents.filter(event => 
      event.networkState === "Network School" || event.networkState === "Ârc"
    );

    // Stats from all time data (Network School and Ârc)
    const allNSAndArcEvents = clientAllEvents.filter(event => 
      event.networkState === "Network School" || event.networkState === "Ârc"
    );
    const totalAllTime = allNSAndArcEvents.length;
    const allCountries = new Set(allNSAndArcEvents.map(e => e.country).filter(Boolean));
    const allCities = new Set(allNSAndArcEvents.map(e => e.location).filter(c => c !== 'Virtual' && c !== 'TBD'));

    // Split past and upcoming
    const today = new Date();
    const pastEvents = allNSAndArcEvents.filter(e => new Date(e.date) < today);
    const upcomingEvents = nsAndArcEvents
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Next upcoming event
    const nextEvent = upcomingEvents[0];

    // Find most popular event type from Network School and Ârc events
    const typeCounts = allNSAndArcEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostPopularType = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Event';

    // Find most active city from Network School and Ârc events
    const cityCounts = allNSAndArcEvents
      .filter(e => e.location !== 'Virtual' && e.location !== 'TBD')
      .reduce((acc, event) => {
        acc[event.location] = (acc[event.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    const mostActiveCity = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    return {
      totalAllTime,
      totalPast: pastEvents.length,
      totalUpcoming: upcomingEvents.length,
      countries: allCountries.size,
      cities: allCities.size,
      mostPopularType,
      mostActiveCity,
      nextEvent: nextEvent ? new Date(nextEvent.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : null
    };
  }, [clientEvents, clientAllEvents]);

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!showMoreStats) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both the stats box and the dropdown
      const isOutsideStatsBox = statsBoxRef.current && !statsBoxRef.current.contains(target);
      const isOutsideDropdown = moreStatsRef.current && !moreStatsRef.current.contains(target);
      
      if (isOutsideStatsBox && isOutsideDropdown) {
        setShowMoreStats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreStats]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Left side - Content */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ NETWORK SCHOOL EVENTS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl">
            Discover upcoming events from Network School. Join workshops, 
            talks and gatherings across the Network School ecosystem.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="https://ns.com/wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              [ SUBMIT EVENT ]
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Right side - Stats */}
        {!isLoading && !error && (
          <div className="lg:w-96">
            <div ref={statsBoxRef} className="border-2 border-border bg-card p-6">
              <div className="space-y-2">
                {/* Live Event Counter */}
                <LiveEventCounter allEvents={clientAllEvents.filter(event => 
                  event.networkState === "Network School" || event.networkState === "Ârc"
                )} />

                {/* Upcoming Events */}
                <div className="border-2 border-border p-3 text-center bg-background">
                  <div className="flex justify-center mb-1">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="text-xl font-bold font-mono mb-0.5">
                    {stats.totalUpcoming}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    UPCOMING EVENTS
                  </div>
                </div>
              </div>

              {/* See More Stats Link */}
              <div className="mt-4">
                <button
                  onClick={() => setShowMoreStats(!showMoreStats)}
                  className="w-full flex items-center justify-between font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>See more stats</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showMoreStats ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* See More Stats Dropdown */}
      {showMoreStats && !isLoading && !error && clientAllEvents.length > 0 && (
        <section ref={moreStatsRef} className="border-2 border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-mono">
              [ EVENTS PER DAY ]
            </h2>
            <button
              onClick={() => setShowMoreStats(false)}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
          <div className="mt-6">
            <NSEventsGraph allEvents={clientAllEvents.filter(event => 
              event.networkState === "Network School" || event.networkState === "Ârc"
            )} />
          </div>
        </section>
      )}

      {/* Events Table with Network School and Ârc pre-selected */}
      <UpcomingEventsSection
        events={clientEvents}
        isLoading={isLoading}
        error={error}
        initialNetworkStates={["Network School", "Ârc"]}
      />

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ HOST A NETWORK SCHOOL EVENT ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Organizing an event for Network School? Find more information about how to list it here.
        </p>
        <div className="flex justify-center pt-4">
          <a
            href="https://ns.com/wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ SUBMIT EVENT ]
          </a>
        </div>
      </section>
    </div>
  );
}

