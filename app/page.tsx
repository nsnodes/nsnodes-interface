"use client";

import { Calendar, TrendingUp, Users, ExternalLink } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { getEvents, getPopupCities } from "@/lib/actions/events";
import type { UIEvent, PopupCity } from "@/lib/types/events";
import { PopupSection } from "@/components/popup-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";

const networkStates = [
  {
    name: "Network School",
    location: "Forest City, Malaysia",                    // Location on xyz.city:contentReference[oaicite:2]{index=2}
    residents: "100-500",                                 // Residents range:contentReference[oaicite:3]{index=3}
    growth: "+23%",
    website: "https://ns.com/?utm_source=nsnodes.com",    // Added tracking parameter
    x: "https://x.com/balajis",
  },
  {
    name: "Próspera",
    location: "Roatán, Honduras",                         // Location on xyz.city:contentReference[oaicite:4]{index=4}
    residents: "500-2500",                                // Residents range:contentReference[oaicite:5]{index=5}
    growth: "+18%",
    website: "https://www.prospera.co/?utm_source=nsnodes.com",
    x: "https://x.com/prosperaglobal",
    discord: "https://discord.com/invite/FKSGnQWxXp",
  },
  {
    name: "ZuCity Japan",
    location: "Nagano, Japan",                            // Location on xyz.city:contentReference[oaicite:6]{index=6}
    residents: "100-500",                                 // Residents range:contentReference[oaicite:7]{index=7}
    growth: "+15%",
    website: "https://zucity.org/?utm_source=nsnodes.com",
    x: "https://x.com/zucity_japan",
    discord: "https://discord.com/invite/vqkUaSpDhf",
  },
  {
    name: "Edge City",
    location: "San Martín de los Andes, Argentina",       // Location on xyz.city:contentReference[oaicite:8]{index=8}
    residents: "100-500",                                 // Residents range:contentReference[oaicite:9]{index=9}
    growth: "+31%",
    website: "https://www.edgecity.live/?utm_source=nsnodes.com",
    x: "https://x.com/joinedgecity",
    // No Discord link provided on xyz.city.
  },
  {
    name: "ShanhaiWoo",
    location: "Innovis, Singapore",                       // Location on xyz.city:contentReference[oaicite:10]{index=10}
    residents: "100-500",                                 // Residents range:contentReference[oaicite:11]{index=11}
    growth: "+27%",
    website: "https://www.shanhaiwoo.com/?utm_source=nsnodes.com",
    x: "https://x.com/shanhaiwoo",
    // Only a Telegram link is available; no Discord.
  },

];

export default function Home() {
  // Database state
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPopups, setIsLoadingPopups] = useState(true);
  const [popupError, setPopupError] = useState<string | null>(null);

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);

  // Fetch events and popup cities from database on mount
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

  return (
    <div className="space-y-12">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4 text-left">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80"></pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ nsnodes.com ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base">
            Your central hub for Network State events, opportunities, and community updates.
          </p>
        </div>
        <div className="w-full flex justify-start md:justify-end">
          <Image
            src="/dontdare.png"
            alt="Don't dare to raise me up in a nation state"
            width={420}
            height={280}
            priority
            className="h-auto max-w-full border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          />
        </div>
      </section>

      {/* Top Network States */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          [ TOP NETWORK STATES ]
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {networkStates.map((ns, index) => (
            <a
              key={ns.name}
              href={ns.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${ns.name} website`}
              className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all block"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs opacity-60">#{index + 1}</span>
                  <span className="text-xs font-mono text-green-500">{ns.growth}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono font-bold text-sm sm:text-base">{ns.name}</h3>
                    <ExternalLink className="h-3 w-3 opacity-60 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">{ns.location}</p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-mono">{ns.residents} residents</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-start">
          <a
            href="https://www.xyz.city/?utm_source=nsnodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs underline underline-offset-4"
          >
            View full list -&gt;
          </a>
        </div>
      </section>


      {/* Pop-Up Timeline */}
      <PopupSection popupEvents={popupEvents} showOnlyOngoing={true} />

      {/* Events Table */}
      <UpcomingEventsSection events={clientEvents} isLoading={isLoading} error={error} showOnlyToday={true} hideFilters={true} />

    </div>
  );
}
