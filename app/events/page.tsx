"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getEvents, getPopupCities } from "@/lib/actions/events";
import type { UIEvent, PopupCity } from "@/lib/types/events";
import { PopupSection } from "@/components/popup-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

export default function EventsPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [networkStateParam, setNetworkStateParam] = useState<string | null>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);

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
        const fetchedEvents = await getEvents();

        if (isMounted) {
          setEvents(fetchedEvents);
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
        const fetchedPopups = await getPopupCities();

        if (isMounted) {
          setPopupEvents(fetchedPopups);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load popup cities:", err);
        }
      }
    }

    loadEvents();
    loadPopupCities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate stats (use clientEvents for correct timezone)
  const uniqueNetworkStates = Array.from(new Set(clientEvents.map(e => e.networkState).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(clientEvents.map(e => e.country).filter(c => c && c !== 'Unknown')));

  const stats = {
    totalEvents: clientEvents.length,
    uniqueNetworkStates: uniqueNetworkStates.length,
    uniqueLocations: uniqueLocations.length,
    thisWeek: clientEvents.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return eventDate >= today && eventDate <= weekFromNow;
    }).length,
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ NETWORK STATE EVENTS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl mx-auto">
            Discover upcoming events across the Network State ecosystem. From conferences and workshops
            to meetups and social gatherings, find where the community is gathering next.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Event Listing Request&body=Hi, I'd like to list an event on NSNodes. Please include: Event name, Date, Time, Location, Description, and Registration link."
              className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <span className="flex items-center gap-2">
                [ SUBMIT EVENT ]
                <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{stats.totalEvents}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Total Events</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{stats.thisWeek}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">This Week</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{stats.uniqueNetworkStates}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Network States</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{stats.uniqueLocations}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Locations</div>
        </div>
      </section>

      {/* Pop-Up Timeline */}
      <PopupSection popupEvents={popupEvents} />

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
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ SUBMIT EVENT ]
          </a>
        </div>
      </section>
    </div>
  );
}
