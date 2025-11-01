"use client";

import { Calendar, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { getEvents } from "@/lib/actions/events";
import type { UIEvent } from "@/lib/types/events";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

export default function EdgePatagoniaEventsPage() {
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);

  // Fetch events on component mount
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

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ EDGE PATAGONIA EVENTS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl mx-auto">
            Discover upcoming events from Edge Patagonia. Join conferences, workshops, 
            meetups and gatherings in El Chaltén and across the Edge Patagonia ecosystem.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Event Listing Request&body=Hi, I'd like to list an Edge Patagonia event on NSNodes. Please include: Event name, Date, Time, Location, Description, and Registration link."
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

      {/* Events Table with edgepatagonia pre-selected */}
      <UpcomingEventsSection
        events={clientEvents}
        isLoading={isLoading}
        error={error}
        initialNetworkState="edgepatagonia"
      />

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ HOST AN EDGE PATAGONIA EVENT ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Organizing an event for Edge Patagonia? List it here and reach builders,
          founders, and innovators across the ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="mailto:nsnodes@gmail.com?subject=Event Listing Request&body=Hi, I'd like to list an Edge Patagonia event on NSNodes."
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ SUBMIT EVENT ]
          </a>
        </div>
      </section>
    </div>
  );
}

