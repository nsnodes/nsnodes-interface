"use client";

import { Calendar, ExternalLink, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { getEvents, getPopupCities, getAllEvents } from "@/lib/actions/events";
import type { UIEvent, PopupCity } from "@/lib/types/events";
import { PopupSection } from "@/components/popup-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { LiveEventCounter } from "@/components/live-event-counter";
import { NSEventsGraph } from "@/components/ns-events-graph";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

export default function EventsPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [allEvents, setAllEvents] = useState<UIEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPopups, setIsLoadingPopups] = useState(true);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [networkStateParam, setNetworkStateParam] = useState<string | null>(null);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const moreStatsRef = useRef<HTMLDivElement>(null);
  const statsBoxRef = useRef<HTMLDivElement>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);
  const clientAllEvents = useClientTimezone(allEvents);

  // Read URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const networkState = params.get('networkState');
      console.log('URL params:', window.location.search);
      console.log('Network state from URL:', networkState);
      setNetworkStateParam(networkState);
    }
  }, []);

  // Fetch events and popup cities on component mount
  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedEvents, allEventsData] = await Promise.all([
          getEvents(),
          getAllEvents()
        ]);

        if (isMounted) {
          setEvents(fetchedEvents);
          setAllEvents(allEventsData);
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

    async function loadPopupCities() {
      try {
        setIsLoadingPopups(true);
        setPopupError(null);
        const fetchedPopups = await getPopupCities();

        if (isMounted) {
          setPopupEvents(fetchedPopups);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load popup cities:", err);
          setPopupError("Failed to load pop-up events. Please try refreshing the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingPopups(false);
        }
      }
    }

    loadEvents();
    loadPopupCities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate stats from all events (historic + future) - use client-side timezone
  const stats = useMemo(() => {
    // Stats from upcoming events only
    const today = new Date();
    const upcomingEvents = clientEvents
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalUpcoming: upcomingEvents.length,
    };
  }, [clientEvents]);

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
            [ NETWORK STATE EVENTS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl">
            Discover upcoming events across the Network State ecosystem. From conferences and workshops
            to meetups and social gatherings, find where the community is gathering next.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Event Listing Request&body=Hi, I'd like to list an event on NSNodes. Please include: Event name, Date, Time, Location, Description, and Registration link."
              className="block w-full sm:inline-block sm:w-auto text-center border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <span className="flex items-center justify-center gap-2">
                [ SUBMIT EVENT ]
                <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>

        {/* Right side - Stats */}
        {!isLoading && !error && (
          <div className="lg:w-80">
            <div ref={statsBoxRef} className="border-2 border-border bg-card p-6">
              <div className="space-y-2">
                {/* Live Event Counter */}
                <LiveEventCounter allEvents={clientAllEvents} />

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
                  type="button"
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
        <section ref={moreStatsRef} className="border-2 border-border bg-card p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold font-mono">
              [ EVENTS PER DAY ]
            </h2>
            <button
              type="button"
              onClick={() => setShowMoreStats(false)}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
          <div className="mt-4 sm:mt-6">
            <NSEventsGraph allEvents={clientAllEvents} />
          </div>
        </section>
      )}

      {/* Pop-Up Timeline */}
      <PopupSection 
        popupEvents={popupEvents} 
        isLoading={isLoadingPopups}
        error={popupError}
      />

      {/* Events Table */}
      <UpcomingEventsSection
        events={clientEvents}
        isLoading={isLoading}
        error={error}
        initialNetworkState={networkStateParam || undefined}
      />

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ HOST AN EVENT ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Organizing an event for the Network State community? List it here and reach builders,
          founders, and innovators across the ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="mailto:nsnodes@gmail.com?subject=Event Listing Request&body=Hi, I'd like to list an event on NSNodes."
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ SUBMIT EVENT ]
          </a>
        </div>
      </section>
    </div>
  );
}
