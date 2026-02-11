"use client";

import { Calendar, TrendingUp, ExternalLink, MapPin, Briefcase, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getEvents, getPopupCities } from "@/lib/actions/events";
import { getSocieties } from "@/lib/actions/societies";
import type { UIEvent, PopupCity } from "@/lib/types/events";
import type { SocietyDatabase } from "@/lib/data/societies-database";
import { PopupSection } from "@/components/popup-section";
import { UpcomingEventsSection } from "@/components/upcoming-events-section";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";
import { societyNamesMatch } from "@/lib/utils/society-matcher";
import { jobsDatabase, type Job } from "@/lib/data/jobs-database";
import { vcDatabase, type VCFirm } from "@/lib/data/vc-database";

// Helper functions for event status detection
const isEventLive = (event: UIEvent): boolean => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (event.date !== today) return false;

    const timeMatch = event.time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeMatch) return false;

    let startHours = parseInt(timeMatch[1]);
    const startMinutes = parseInt(timeMatch[2]);
    const startPeriod = timeMatch[3].toUpperCase();

    let endHours = parseInt(timeMatch[4]);
    const endMinutes = parseInt(timeMatch[5]);
    const endPeriod = timeMatch[6].toUpperCase();

    if (startPeriod === "PM" && startHours !== 12) startHours += 12;
    else if (startPeriod === "AM" && startHours === 12) startHours = 0;

    if (endPeriod === "PM" && endHours !== 12) endHours += 12;
    else if (endPeriod === "AM" && endHours === 12) endHours = 0;

    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHours, startMinutes, 0);
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHours, endMinutes, 0);

    if (endDate < startDate) {
      endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
    }

    return now >= startDate && now <= endDate;
  } catch {
    return false;
  }
};

const isEventToday = (event: UIEvent): boolean => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    return event.date === today;
  } catch {
    return false;
  }
};

const hasLiveEvents = (events: UIEvent[]): boolean => {
  return events.some(event => isEventLive(event));
};

const hasTodayEvents = (events: UIEvent[]): boolean => {
  return events.some(event => isEventToday(event));
};

// Count event types for badge display
const countLiveEvents = (events: UIEvent[]): number => {
  return events.filter(event => isEventLive(event)).length;
};

const countTodayEvents = (events: UIEvent[]): number => {
  return events.filter(event => isEventToday(event)).length;
};


