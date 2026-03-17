"use client";

import { Users, MapPin, ChevronDown, ChevronUp, Calendar, Tag } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { SocietyDatabase } from "@/lib/data/societies-database";
import { SocietiesChartStats, SocietiesChartGraph } from "@/components/societies-chart";
import { getEvents } from "@/lib/actions/events";
import type { UIEvent } from "@/lib/types/events";
import { societyNamesMatch } from "@/lib/utils/society-matcher";
import { societyNameToSlug } from "@/lib/utils/slug";
import { jobsDatabase } from "@/lib/data/jobs-database";
import { useClientTimezone } from "@/lib/hooks/useClientTimezone";
import { SocietyLogo } from '@/components/society/society-logo';
import { SocietyBadges } from '@/components/society/society-badges';
import { SocietySocialLinks } from '@/components/society/society-social-links';

// Helper functions for event status badges
const getEventStartDateTime = (event: UIEvent): Date | null => {
  try {
    // Use the ISO timestamp for accurate start time
    return new Date(event.start_at);
  } catch {
    return null;
  }
};

const isEventLive = (event: UIEvent): boolean => {
  try {
    const now = new Date();

    // Use the ISO timestamps for accurate comparison
    // This works for multi-day events and events in any timezone
    const startTime = new Date(event.start_at);
    const endTime = new Date(event.end_at);

    return now >= startTime && now <= endTime;
  } catch {
    return false;
  }
};

const isEventStartingWithinHour = (event: UIEvent): boolean => {
  try {
    const now = new Date();
    const startDateTime = getEventStartDateTime(event);

    if (!startDateTime) return false;

    // Event is in the future and starts within the next hour
    const timeUntilEvent = startDateTime.getTime() - now.getTime();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    return timeUntilEvent > 0 && timeUntilEvent <= oneHour;
  } catch {
    return false;
  }
};

const isEventToday = (event: UIEvent): boolean => {
  try {
    const now = new Date();

    // Get start and end of today in local timezone
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const startTime = new Date(event.start_at);
    const endTime = new Date(event.end_at);

    // Event is "today" if it overlaps with today at all
    // (either starts today, ends today, or spans across today)
    return (startTime <= todayEnd && endTime >= todayStart);
  } catch {
    return false;
  }
};

const hasLiveEvents = (events: UIEvent[]): boolean => {
  return events.some(event => isEventLive(event));
};

const hasUpcomingEvents = (events: UIEvent[]): boolean => {
  return events.some(event => isEventStartingWithinHour(event));
};

const hasTodayEvents = (events: UIEvent[]): boolean => {
  return events.some(event => isEventToday(event));
};

