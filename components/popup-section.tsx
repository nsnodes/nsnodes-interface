"use client";

import { Calendar, BarChart3, ChevronDown, Table, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { PopupCity } from "@/lib/types/events";

interface PopupSectionProps {
  popupEvents: PopupCity[];
  isLoading?: boolean; // Loading state from database fetch
  error?: string | null; // Error state from database fetch
  showOnlyOngoing?: boolean; // New prop to control filtering
}

export function PopupSection({ popupEvents, isLoading = false, error = null, showOnlyOngoing = false }: PopupSectionProps) {
  const [popupViewMode, setPopupViewMode] = useState<"table" | "gantt">("gantt");
  const [popupZoomDays, setPopupZoomDays] = useState<number>(365);
  const [isPopupDropdownOpen, setIsPopupDropdownOpen] = useState<boolean>(false);
  const [showAllEvents, setShowAllEvents] = useState<boolean>(false);
  const [isLoadingAll, setIsLoadingAll] = useState<boolean>(false);
  const popupDropdownRef = useRef<HTMLDivElement>(null);

  // Separate ongoing and upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingEvents = popupEvents.filter(event => {
    const startDate = new Date(event.date);
    const endDate = new Date(event.endDate);
    return startDate <= today && endDate >= today;
  });

  const upcomingEvents = popupEvents.filter(event => {
    const startDate = new Date(event.date);
    return startDate > today;
  });

  // Determine which events to display
  const allDisplayEvents = showOnlyOngoing ? ongoingEvents : popupEvents;
  const displayEvents = showAllEvents ? allDisplayEvents : allDisplayEvents.slice(0, 4);
  const hasMoreEvents = allDisplayEvents.length > 4;
  const hasUpcomingEvents = showOnlyOngoing && upcomingEvents.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupDropdownRef.current && !popupDropdownRef.current.contains(event.target as Node)) {
        setIsPopupDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Popup city color palette
  const popupCityColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];

  const getPopupCityColor = (index: number) => {
    return popupCityColors[index % popupCityColors.length];
  };

  // Handle show all with loading animation
  const handleShowAll = () => {
    setIsLoadingAll(true);
    // Simulate loading to allow rendering of more events
    setTimeout(() => {
      setShowAllEvents(true);
      setIsLoadingAll(false);
    }, 300);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          {showOnlyOngoing ? '[ ONGOING POP-UPs ]' : '[ POP-UP ]'}
        </h2>
        <div className="flex items-center sm:justify-end justify-between gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            {isLoading ? (
              <span className="opacity-60 animate-pulse">Loading events...</span>
            ) : (
              <span className="opacity-60">
                {showOnlyOngoing ? (
                  <>Listing {displayEvents.length} ongoing {displayEvents.length === 1 ? 'event' : 'events'}</>
                ) : (
                  <>Listing {displayEvents.length} {displayEvents.length === 1 ? 'event' : 'events'}</>
                )}
              </span>
            )}
          </div>
          <div className="relative flex border-2 border-border bg-card">
            <button
              onClick={() => setPopupViewMode("table")}
              className={`px-3 py-2 text-xs font-mono flex items-center gap-1 transition-colors ${
                popupViewMode === "table" ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <Table className="h-3 w-3" />
              TABLE
            </button>
            <button
              onClick={() => setPopupViewMode("gantt")}
              className={`px-3 py-2 text-xs font-mono flex items-center gap-1 transition-colors ${
                popupViewMode === "gantt" ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <BarChart3 className="h-3 w-3" />
              TIMELINE
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && !error && (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="space-y-4">
            <div className="text-4xl animate-pulse">⏳</div>
            <p className="font-mono text-sm opacity-60">Loading pop-up events from database...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="space-y-4">
            <div className="text-4xl">❌</div>
            <p className="font-mono text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* No Events */}
      {!isLoading && !error && popupEvents.length === 0 && (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="space-y-4">
            <div className="text-4xl">📭</div>
            <p className="font-mono text-sm opacity-60">No pop-up events found</p>
          </div>
        </div>
      )}

      {/* Table View */}
      {!isLoading && !error && popupEvents.length > 0 && popupViewMode === "table" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto border-2 border-border">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b-2 border-border bg-muted">
                    <th className="text-left p-4 font-bold whitespace-nowrap">
                      [ DATE RANGE ]
                    </th>
                    <th className="text-left p-4 font-bold">
                      [ EVENT ]
                    </th>
                    <th className="text-left p-4 font-bold">
                      [ LOCATION ]
                    </th>
                    <th className="text-left p-4 font-bold whitespace-nowrap">
                      [ NETWORK STATE ]
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayEvents.map((event, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-semibold">{event.date}</div>
                          <div className="text-xs text-muted-foreground">{event.endDate}</div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{event.title}</td>
                      <td className="p-4">{event.location}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-primary/10 border border-primary/20 text-xs">
                          {event.networkState}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {displayEvents.map((event, index) => (
              <div
                key={index}
                className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-2 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono text-muted-foreground">{event.date}</div>
                    <div className="text-xs font-mono text-muted-foreground">{event.endDate}</div>
                  </div>
                </div>
                <h3 className="font-mono font-bold text-sm">{event.title}</h3>
                <p className="text-xs font-mono text-muted-foreground">{event.location}</p>
                <span className="inline-block px-2 py-1 bg-primary/10 border border-primary/20 text-xs font-mono">
                  {event.networkState}
                </span>
              </div>
            ))}
          </div>

          {/* Show All Button */}
          {!showAllEvents && hasMoreEvents && (
            <div className="mt-4 text-left sm:text-center">
              <button
                type="button"
                onClick={handleShowAll}
                disabled={isLoadingAll}
                className="font-mono text-sm border-2 border-border px-6 py-2 bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoadingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    LOADING...
                  </>
                ) : (
                  `[ SHOW ALL (${allDisplayEvents.length}) ]`
                )}
              </button>
            </div>
          )}

          {/* Upcoming Events - Blurred Section for Table View (only shown on homepage) */}
          {hasUpcomingEvents && (
            <div className="mt-4">
              {/* Blurred Preview - Single Row */}
              <div className="filter blur-[2px] pointer-events-none opacity-50 select-none">
                {/* Desktop Table Row */}
                <div className="hidden md:block border-2 border-border">
                  <table className="w-full font-mono text-sm">
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-semibold">{upcomingEvents[0]?.date}</div>
                            <div className="text-xs text-muted-foreground">{upcomingEvents[0]?.endDate}</div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{upcomingEvents[0]?.title}</td>
                        <td className="p-4">{upcomingEvents[0]?.location}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-primary/10 border border-primary/20 text-xs">
                            {upcomingEvents[0]?.networkState}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden border-2 border-border p-4 bg-card">
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono text-muted-foreground">{upcomingEvents[0]?.date}</div>
                    <div className="text-xs font-mono text-muted-foreground">{upcomingEvents[0]?.endDate}</div>
                  </div>
                  <h3 className="font-mono font-bold text-sm mt-2">{upcomingEvents[0]?.title}</h3>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{upcomingEvents[0]?.location}</p>
                </div>
              </div>

              {/* Text Link Below */}
              <div className="pt-2">
                <Link
                  href="/events"
                  className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  See upcoming pop-ups -&gt;
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* Timeline View */}
      {!isLoading && !error && popupEvents.length > 0 && popupViewMode === "gantt" && (
        <div className="border-2 border-border bg-card">
          {/* Timeline Header */}
          <div className="border-b-2 border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {showOnlyOngoing ? '[ ONGOING POP-UPs ]' : '[ POP-UP ]'}
              </h3>
              <div ref={popupDropdownRef} className="relative">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-muted-foreground">View:</label>
                  <button
                    onClick={() => setIsPopupDropdownOpen(!isPopupDropdownOpen)}
                    className="text-xs font-mono border border-border bg-background px-2 py-1 min-w-[80px] text-left flex items-center justify-between hover:bg-accent transition-colors"
                    aria-label="Timeline zoom level"
                  >
                    <span>{popupZoomDays} days</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isPopupDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Custom Dropdown */}
                {isPopupDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-background border-2 border-border shadow-lg z-50 min-w-[80px]">
                    {[90, 180, 365, 730, 1095].map((days) => (
                      <button
                        key={days}
                        onClick={() => {
                          setPopupZoomDays(days);
                          setIsPopupDropdownOpen(false);
                        }}
                        className={`w-full text-xs font-mono px-2 py-1 text-left hover:bg-accent transition-colors ${
                          popupZoomDays === days ? 'bg-accent' : ''
                        }`}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline Legend */}
          <div className="border-b border-border bg-card p-4">
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              {displayEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className={`w-3 h-3 ${getPopupCityColor(index)}`}></div>
                  <span>{event.networkState}</span>
                </div>
              ))}
            </div>
          </div>

          {(() => {
            // Calculate date range - start from current week
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Start from current week (Monday of current week)
            const currentWeekStart = new Date(today);
            currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Monday

            // Generate week columns based on zoom level
            const weekColumns: { month: Date; week: Date; weekEnd: Date }[] = [];
            const endDate = new Date(today.getTime() + popupZoomDays * 24 * 60 * 60 * 1000);

            for (let weekStart = new Date(currentWeekStart);
                 weekStart <= endDate;
                 weekStart.setDate(weekStart.getDate() + 7)) {
              const weekEnd = new Date(weekStart);
              weekEnd.setDate(weekEnd.getDate() + 6);

              // Determine which month this week belongs to (use the month of the week start)
              const weekMonth = new Date(weekStart.getFullYear(), weekStart.getMonth(), 1);

              weekColumns.push({
                month: weekMonth,
                week: new Date(weekStart),
                weekEnd: new Date(weekEnd)
              });
            }

            // Helper function to get month key
            const getMonthKey = (date: Date) => {
              return `${date.getFullYear()}-${date.getMonth()}`;
            };

            return (
              <>
                {/* Desktop Timeline Grid - Week Horizontal, Popup Vertical */}
                <div className="hidden md:block p-4 overflow-x-auto">
                  <div className="min-w-[1200px]">
                    <div className="space-y-1">
                      {/* Week Header Row */}
                      <div className="grid gap-1" style={{ gridTemplateColumns: `200px repeat(${weekColumns.length}, minmax(80px, 1fr))` }}>
                        <div className="text-xs font-mono font-bold text-muted-foreground p-2">POP-UP EVENTS</div>
                        {weekColumns.map((weekData, idx) => {
                          const weekStart = weekData.week;
                          const weekEnd = weekData.weekEnd;
                          const monthKey = getMonthKey(weekData.month);
                          const isCurrentWeek = weekStart <= today && weekEnd >= today;
                          const isCurrentMonth = monthKey === getMonthKey(today);

                          // Calculate ISO week number
                          const getWeekNumber = (date: Date) => {
                            const target = new Date(date.valueOf());
                            const dayNr = (date.getDay() + 6) % 7;
                            target.setDate(target.getDate() - dayNr + 3);
                            const firstThursday = target.valueOf();
                            target.setMonth(0, 1);
                            if (target.getDay() !== 4) {
                              target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                            }
                            return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
                          };

                          const weekNumber = getWeekNumber(weekStart);

                          return (
                            <div
                              key={idx}
                              className={`text-center border-l border-border p-1 ${isCurrentWeek ? 'bg-primary/20' : isCurrentMonth ? 'bg-primary/10' : 'bg-muted/50'}`}
                              suppressHydrationWarning
                            >
                              <div className="text-xs font-mono font-bold">
                                W{weekNumber}
                              </div>
                              <div className="text-[10px] font-mono opacity-75">
                                {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Popup Event Rows */}
                      {displayEvents.map((event, eventIdx) => {
                        const eventStart = new Date(event.date);
                        const eventEnd = new Date(event.endDate);

                        return (
                          <div key={eventIdx} className="grid gap-1" style={{ gridTemplateColumns: `200px repeat(${weekColumns.length}, minmax(80px, 1fr))` }}>
                            {/* Event Label */}
                            <div className="text-xs font-mono text-muted-foreground flex items-center p-2 border-t border-border">
                              <div className="space-y-1">
                                <div className="font-bold">{event.title}</div>
                                <div className="text-[10px] opacity-75">{event.networkState}</div>
                                <div className="text-[10px] opacity-75">{event.date} - {event.endDate}</div>
                              </div>
                            </div>

                            {/* Week Columns */}
                            {weekColumns.map((weekData, weekIdx) => {
                              const weekStart = weekData.week;
                              const weekEnd = weekData.weekEnd;

                              // Check if event overlaps with this week
                              const isActiveInWeek = eventStart <= weekEnd && eventEnd >= weekStart;

                              // Find the first and last weeks this event appears in
                              const firstWeekIndex = weekColumns.findIndex(week =>
                                eventStart <= week.weekEnd && eventEnd >= week.week
                              );
                              const lastWeekIndex = weekColumns.findLastIndex(week =>
                                eventStart <= week.weekEnd && eventEnd >= week.week
                              );

                              return (
                                <div
                                  key={weekIdx}
                                  className="relative min-h-[80px] border-l border-t border-border bg-muted/20"
                                >
                                  {/* Only render the event bar in the first week it appears */}
                                  {isActiveInWeek && weekIdx === firstWeekIndex && (
                                    <div
                                      className={`absolute ${getPopupCityColor(eventIdx)} rounded border border-border cursor-pointer hover:opacity-80 transition-all hover:z-10 overflow-hidden group`}
                                      style={{
                                        left: '2px',
                                        width: `calc(${(lastWeekIndex - firstWeekIndex + 1) * 100}% - 4px)`,
                                        top: '2px',
                                        bottom: '2px',
                                      }}
                                      onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                      title={`${event.title}\n${event.date} - ${event.endDate}\n${event.location}\n${event.networkState}`}
                                    >
                                      <div className="p-2 text-white text-[10px] font-mono leading-tight h-full overflow-hidden flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="font-bold truncate">{event.title}</div>
                                          <div className="opacity-90 truncate text-[9px]">
                                            {event.date.split('-')[2]} - {event.endDate.split('-')[2]}
                                          </div>
                                          <div className="opacity-75 truncate text-[8px]">
                                            {event.location}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Tooltip on hover */}
                                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-20 w-64 p-2 bg-popover border-2 border-border text-popover-foreground text-xs font-mono shadow-lg">
                                        <div className="font-bold mb-1">{event.title}</div>
                                        <div className="space-y-0.5 text-[10px]">
                                          <div>📅 {event.date} - {event.endDate}</div>
                                          <div>📍 {event.location}</div>
                                          <div>🌐 {event.networkState}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Empty State */}
                      {displayEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                          No pop-up events found
                        </div>
                      )}

                      {/* Show All Button - Desktop Timeline */}
                      {!showAllEvents && hasMoreEvents && (
                        <div className="pt-4 text-left sm:text-center">
                          <button
                            type="button"
                            onClick={handleShowAll}
                            disabled={isLoadingAll}
                            className="font-mono text-sm border-2 border-border px-6 py-2 bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isLoadingAll ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                LOADING...
                              </>
                            ) : (
                              `[ SHOW ALL (${allDisplayEvents.length}) ]`
                            )}
                          </button>
                        </div>
                      )}

                      {/* Upcoming Events - Blurred Row (Desktop) */}
                      {hasUpcomingEvents && upcomingEvents[0] && (
                        <>
                          {/* Blurred Preview Row */}
                          <div className="filter blur-[2px] pointer-events-none opacity-50 select-none">
                            {(() => {
                              const upcomingEvent = upcomingEvents[0];
                              const upcomingEventIdx = displayEvents.length; // Use next index for color
                              const eventStart = new Date(upcomingEvent.date);
                              const eventEnd = new Date(upcomingEvent.endDate);

                              return (
                                <div className="grid gap-1" style={{ gridTemplateColumns: `200px repeat(${weekColumns.length}, minmax(80px, 1fr))` }}>
                                  {/* Event Label */}
                                  <div className="text-xs font-mono text-muted-foreground flex items-center p-2 border-t border-border">
                                    <div className="space-y-1">
                                      <div className="font-bold">{upcomingEvent.title}</div>
                                      <div className="text-[10px] opacity-75">{upcomingEvent.networkState}</div>
                                      <div className="text-[10px] opacity-75">{upcomingEvent.date} - {upcomingEvent.endDate}</div>
                                    </div>
                                  </div>

                                  {/* Week Columns */}
                                  {weekColumns.map((weekData, weekIdx) => {
                                    const weekStart = weekData.week;
                                    const weekEnd = weekData.weekEnd;

                                    // Check if event overlaps with this week
                                    const isActiveInWeek = eventStart <= weekEnd && eventEnd >= weekStart;

                                    // Find the first and last weeks this event appears in
                                    const firstWeekIndex = weekColumns.findIndex(week =>
                                      eventStart <= week.weekEnd && eventEnd >= week.week
                                    );
                                    const lastWeekIndex = weekColumns.findLastIndex(week =>
                                      eventStart <= week.weekEnd && eventEnd >= week.week
                                    );

                                    return (
                                      <div
                                        key={weekIdx}
                                        className="relative min-h-[80px] border-l border-t border-border bg-muted/20"
                                      >
                                        {/* Only render the event bar in the first week it appears */}
                                        {isActiveInWeek && weekIdx === firstWeekIndex && (
                                          <div
                                            className={`absolute ${getPopupCityColor(upcomingEventIdx)} rounded border border-border overflow-hidden`}
                                            style={{
                                              left: '2px',
                                              width: `calc(${(lastWeekIndex - firstWeekIndex + 1) * 100}% - 4px)`,
                                              top: '2px',
                                              bottom: '2px',
                                            }}
                                          >
                                            <div className="p-2 text-white text-[10px] font-mono leading-tight h-full overflow-hidden flex items-center justify-center">
                                              <div className="text-center">
                                                <div className="font-bold truncate">{upcomingEvent.title}</div>
                                                <div className="opacity-90 truncate text-[9px]">
                                                  {upcomingEvent.date.split('-')[2]} - {upcomingEvent.endDate.split('-')[2]}
                                                </div>
                                                <div className="opacity-75 truncate text-[8px]">
                                                  {upcomingEvent.location}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Text Link Below */}
                          <div className="pt-2">
                            <Link
                              href="/events"
                              className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                              See upcoming pop-ups -&gt;
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline View */}
                <div className="md:hidden p-4 overflow-x-auto overscroll-x-contain touch-pan-x">
                  <div className="min-w-[800px]">
                    <div className="space-y-1">
                      {/* Week Header Row */}
                      <div className="grid gap-1" style={{ gridTemplateColumns: `150px repeat(${weekColumns.length}, minmax(60px, 1fr))` }}>
                        <div className="text-xs font-mono font-bold text-muted-foreground p-2">POP-UP EVENTS</div>
                        {weekColumns.map((weekData, idx) => {
                          const weekStart = weekData.week;
                          const weekEnd = weekData.weekEnd;
                          const monthKey = getMonthKey(weekData.month);
                          const isCurrentWeek = weekStart <= today && weekEnd >= today;
                          const isCurrentMonth = monthKey === getMonthKey(today);

                          // Calculate ISO week number
                          const getWeekNumber = (date: Date) => {
                            const target = new Date(date.valueOf());
                            const dayNr = (date.getDay() + 6) % 7;
                            target.setDate(target.getDate() - dayNr + 3);
                            const firstThursday = target.valueOf();
                            target.setMonth(0, 1);
                            if (target.getDay() !== 4) {
                              target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                            }
                            return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
                          };

                          const weekNumber = getWeekNumber(weekStart);

                          return (
                            <div
                              key={idx}
                              className={`text-center border-l border-border p-1 ${isCurrentWeek ? 'bg-primary/20' : isCurrentMonth ? 'bg-primary/10' : 'bg-muted/50'}`}
                              suppressHydrationWarning
                            >
                              <div className="text-xs font-mono font-bold">
                                W{weekNumber}
                              </div>
                              <div className="text-[10px] font-mono opacity-75">
                                {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Popup Event Rows */}
                      {displayEvents.map((event, eventIdx) => {
                        const eventStart = new Date(event.date);
                        const eventEnd = new Date(event.endDate);

                        return (
                          <div key={eventIdx} className="grid gap-1" style={{ gridTemplateColumns: `150px repeat(${weekColumns.length}, minmax(60px, 1fr))` }}>
                            {/* Event Label */}
                            <div className="text-xs font-mono text-muted-foreground flex items-center p-2 border-t border-border">
                              <div className="space-y-1">
                                <div className="font-bold">{event.title}</div>
                                <div className="text-[10px] opacity-75">{event.networkState}</div>
                                <div className="text-[10px] opacity-75">{event.date} - {event.endDate}</div>
                              </div>
                            </div>

                            {/* Week Columns */}
                            {weekColumns.map((weekData, weekIdx) => {
                              const weekStart = weekData.week;
                              const weekEnd = weekData.weekEnd;

                              // Check if event overlaps with this week
                              const isActiveInWeek = eventStart <= weekEnd && eventEnd >= weekStart;

                              // Find the first and last weeks this event appears in
                              const firstWeekIndex = weekColumns.findIndex(week =>
                                eventStart <= week.weekEnd && eventEnd >= week.week
                              );
                              const lastWeekIndex = weekColumns.findLastIndex(week =>
                                eventStart <= week.weekEnd && eventEnd >= week.week
                              );

                              return (
                                <div
                                  key={weekIdx}
                                  className="relative min-h-[60px] border-l border-t border-border bg-muted/20"
                                >
                                  {/* Only render the event bar in the first week it appears */}
                                  {isActiveInWeek && weekIdx === firstWeekIndex && (
                                    <div
                                      className={`absolute ${getPopupCityColor(eventIdx)} rounded border border-border cursor-pointer hover:opacity-80 transition-all hover:z-10 overflow-hidden group`}
                                      style={{
                                        left: '2px',
                                        width: `calc(${(lastWeekIndex - firstWeekIndex + 1) * 100}% - 4px)`,
                                        top: '2px',
                                        bottom: '2px',
                                      }}
                                      onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                      title={`${event.title}\n${event.date} - ${event.endDate}\n${event.location}\n${event.networkState}`}
                                    >
                                      <div className="p-1 text-white text-[9px] font-mono leading-tight h-full overflow-hidden flex items-center justify-center">
                                        <div className="text-center">
                                          <div className="font-bold truncate">{event.title}</div>
                                          <div className="opacity-90 truncate text-[8px]">
                                            {event.date.split('-')[2]} - {event.endDate.split('-')[2]}
                                          </div>
                                          <div className="opacity-75 truncate text-[7px]">
                                            {event.location}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Tooltip on hover */}
                                      <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-20 w-48 p-2 bg-popover border-2 border-border text-popover-foreground text-xs font-mono shadow-lg">
                                        <div className="font-bold mb-1">{event.title}</div>
                                        <div className="space-y-0.5 text-[10px]">
                                          <div>📅 {event.date} - {event.endDate}</div>
                                          <div>📍 {event.location}</div>
                                          <div>🌐 {event.networkState}</div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Empty State */}
                      {displayEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                          No pop-up events found
                        </div>
                      )}

                      {/* Show All Button - Mobile Timeline */}
                      {!showAllEvents && hasMoreEvents && (
                        <div className="pt-4 text-left sm:text-center">
                          <button
                            type="button"
                            onClick={handleShowAll}
                            disabled={isLoadingAll}
                            className="font-mono text-sm border-2 border-border px-6 py-2 bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isLoadingAll ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                LOADING...
                              </>
                            ) : (
                              `[ SHOW ALL (${allDisplayEvents.length}) ]`
                            )}
                          </button>
                        </div>
                      )}

                      {/* Upcoming Events - Blurred Row (Mobile) */}
                      {hasUpcomingEvents && upcomingEvents[0] && (
                        <>
                          {/* Blurred Preview Row */}
                          <div className="filter blur-[2px] pointer-events-none opacity-50 select-none">
                            {(() => {
                              const upcomingEvent = upcomingEvents[0];
                              const upcomingEventIdx = displayEvents.length; // Use next index for color
                              const eventStart = new Date(upcomingEvent.date);
                              const eventEnd = new Date(upcomingEvent.endDate);

                              return (
                                <div className="grid gap-1" style={{ gridTemplateColumns: `150px repeat(${weekColumns.length}, minmax(60px, 1fr))` }}>
                                  {/* Event Label */}
                                  <div className="text-xs font-mono text-muted-foreground flex items-center p-2 border-t border-border">
                                    <div className="space-y-1">
                                      <div className="font-bold">{upcomingEvent.title}</div>
                                      <div className="text-[10px] opacity-75">{upcomingEvent.networkState}</div>
                                      <div className="text-[10px] opacity-75">{upcomingEvent.date} - {upcomingEvent.endDate}</div>
                                    </div>
                                  </div>

                                  {/* Week Columns */}
                                  {weekColumns.map((weekData, weekIdx) => {
                                    const weekStart = weekData.week;
                                    const weekEnd = weekData.weekEnd;

                                    // Check if event overlaps with this week
                                    const isActiveInWeek = eventStart <= weekEnd && eventEnd >= weekStart;

                                    // Find the first and last weeks this event appears in
                                    const firstWeekIndex = weekColumns.findIndex(week =>
                                      eventStart <= week.weekEnd && eventEnd >= week.week
                                    );
                                    const lastWeekIndex = weekColumns.findLastIndex(week =>
                                      eventStart <= week.weekEnd && eventEnd >= week.week
                                    );

                                    return (
                                      <div
                                        key={weekIdx}
                                        className="relative min-h-[60px] border-l border-t border-border bg-muted/20"
                                      >
                                        {/* Only render the event bar in the first week it appears */}
                                        {isActiveInWeek && weekIdx === firstWeekIndex && (
                                          <div
                                            className={`absolute ${getPopupCityColor(upcomingEventIdx)} rounded border border-border overflow-hidden`}
                                            style={{
                                              left: '2px',
                                              width: `calc(${(lastWeekIndex - firstWeekIndex + 1) * 100}% - 4px)`,
                                              top: '2px',
                                              bottom: '2px',
                                            }}
                                          >
                                            <div className="p-1 text-white text-[9px] font-mono leading-tight h-full overflow-hidden flex items-center justify-center">
                                              <div className="text-center">
                                                <div className="font-bold truncate">{upcomingEvent.title}</div>
                                                <div className="opacity-90 truncate text-[8px]">
                                                  {upcomingEvent.date.split('-')[2]} - {upcomingEvent.endDate.split('-')[2]}
                                                </div>
                                                <div className="opacity-75 truncate text-[7px]">
                                                  {upcomingEvent.location}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Text Link Below */}
                          <div className="pt-2">
                            <Link
                              href="/events"
                              className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                              See upcoming pop-ups -&gt;
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </section>
  );
}