export default function Home() {
  // Database state
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [societies, setSocieties] = useState<SocietyDatabase[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPopups, setIsLoadingPopups] = useState(true);
  const [popupError, setPopupError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Apply client-side timezone conversion
  const clientEvents = useClientTimezone(events);

  // Update current time every second for real-time badge updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch events, societies, and popup cities from database on mount
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

    async function loadSocieties() {
      try {
        const fetchedSocieties = await getSocieties();
        if (isMounted) {
          setSocieties(fetchedSocieties);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load societies:", err);
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
    loadSocieties();
    loadPopupCities();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to get events for a society (use clientEvents for timezone conversion)
  const getEventsForSociety = (societyName: string): UIEvent[] => {
    return clientEvents.filter(event =>
      societyNamesMatch(event.networkState, societyName)
    );
  };

  // Helper function to get upcoming event count for a society
  const getUpcomingEventsCount = (societyName: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return clientEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && societyNamesMatch(event.networkState, societyName);
    }).length;
  };

  // Get top 5 societies by upcoming event count (dependent on currentTime for real-time updates)
  const topSocieties = [...societies]
    .map(society => ({
      ...society,
      eventCount: getUpcomingEventsCount(society.name),
      events: getEventsForSociety(society.name),
    }))
    .sort((a, b) => b.eventCount - a.eventCount)
    .slice(0, 5);

  // Get one job per employer
  const jobsByEmployer = jobsDatabase.reduce((acc: { [key: string]: Job }, job) => {
    if (!acc[job.company]) {
      acc[job.company] = job;
    }
    return acc;
  }, {});
  const featuredJobs = Object.values(jobsByEmployer);

  // Get featured VCs (first 6)
  const featuredVCs = vcDatabase.slice(0, 6);

  return (
    <div className="space-y-12">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4 text-left">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80"></pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono uppercase">
            [ Making Network States Default ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base">
          We aggregate, analyze and accelerate the movement of building new countries.
          <br />
          <br />
          The nation state is a 400-year-old technology. Network States are the upgrade. Built by founders, not conquerors. Joined by choice, not birth. Governed by code and consensus, not coercion. This is where the builders gather.           </p>
        </div>
        <div className="w-full flex justify-start md:justify-end">
          <Image
            src="/dontdare.png"
            alt="Don't dare to raise me up in a nation state"
            width={420}
            height={280}
            priority
            unoptimized
            className="h-auto max-w-full border-2 border-border shadow-brutal-md"
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
          {topSocieties.map((society, index) => (
            <Link
              key={society.name}
              href="/societies"
              className="border-2 border-border p-4 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all block relative"
            >
              {/* Logo - left on mobile (absolute), right on desktop (in title row) */}
              {society.icon && (
                <div className="absolute top-1/2 -translate-y-1/2 left-2 w-12 h-12 sm:hidden flex items-center justify-center">
                  <Image
                    src={society.icon}
                    alt={`${society.name} logo`}
                    width={48}
                    height={48}
                    unoptimized
                    className="object-contain rounded-full"
                  />
                </div>
              )}
              <div className="space-y-2 pl-16 sm:pl-0">
                {/* Name with rank and logo */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="font-mono text-xs opacity-60">#{index + 1}</span>
                    <h3 className="font-mono font-bold text-xs line-clamp-1">{society.name}</h3>
                  </div>
                  {/* Logo on the right - desktop only */}
                  {society.icon && (
                    <div className="hidden sm:flex w-6 h-6 items-center justify-center flex-shrink-0">
                      <Image
                        src={society.icon}
                        alt={`${society.name} logo`}
                        width={24}
                        height={24}
                        unoptimized
                        className="object-contain rounded-full"
                      />
                    </div>
                  )}
                </div>
                {/* Location */}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <p className="text-xs font-mono">{society.location || 'Global'}</p>
                </div>
                {/* Event count with badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-mono">
                      {society.eventCount} {society.eventCount === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                  {/* Event status badge on the right - horizontally aligned with logo */}
                  {hasLiveEvents(society.events) ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-status-live text-status-live-foreground text-[10px] font-bold rounded animate-pulse">
                      <span className="relative flex h-1 w-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live-foreground opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1 w-1 bg-status-live-foreground"></span>
                      </span>
                      {countLiveEvents(society.events)} Live
                    </span>
                  ) : hasTodayEvents(society.events) ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white text-black text-[10px] font-bold rounded border border-border">
                      {countTodayEvents(society.events)} Today
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-start">
          <Link
            href="/societies"
            className="font-mono text-xs underline underline-offset-4"
          >
            View all societies →
          </Link>
        </div>
      </section>

      {/* Pop-Up Timeline */}
      <PopupSection popupEvents={popupEvents} showOnlyOngoing={true} hideShowAllButton={true} />

      {/* Events Table */}
      <UpcomingEventsSection events={clientEvents} isLoading={isLoading} error={error} showOnlyToday={true} hideFilters={true} />

      {/* Network State Jobs */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          [ NETWORK STATE JOBS ]
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredJobs.map((job, index) => (
            <a
              key={index}
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-border p-4 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all block"
            >
              <div className="space-y-3">
                {/* Company name as header */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-mono font-bold text-sm">{job.company}</h3>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </div>
                {/* Job title */}
                <p className="text-xs font-mono font-semibold line-clamp-2">{job.title}</p>
                {/* Location */}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <p className="text-xs font-mono line-clamp-1">{job.location}</p>
                </div>
                {/* Job type and salary */}
                <div className="flex flex-col gap-1 text-xs font-mono text-muted-foreground">
                  <span>{job.type}</span>
                  <span className="text-money-positive font-bold line-clamp-1">{job.salary}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-start">
          <Link
            href="/jobs"
            className="font-mono text-xs underline underline-offset-4"
          >
            See all {jobsDatabase.length} Network State Jobs →
          </Link>
        </div>
      </section>

      {/* Network State VCs */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          [ VC ]
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredVCs.map((vc, index) => (
            <a
              key={index}
              href={vc.platforms.website}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-border p-4 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all block"
            >
              <div className="space-y-3">
                {/* VC name as header */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-mono font-bold text-sm">{vc.name}</h3>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </div>
                {/* Description */}
                <p className="text-xs font-mono text-muted-foreground line-clamp-2">{vc.description}</p>
                {/* Check size */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-money-positive" />
                  <span className="text-xs font-mono font-bold text-money-positive">{vc.checkSize}</span>
                </div>
                {/* Topics */}
                <div className="flex flex-wrap gap-1">
                  {vc.topics.slice(0, 3).map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="px-2 py-0.5 text-[10px] font-mono border border-border bg-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="flex justify-start">
          <Link
            href="/vc"
            className="font-mono text-xs underline underline-offset-4"
          >
            See all {vcDatabase.length} VCs →
          </Link>
        </div>
      </section>

    </div>
  );
}