export default function SocietiesPageClient({ societies }: { societies: SocietyDatabase[] }) {
  const [expandedSociety, setExpandedSociety] = useState<string | null>(null);
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [showGrowthChart, setShowGrowthChart] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Apply client-side timezone conversion to events
  const clientEvents = useClientTimezone(events);

  // Update current time every 60s for live/today badge updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Precompute events per society (avoids O(societies * events) on every render)
  const eventsBySociety = useMemo(() => {
    const map = new Map<string, UIEvent[]>();
    for (const society of societies) {
      map.set(society.name, clientEvents.filter(event =>
        societyNamesMatch(event.networkState, society.name)
      ));
    }
    return map;
  }, [clientEvents, societies]);

  // Precompute upcoming event counts per society for sorting
  const upcomingCountBySociety = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const map = new Map<string, number>();
    for (const [name, events] of eventsBySociety) {
      map.set(name, events.filter(event => new Date(event.date) >= today).length);
    }
    return map;
  }, [eventsBySociety]);

  // Precompute which societies have open positions
  const openPositionsBySociety = useMemo(() => {
    const set = new Set<string>();
    for (const society of societies) {
      if (jobsDatabase.some(job => societyNamesMatch(job.company, society.name))) {
        set.add(society.name);
      }
    }
    return set;
  }, [societies]);

  const toggleSociety = (societyName: string) => {
    setExpandedSociety(expandedSociety === societyName ? null : societyName);
  };

  // Get unique locations and types for filters
  const uniqueLocations = useMemo(() =>
    Array.from(new Set(societies.map(s => s.location).filter((l): l is string => !!l))).sort(),
    [societies]
  );
  const uniqueTypes = useMemo(() =>
    Array.from(new Set(societies.map(s => s.type))).sort(),
    [societies]
  );

  // Toggle filter helpers
  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]
    );
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Filter and sort societies
  const filteredAndSortedSocieties = useMemo(() => [...societies]
    .filter(society => {
      if (searchTerm && !society.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedLocations.length > 0 && (!society.location || !selectedLocations.includes(society.location))) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(society.type)) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const countA = upcomingCountBySociety.get(a.name) ?? 0;
      const countB = upcomingCountBySociety.get(b.name) ?? 0;

      // Primary sort: by event count (descending - most events first)
      if (countB !== countA) {
        return countB - countA;
      }

      // Secondary sort: by tier (ascending - tier 1 first)
      return a.tier - b.tier;
    }),
    [societies, searchTerm, selectedLocations, selectedTypes, upcomingCountBySociety]
  );

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-8">
        <div className="text-center lg:text-left space-y-4 flex-1">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
          </pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ NETWORK STATE SOCIETIES ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-lg">
            Explore the emerging Network States building the decentralized future. From pop-up cities
            to permanent communities.
          </p>
          
          {/* CTA Section */}
          <div className="pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Network Society Listing Request&body=Hi, I'd like to list our Network State society on NSNodes. Please include: Society name, Location, Mission/description, Founding year, Number of residents, Growth rate, Website, X profile, Discord, Focus areas, and Application link."
              className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              [ LIST NETWORK SOCIETY ] →
            </a>
          </div>
        </div>
        
        {/* Societies Growth Chart Stats */}
        <div className="flex-shrink-0 w-full lg:w-96">
          <SocietiesChartStats societies={societies} onToggleChart={setShowGrowthChart} showChart={showGrowthChart} />
        </div>
      </section>

      {/* Growth Chart Dropdown */}
      {showGrowthChart && (
        <section className="border-2 border-border bg-card p-6">
          <SocietiesChartGraph societies={societies} onClose={() => setShowGrowthChart(false)} />
        </section>
      )}

      {/* Network States List */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Users className="h-6 w-6" />
            [ ALL SOCIETIES ]
          </h2>
          <div className="text-xs font-mono opacity-60">
            Showing {filteredAndSortedSocieties.length} of {societies.length} societies
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="border-2 border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search societies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-background border-2 border-border px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 border-2 border-border bg-muted hover:bg-accent transition-colors font-mono text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Filter */}
            <div className="border-2 border-border bg-card">
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  [ LOCATION ]
                  {selectedLocations.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                      {selectedLocations.length}
                    </span>
                  )}
                </div>
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {filtersOpen && (
                <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
                  {uniqueLocations.map(location => (
                    <label
                      key={location}
                      className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleLocation(location)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{location}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Type Filter */}
            <div className="border-2 border-border bg-card">
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  [ TYPE ]
                  {selectedTypes.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                      {selectedTypes.length}
                    </span>
                  )}
                </div>
                {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {filtersOpen && (
                <div className="px-4 pb-4 space-y-2">
                  {uniqueTypes.map(type => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{type}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedLocations.length > 0 || selectedTypes.length > 0 || searchTerm) && (
            <button
              type="button"
              onClick={() => {
                setSelectedLocations([]);
                setSelectedTypes([]);
                setSearchTerm("");
              }}
              className="font-mono text-xs border-2 border-border px-4 py-2 bg-card hover:bg-accent transition-colors"
            >
              [ CLEAR ALL FILTERS ]
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredAndSortedSocieties.map((society, index) => {
            const societyEvents: UIEvent[] = eventsBySociety.get(society.name) ?? [];
            const isExpanded = expandedSociety === society.name;
            return (
              <div
                key={index}
                className="border-2 border-border p-4 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-3"
              >
                {/* Header: Logo, Name + Description, Badges */}
                {society.tier >= 1 && society.tier <= 3 ? (
                  <>
                  <Link href={`/societies/${societyNameToSlug(society.name)}`} className="block hover:opacity-80 transition-opacity">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <SocietyLogo name={society.name} icon={society.icon} size="md" />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-2">
                          <div className="flex-shrink-0 sm:self-start">
                            <h3 className="text-lg font-bold font-mono leading-snug">
                              {society.name}
                            </h3>
                          </div>
                          <p className="text-sm font-mono text-muted-foreground leading-relaxed flex-1 sm:self-start sm:pt-[0.125rem]">
                            {society.mission}
                          </p>
                        </div>

                        <div className="mt-2">
                          <SocietyBadges
                            location={society.location}
                            category={society.category}
                            type={society.type}
                            founded={society.founded}
                            tier={society.tier}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                  </>
                ) : (
                  <>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <SocietyLogo name={society.name} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-2">
                        <div className="flex-shrink-0 sm:self-start">
                          <h3 className="text-lg font-bold font-mono leading-snug opacity-60">
                            {society.name}
                          </h3>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed flex-1 sm:self-start sm:pt-[0.125rem]">
                          {society.mission}
                        </p>
                      </div>

                      <div className="mt-2">
                        <SocietyBadges
                          location={society.location}
                          category={society.category}
                          type={society.type}
                          tier={society.tier}
                        />
                      </div>
                    </div>
                  </div>
                  </>
                )}

                {/* Social Links */}
                <div className="pt-2 border-t border-border mt-2">
                  <SocietySocialLinks
                    website={society.url}
                    x={society.x}
                    discord={society.discord}
                    telegram={society.telegram}
                    youtube={society.youtube}
                    application={society.application}
                    hasOpenPositions={openPositionsBySociety.has(society.name)}
                    societyName={society.name}
                    applyAlignEnd
                    slug={societyNameToSlug(society.name)}
                  />
                </div>

                {/* Events Dropdown */}
                {!isLoading && societyEvents.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => toggleSociety(society.name)}
                      className="w-full flex items-center justify-between px-4 py-2 border-2 border-border bg-muted hover:bg-accent transition-colors text-sm font-mono font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>[ UPCOMING EVENTS ] ({societyEvents.length})</span>
                        {/* Priority: Live > Upcoming > Today - only show one badge */}
                        {hasLiveEvents(societyEvents) ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-status-live text-status-live-foreground text-[10px] font-bold rounded animate-pulse">
                            <span className="relative flex h-1 w-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live-foreground opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1 w-1 bg-status-live-foreground"></span>
                            </span>
                            LIVE
                          </span>
                        ) : hasUpcomingEvents(societyEvents) ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-bitcoin text-white text-[10px] font-bold rounded animate-pulse">
                            UPCOMING
                          </span>
                        ) : hasTodayEvents(societyEvents) ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white text-black text-[10px] font-bold rounded border border-border">
                            TODAY
                          </span>
                        ) : null}
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-2 p-4 bg-muted/50 border border-border">
                        {societyEvents.slice(0, 6).map((event, eventIndex) => (
                          <a
                            key={eventIndex}
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-3 border border-border bg-background hover:bg-accent transition-colors ${
                              eventIndex >= 4 ? 'opacity-40 blur-[0.5px]' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  {/* Event Status Badges */}
                                  <div className="flex items-center gap-2 mb-1.5">
                                    {isEventLive(event) && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-live text-status-live-foreground text-xs font-bold rounded animate-pulse">
                                        <span className="relative flex h-1.5 w-1.5">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live-foreground opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-live-foreground"></span>
                                        </span>
                                        LIVE
                                      </span>
                                    )}
                                    {!isEventLive(event) && isEventStartingWithinHour(event) && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bitcoin text-white text-xs font-bold rounded animate-pulse">
                                        UPCOMING
                                      </span>
                                    )}
                                    {!isEventLive(event) && !isEventStartingWithinHour(event) && isEventToday(event) && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white text-black text-xs font-bold rounded border border-border">
                                        TODAY
                                      </span>
                                    )}
                                  </div>
                                  <div className="font-mono font-bold text-sm">{event.title}</div>
                                </div>
                                <span className="text-xs font-mono px-2 py-0.5 border border-border bg-muted whitespace-nowrap">
                                  {event.type}
                                </span>
                              </div>
                              <div className="text-xs font-mono text-muted-foreground">
                                📅 {event.date} • 🕐 {event.time}
                              </div>
                              <div className="text-xs font-mono text-muted-foreground">
                                📍 {event.location}
                              </div>
                            </div>
                          </a>
                        ))}
                        <Link
                          href={`/events?networkState=${encodeURIComponent(society.name)}#upcoming-events`}
                          className="block text-center text-xs font-mono text-primary hover:underline mt-3 pt-2 border-t border-border"
                        >
                          {societyEvents.length > 4 
                            ? `View all ${societyEvents.length} events →`
                            : `See events on calendar →`
                          }
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ BUILD YOUR NETWORK STATE ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Ready to start your own Network State? Connect with other builders, find funding,
          and join the movement reshaping how we live and govern.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/contact"
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ GET IN TOUCH ]
          </Link>
          <Link
            href="/#upcoming-events"
            className="px-6 py-3 border-2 border-border bg-background hover:bg-accent transition-colors font-mono shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ VIEW EVENTS ]
          </Link>
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">

        </pre>
      </section>
    </div>
  );
}

