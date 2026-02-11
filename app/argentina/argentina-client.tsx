"use client";

import { Calendar, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { getEvents, getAllEvents, getPopupCities } from "@/lib/actions/events";
import type { UIEvent, PopupCity } from "@/lib/types/events";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { NSEventsGraph } from "@/components/ns-events-graph";
import { LiveEventCounter } from "@/components/live-event-counter";
import { PopupSection } from "@/components/popup-section";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

// Argentina network states filter
const ARGENTINA_NETWORK_STATES = ["Aleph Crecimiento", "Crecimiento", "Edge City"];

export default function ArgentinaPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [allEvents, setAllEvents] = useState<UIEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPopups, setIsLoadingPopups] = useState(true);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const moreStatsRef = useRef<HTMLDivElement>(null);
  const statsBoxRef = useRef<HTMLDivElement>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);
  const clientAllEvents = useClientTimezone(allEvents);

  // Filter events for Argentina network states
  const argentinaClientEvents = useMemo(() => 
    clientEvents.filter(event => ARGENTINA_NETWORK_STATES.includes(event.networkState)),
    [clientEvents]
  );

  const argentinaClientAllEvents = useMemo(() => 
    clientAllEvents.filter(event => ARGENTINA_NETWORK_STATES.includes(event.networkState)),
    [clientAllEvents]
  );

  // Fetch events on component mount
  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedEvents, allNSEvents] = await Promise.all([
          getEvents(),
          getAllEvents()
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

    async function loadPopupCities() {
      try {
        setIsLoadingPopups(true);
        setPopupError(null);
        // Filter popup events for Argentina page
        const fetchedPopups = await getPopupCities('argentina');

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

  // Create merged events for the graph (including popup events)
  // Convert each day of a popup event into a synthetic UIEvent for the graph
  const eventsForGraph = useMemo(() => {
    const syntheticEvents: UIEvent[] = [];

    // Add all regular Argentina events
    const regularEvents = [...argentinaClientAllEvents];

    // Convert popup events to synthetic daily events
    popupEvents.forEach(popup => {
      const startDate = new Date(popup.date);
      const endDate = new Date(popup.endDate);

      // Create a synthetic event for each day of the popup
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];

        // Create a synthetic UIEvent for this day
        syntheticEvents.push({
          date: dateStr,
          time: '12:00 PM – 11:59 PM', // Placeholder time
          title: popup.title,
          location: popup.location,
          country: popup.location.split(',')[1]?.trim() || 'Argentina',
          networkState: popup.networkState,
          type: 'Pop-Up',
          url: popup.url,
          status: 'scheduled',
          tags: null,
          start_at: `${dateStr}T12:00:00Z`,
          end_at: `${dateStr}T23:59:59Z`,
          lat: null,
          lng: null
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Merge regular and synthetic events
    return [...regularEvents, ...syntheticEvents];
  }, [argentinaClientAllEvents, popupEvents]);

  // Calculate stats from all events (historic + future) - use client-side timezone
  // Include popup events in the calculation
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate metrics for regular events
    const regularEventsCount = argentinaClientAllEvents.length;
    const allCountries = new Set(argentinaClientAllEvents.map(e => e.country).filter(Boolean));
    const allCities = new Set(argentinaClientAllEvents.map(e => e.location).filter(c => c !== 'Virtual' && c !== 'TBD'));

    // Split past and upcoming regular events
    const pastRegularEvents = argentinaClientAllEvents.filter(e => new Date(e.date) < today);
    const upcomingRegularEvents = argentinaClientEvents
      .filter(e => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Process popup events
    // A popup is "past" if its end date has passed
    const pastPopupEvents = popupEvents.filter(e => new Date(e.endDate) < today);
    // A popup is "ongoing" if it has started but not ended
    const ongoingPopupEvents = popupEvents.filter(e => {
      const startDate = new Date(e.date);
      const endDate = new Date(e.endDate);
      return startDate <= today && endDate >= today;
    });
    // A popup is "upcoming" if it hasn't started yet
    const futurePopupEvents = popupEvents.filter(e => new Date(e.date) > today);
    // Combine ongoing and future for total upcoming count
    const upcomingPopupEvents = [...ongoingPopupEvents, ...futurePopupEvents];

    // Add popup event locations to cities set
    popupEvents.forEach(event => {
      const loc = event.location.split(',')[0].trim(); // Extract city from "City, Country"
      if (loc && loc !== 'Virtual' && loc !== 'TBD') {
        allCities.add(loc);
      }
      // Extract country from popup event location
      const countryMatch = event.location.match(/,\s*(.+)$/);
      if (countryMatch && countryMatch[1]) {
        allCountries.add(countryMatch[1].trim());
      }
    });

    // Calculate totals (regular + popup events)
    const totalAllTime = regularEventsCount + popupEvents.length;
    const totalPast = pastRegularEvents.length + pastPopupEvents.length;
    const totalUpcoming = upcomingRegularEvents.length + upcomingPopupEvents.length;

    // Next upcoming event (could be either regular or popup)
    const allUpcoming = [
      ...upcomingRegularEvents.map(e => ({ date: new Date(e.date), title: e.title, isPopup: false })),
      ...upcomingPopupEvents.map(e => ({ date: new Date(e.date), title: e.title, isPopup: true }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    const nextEvent = allUpcoming[0];

    // Find most popular event type from Argentina network states
    const typeCounts = argentinaClientAllEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostPopularType = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Event';

    // Find most active city from Argentina network states (including popup events)
    const cityCounts = argentinaClientAllEvents
      .filter(e => e.location !== 'Virtual' && e.location !== 'TBD')
      .reduce((acc, event) => {
        acc[event.location] = (acc[event.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Add popup event cities to counts
    popupEvents.forEach(event => {
      const loc = event.location.split(',')[0].trim();
      if (loc && loc !== 'Virtual' && loc !== 'TBD') {
        cityCounts[loc] = (cityCounts[loc] || 0) + 1;
      }
    });

    const mostActiveCity = Object.entries(cityCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    return {
      totalAllTime,
      totalPast,
      totalUpcoming,
      countries: allCountries.size,
      cities: allCities.size,
      mostPopularType,
      mostActiveCity,
      nextEvent: nextEvent ? nextEvent.date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : null
    };
  }, [argentinaClientEvents, argentinaClientAllEvents, popupEvents]);

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
            [ EDGE & DEVCONNECT RELATED EVENTS IN ARGENTINA ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl">
            Discover upcoming events in Argentina. Join workshops, 
            talks and gatherings across the ecosystem.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Event Listing Request - Argentina&body=Hi, I'd like to list an event in Argentina. Please include: Event name, Date, Time, Location, Description, and Registration link."
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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
                {/* Live Event Counter - only show Argentina filtered events */}
          <LiveEventCounter allEvents={argentinaClientEvents} hideNoEvents={true} />

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
        <section ref={moreStatsRef} className="border-2 border-border bg-card p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold font-mono">
              [ EVENTS PER DAY ]
            </h2>
            <button
              onClick={() => setShowMoreStats(false)}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
          <div className="mt-4 sm:mt-6">
            <NSEventsGraph allEvents={eventsForGraph} />
          </div>
        </section>
      )}

      {/* Pop-Up Timeline */}
      <PopupSection
        popupEvents={popupEvents}
        isLoading={isLoadingPopups}
        error={popupError}
        title="[ POP-UP'S & RESIDENCIES  ]"
        startFromEarliestEvent={true}
        showAllByDefault={true}
        defaultViewMode="gantt"
        hideTryThisPrompt={true}
      />

      {/* Events Table with Aleph Crecimiento, Crecimiento, and Edge City pre-selected */}
      <UpcomingEventsSection
        events={clientEvents}
        isLoading={isLoading}
        error={error}
        initialNetworkStates={["Aleph Crecimiento", "Crecimiento", "Edge City"]}
        customNetworkStateOrder={["Aleph Crecimiento", "Crecimiento", "Edge City"]}
        defaultViewMode="gantt"
      />

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ HOST AN ARGENTINA EVENT ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Organizing an event for Argentina? Find more information about how to list it here.
        </p>
        <div className="flex justify-center pt-4">
          <a
            href="mailto:nsnodes@gmail.com?subject=Event Listing Request - Argentina&body=Hi, I'd like to list an event in Argentina. Please include: Event name, Date, Time, Location, Description, and Registration link."
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ SUBMIT EVENT ]
          </a>
        </div>
      </section>
    </div>
  );
}

