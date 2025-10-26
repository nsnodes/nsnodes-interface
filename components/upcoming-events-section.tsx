"use client";

import { Calendar, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Tag, Network, Search, BarChart3, Table, Monitor } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { UIEvent } from "@/lib/types/events";
import { societyNamesMatch } from "@/lib/utils/society-matcher";

type SortField = "date" | "event" | "location" | "networkState" | "type";
type SortDirection = "asc" | "desc";

interface UpcomingEventsSectionProps {
  events: UIEvent[];
  isLoading: boolean;
  error: string | null;
  showOnlyToday?: boolean; // New prop to show only today's events
  hideFilters?: boolean; // New prop to hide filters and sorting
  initialNetworkState?: string; // Pre-select network state filter
}

export function UpcomingEventsSection({ events, isLoading, error, showOnlyToday, hideFilters, initialNetworkState }: UpcomingEventsSectionProps) {
  // UI state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedNetworkStates, setSelectedNetworkStates] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("upcoming");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [networkStateSearch, setNetworkStateSearch] = useState<string>("");
  const [typeSearch, setTypeSearch] = useState<string>("");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [allFiltersOpen, setAllFiltersOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "gantt">("table");
  const [timelineZoomDays, setTimelineZoomDays] = useState<number>(showOnlyToday ? 1 : 7);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState<boolean>(false);

  const filtersRef = useRef<HTMLDivElement>(null);
  const timelineDropdownRef = useRef<HTMLDivElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  // Handle initial network state filter and scroll
  useEffect(() => {
    if (initialNetworkState && !isLoading && events.length > 0) {
      console.log('Initial network state:', initialNetworkState);
      console.log('Events loaded:', events.length);

      // Get unique network states from events
      const uniqueNetworkStates = Array.from(
        new Set(events.map(e => e.networkState).filter(Boolean))
      ).sort();

      console.log('Unique network states:', uniqueNetworkStates);

      // Find matching network state(s) from the actual event data
      const matchingStates = uniqueNetworkStates.filter(ns =>
        societyNamesMatch(ns, initialNetworkState)
      );

      console.log('Matching states for', initialNetworkState, ':', matchingStates);

      // Set the network state filter with the actual network state names from events
      if (matchingStates.length > 0) {
        setSelectedNetworkStates(matchingStates);
      }

      // Open filters to show the pre-selected network state
      setAllFiltersOpen(true);

      // Scroll to the events section after a short delay to allow content to render
      setTimeout(() => {
        const element = document.getElementById('upcoming-events');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [initialNetworkState, isLoading, events.length]);

  // Handle click outside to close filters and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clearButtonRef.current && clearButtonRef.current.contains(event.target as Node)) {
        return;
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setAllFiltersOpen(false);
      }
      if (timelineDropdownRef.current && !timelineDropdownRef.current.contains(event.target as Node)) {
        setIsTimelineDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleAllFilters = () => {
    setAllFiltersOpen(!allFiltersOpen);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helper function to get date range
  const getDateRange = (range: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (range) {
      case "upcoming":
        return { start: today, end: new Date("2099-12-31") };
      case "today": {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        return { start: today, end };
      }
      case "tomorrow": {
        const start = new Date(today);
        start.setDate(start.getDate() + 1);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        return { start, end };
      }
      case "week": {
        const end = new Date(today);
        end.setDate(end.getDate() + 7);
        return { start: today, end };
      }
      case "month": {
        const end = new Date(today);
        end.setMonth(end.getMonth() + 1);
        return { start: today, end };
      }
      case "custom": {
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate + "T00:00:00"),
            end: new Date(customEndDate + "T23:59:59")
          };
        }
        return null;
      }
      case "all":
        return null;
      default:
        return null;
    }
  };

  // Get unique values for filters
  const uniqueNetworkStates = Array.from(
    new Set(events.map(e => e.networkState).filter(Boolean))
  ).sort();
  const uniqueTypes = Array.from(
    new Set(events.map(e => e.type).filter(Boolean))
  ).sort();

  const uniqueLocations = Array.from(
    new Set([
      ...events.filter(e => e.location === 'Virtual').map(() => 'Virtual'),
      ...events.map(e => e.country).filter(c => c && c !== 'Unknown')
    ])
  ).sort((a, b) => {
    if (a === 'Virtual') return -1;
    if (b === 'Virtual') return 1;
    return a.localeCompare(b);
  });

  // Filter lists based on search
  const filteredNetworkStates = uniqueNetworkStates.filter(ns =>
    ns?.toLowerCase().includes(networkStateSearch.toLowerCase())
  );
  const filteredTypes = uniqueTypes.filter(type =>
    type?.toLowerCase().includes(typeSearch.toLowerCase())
  );
  const filteredCountries = uniqueLocations.filter(location =>
    location?.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const toggleFilter = (value: string, filterArray: string[], setFilter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(item => item !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  // First, separate today's events from tomorrow's events if showOnlyToday is enabled
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const todayEvents = showOnlyToday ? events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  }) : events;

  const tomorrowEvents = showOnlyToday ? events.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === tomorrow.getTime();
  }).sort((a, b) => a.date.localeCompare(b.date)) : [];

  const filteredAndSortedEvents = [...(showOnlyToday ? todayEvents : events)]
    .filter(event => {
      if (selectedDateRange) {
        const dateRange = getDateRange(selectedDateRange);
        if (dateRange) {
          const eventDate = new Date(event.date);
          if (eventDate < dateRange.start || eventDate > dateRange.end) {
            return false;
          }
        }
      }

      if (selectedNetworkStates.length > 0) {
        const matchesNetworkState = selectedNetworkStates.some(selected =>
          societyNamesMatch(event.networkState, selected)
        );
        if (!matchesNetworkState) {
          return false;
        }
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
        return false;
      }
      if (selectedCountries.length > 0) {
        const matchesLocation = selectedCountries.some(selected => {
          if (selected === 'Virtual') {
            return event.location === 'Virtual';
          }
          return event.country === selected;
        });
        if (!matchesLocation) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "date":
          compareValue = a.date.localeCompare(b.date);
          break;
        case "event":
          compareValue = a.title.localeCompare(b.title);
          break;
        case "location":
          if (a.location === "Virtual" && b.location !== "Virtual") {
            compareValue = -1;
          } else if (a.location !== "Virtual" && b.location === "Virtual") {
            compareValue = 1;
          } else {
            compareValue = a.location.localeCompare(b.location);
          }
          break;
        case "networkState":
          compareValue = a.networkState.localeCompare(b.networkState);
          break;
        case "type":
          compareValue = a.type.localeCompare(b.type);
          break;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });

  const hasTomorrowEvents = showOnlyToday && tomorrowEvents.length > 0;

  // Helper function to get date group label
  const getDateGroupLabel = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const eventDateOnly = new Date(eventDate);
    eventDateOnly.setHours(0, 0, 0, 0);

    if (eventDateOnly.getTime() === today.getTime()) {
      return "Today";
    } else if (eventDateOnly.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (eventDateOnly > tomorrow && eventDateOnly <= weekEnd) {
      return "This Week";
    } else {
      return "Later";
    }
  };

  // Group events by date category
  const groupedEvents = filteredAndSortedEvents.reduce((groups, event) => {
    const group = getDateGroupLabel(event.date);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(event);
    return groups;
  }, {} as Record<string, typeof filteredAndSortedEvents>);

  const groupOrder = ["Today", "Tomorrow", "This Week", "Later"];

  // Gantt chart helper functions
  const getEventDuration = (event: typeof events[0]) => {
    const timeMatch = event.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?\s*[–-]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!timeMatch) return 2;

    const [, startHour, startMin = "00", startPeriod, endHour, endMin = "00", endPeriod] = timeMatch;

    let startTime = parseInt(startHour) + (startMin ? parseInt(startMin) / 60 : 0);
    let endTime = parseInt(endHour) + (endMin ? parseInt(endMin) / 60 : 0);

    if (startPeriod?.toUpperCase() === 'PM' && startTime < 12) startTime += 12;
    if (endPeriod?.toUpperCase() === 'PM' && endTime < 12) endTime += 12;
    if (startPeriod?.toUpperCase() === 'AM' && startTime === 12) startTime = 0;
    if (endPeriod?.toUpperCase() === 'AM' && endTime === 12) endTime = 0;

    return Math.max(1, endTime - startTime);
  };

  const getEventStartHour = (event: typeof events[0]) => {
    const timeMatch = event.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!timeMatch) return 9;

    const [, hour, min = "00", period] = timeMatch;
    let time = parseInt(hour) + (min ? parseInt(min) / 60 : 0);

    if (period?.toUpperCase() === 'PM' && time < 12) time += 12;
    if (period?.toUpperCase() === 'AM' && time === 12) time = 0;

    return time;
  };

  const getNetworkStateColor = (networkState: string) => {
    const colors: Record<string, string> = {
      'edgpatagonia': 'bg-emerald-500',
      'Network School': 'bg-blue-600',
      '4Seas': 'bg-cyan-500',
      'Próspera': 'bg-orange-500',
      'INFINITA': 'bg-fuchsia-500',
      'Invisible Garden Argentina': 'bg-lime-500',
      'Software Zuzalu': 'bg-violet-600',
      'Tomek ⚡ K': 'bg-amber-500',
      'Andrea S.': 'bg-rose-500',
    };
    return colors[networkState] || 'bg-slate-500';
  };

  return (
    <section id="upcoming-events" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          {showOnlyToday ? '[ EVENTS TODAY ]' : '[ UPCOMING EVENTS ]'}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            {isLoading ? (
              <span className="opacity-60 animate-pulse">Loading events...</span>
            ) : (
              <span className="opacity-60">
                Listing {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'}
              </span>
            )}
          </div>
          <div className="relative flex border-2 border-border bg-card">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 text-xs font-mono flex items-center gap-1 transition-colors ${
                viewMode === "table" ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <Table className="h-3 w-3" />
              TABLE
            </button>
            <button
              onClick={() => setViewMode("gantt")}
              className={`px-3 py-2 text-xs font-mono flex items-center gap-1 transition-colors ${
                viewMode === "gantt" ? "bg-accent" : "hover:bg-accent"
              }`}
            >
              <BarChart3 className="h-3 w-3" />
              TIMELINE
            </button>

            {/* ASCII Arrow Callout */}
            <div className="hidden lg:block absolute -top-10 -right-2 pointer-events-none">
              <pre className="text-xs leading-tight font-mono opacity-70 whitespace-pre">
{`Try this!
    ↓`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {!hideFilters && (
      <>
      <div ref={filtersRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Filter */}
        <div className="border-2 border-border bg-card">
          <button
            type="button"
            onClick={toggleAllFilters}
            className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              [ DATE ]
            </div>
            {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {allFiltersOpen && (
            <div className="px-4 pb-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="upcoming"
                  checked={selectedDateRange === "upcoming"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">Upcoming</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="today"
                  checked={selectedDateRange === "today"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">Today</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="tomorrow"
                  checked={selectedDateRange === "tomorrow"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">Tomorrow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="week"
                  checked={selectedDateRange === "week"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">This Week</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="month"
                  checked={selectedDateRange === "month"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">This Month</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="custom"
                  checked={selectedDateRange === "custom"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">Custom</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                <input
                  type="radio"
                  name="dateRange"
                  value="all"
                  checked={selectedDateRange === "all"}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="cursor-pointer"
                />
                <span className="text-xs font-mono">All Events</span>
              </label>
              {selectedDateRange === "custom" && (
                <div className="space-y-2 mt-2 pl-6">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full text-xs font-mono p-1 border border-border bg-background"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full text-xs font-mono p-1 border border-border bg-background"
                    placeholder="End date"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="border-2 border-border bg-card">
          <button
            type="button"
            onClick={toggleAllFilters}
            className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              [ LOCATION ]
            </div>
            {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {allFiltersOpen && (
            <div className="px-4 pb-4 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredCountries.map(country => (
                  <label key={country} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => toggleFilter(country, selectedCountries, setSelectedCountries)}
                      className="cursor-pointer"
                    />
                    {country === 'Virtual' ? (
                      <span className="text-xs font-mono flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5 text-primary" />
                        {country}
                      </span>
                    ) : (
                      <span className="text-xs font-mono">{country}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Network State Filter */}
        <div className="border-2 border-border bg-card">
          <button
            type="button"
            onClick={toggleAllFilters}
            className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              [ NETWORK STATE ]
            </div>
            {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {allFiltersOpen && (
            <div className="px-4 pb-4 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                <input
                  type="text"
                  value={networkStateSearch}
                  onChange={(e) => setNetworkStateSearch(e.target.value)}
                  placeholder="Search network states..."
                  className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredNetworkStates.map(ns => (
                  <label key={ns} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedNetworkStates.includes(ns)}
                      onChange={() => toggleFilter(ns, selectedNetworkStates, setSelectedNetworkStates)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs font-mono">{ns}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div className="border-2 border-border bg-card">
          <button
            type="button"
            onClick={toggleAllFilters}
            className="w-full p-4 font-mono font-bold text-sm flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              [ TYPE ]
            </div>
            {allFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {allFiltersOpen && (
            <div className="px-4 pb-4 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 opacity-50" />
                <input
                  type="text"
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  placeholder="Search types..."
                  className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs font-mono">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      {(selectedNetworkStates.length > 0 || selectedTypes.length > 0 || selectedCountries.length > 0 || selectedDateRange !== "upcoming") && (
        <button
          ref={clearButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNetworkStates([]);
            setSelectedTypes([]);
            setSelectedCountries([]);
            setSelectedDateRange("upcoming");
            setCustomStartDate("");
            setCustomEndDate("");
            setAllFiltersOpen(false);
          }}
          className="font-mono text-xs border-2 border-border px-4 py-2 bg-card hover:bg-accent transition-colors"
        >
          [ CLEAR ALL FILTERS ]
        </button>
      )}
      </>
      )}

      {/* Error State */}
      {error && (
        <div className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20 p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-600 dark:text-red-400 text-2xl">⚠</span>
            <div className="space-y-2">
              <p className="font-mono text-sm text-red-600 dark:text-red-400 font-bold">
                Failed to load events
              </p>
              <p className="font-mono text-xs text-red-600/80 dark:text-red-400/80">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="font-mono text-xs border border-red-600 dark:border-red-400 px-3 py-1 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                [ RELOAD PAGE ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="space-y-4">
            <div className="text-4xl animate-pulse">⏳</div>
            <p className="font-mono text-sm opacity-60">Loading events from database...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <div className="border-2 border-border bg-card p-12 text-center">
          <div className="space-y-4">
            <div className="text-4xl">📭</div>
            <p className="font-mono text-sm opacity-60">No events found in the database</p>
          </div>
        </div>
      )}

      {/* Table View */}
      {!isLoading && !error && events.length > 0 && viewMode === "table" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto border-2 border-border">
              <table className="w-full font-mono text-sm">
                <thead>
                  <tr className="border-b-2 border-border bg-muted">
                    <th
                      className="text-left p-4 font-bold whitespace-nowrap cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        [ DATE & TIME ]
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-bold cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSort("event")}
                    >
                      <div className="flex items-center gap-2">
                        [ EVENT ]
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-bold cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center gap-2">
                        [ LOCATION ]
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-bold whitespace-nowrap cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSort("networkState")}
                    >
                      <div className="flex items-center gap-2">
                        [ NETWORK STATE ]
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-bold whitespace-nowrap cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-2">
                        [ TYPE ]
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupOrder.map(groupLabel => {
                    const groupEvents = groupedEvents[groupLabel];
                    if (!groupEvents || groupEvents.length === 0) return null;

                    return (
                      <React.Fragment key={groupLabel}>
                        {/* Group Header Row */}
                        <tr className="bg-muted border-b-2 border-border">
                          <td colSpan={5} className="p-4">
                            <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              [ {groupLabel.toUpperCase()} ]
                            </h3>
                          </td>
                        </tr>
                        {/* Group Events */}
                        {groupEvents.map((event, index) => (
                          <tr
                            key={`${groupLabel}-${index}`}
                            className="border-b border-border hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                          >
                            <td className="p-4 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <div className="font-semibold">{event.date}</div>
                                <div className="text-xs text-muted-foreground whitespace-nowrap">{event.time}</div>
                              </div>
                            </td>
                          <td className="p-4 font-semibold">{event.title}</td>
                          <td className="p-4">
                            {event.location === 'Virtual' ? (
                              <span className="flex items-center gap-1.5">
                                <Monitor className="h-3.5 w-3.5 text-primary" />
                                {event.location}
                              </span>
                            ) : (
                              event.location
                            )}
                          </td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-primary/10 border border-primary/20 text-xs">
                                {event.networkState}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="text-muted-foreground text-xs">
                                {event.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Link to Events Page */}
            {showOnlyToday && (
              <div className="mt-4">
                <Link
                  href="/events"
                  className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  See all events -&gt;
                </Link>
              </div>
            )}

            {/* Blurred Tomorrow Event - Desktop */}
            {!showOnlyToday && hasTomorrowEvents && tomorrowEvents[0] && (
              <div className="mt-4">
                <div className="overflow-x-auto border-2 border-border">
                  <table className="w-full font-mono text-sm">
                    <tbody>
                      <tr className="filter blur-[2px] pointer-events-none opacity-50 select-none border-b border-border">
                        <td className="p-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="font-semibold">{tomorrowEvents[0].date}</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">{tomorrowEvents[0].time}</div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold">{tomorrowEvents[0].title}</td>
                        <td className="p-4">
                          {tomorrowEvents[0].location === 'Virtual' ? (
                            <span className="flex items-center gap-1.5">
                              <Monitor className="h-3.5 w-3.5 text-primary" />
                              {tomorrowEvents[0].location}
                            </span>
                          ) : (
                            tomorrowEvents[0].location
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-primary/10 border border-primary/20 text-xs">
                            {tomorrowEvents[0].networkState}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="text-muted-foreground text-xs">
                            {tomorrowEvents[0].type}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="pt-2">
                  <Link
                    href="/events"
                    className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    See all events -&gt;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {groupOrder.map(groupLabel => {
              const groupEvents = groupedEvents[groupLabel];
              if (!groupEvents || groupEvents.length === 0) return null;

              return (
                <React.Fragment key={groupLabel}>
                  {/* Group Header */}
                  <div className="border-2 border-border bg-muted p-3">
                    <h3 className="font-mono font-bold text-base flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      [ {groupLabel.toUpperCase()} ]
                    </h3>
                  </div>
                  {/* Group Events */}
                  <div className="space-y-4">
                    {groupEvents.map((event, index) => (
                      <div
                        key={`${groupLabel}-${index}`}
                        className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-2 cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <div className="text-xs font-mono text-muted-foreground">{event.date}</div>
                            <div className="text-xs font-mono text-muted-foreground">{event.time}</div>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 border border-border bg-muted">
                            {event.type}
                          </span>
                        </div>
                      <h3 className="font-mono font-bold text-sm">{event.title}</h3>
                      <p className="text-xs font-mono text-muted-foreground">
                        {event.location === 'Virtual' ? (
                          <span className="flex items-center gap-1.5">
                            <Monitor className="h-3.5 w-3.5 text-primary" />
                            {event.location}
                          </span>
                        ) : (
                          event.location
                        )}
                      </p>
                        <span className="inline-block px-2 py-1 bg-primary/10 border border-primary/20 text-xs font-mono">
                          {event.networkState}
                        </span>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              );
            })}

            {/* Link to Events Page - Mobile */}
            {showOnlyToday && (
              <div>
                <Link
                  href="/events"
                  className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  See all events -&gt;
                </Link>
              </div>
            )}

            {/* Blurred Tomorrow Event - Mobile */}
            {!showOnlyToday && hasTomorrowEvents && tomorrowEvents[0] && (
              <div className="space-y-2">
                <div className="filter blur-[2px] pointer-events-none opacity-50 select-none border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono text-muted-foreground">{tomorrowEvents[0].date}</div>
                      <div className="text-xs font-mono text-muted-foreground">{tomorrowEvents[0].time}</div>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 border border-border bg-muted">
                      {tomorrowEvents[0].type}
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-sm">{tomorrowEvents[0].title}</h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    {tomorrowEvents[0].location === 'Virtual' ? (
                      <span className="flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5 text-primary" />
                        {tomorrowEvents[0].location}
                      </span>
                    ) : (
                      tomorrowEvents[0].location
                    )}
                  </p>
                  <span className="inline-block px-2 py-1 bg-primary/10 border border-primary/20 text-xs font-mono">
                    {tomorrowEvents[0].networkState}
                  </span>
                </div>
                <div>
                  <Link
                    href="/events"
                    className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    See all events -&gt;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Timeline View */}
      {!isLoading && !error && events.length > 0 && viewMode === "gantt" && (
        <div className="border-2 border-border bg-card">
          {/* Timeline Header */}
          <div className="border-b-2 border-border bg-muted p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                [ EVENTS ]
              </h3>
              {!showOnlyToday && (
              <div ref={timelineDropdownRef} className="relative">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-muted-foreground">View:</label>
                  <button
                    onClick={() => setIsTimelineDropdownOpen(!isTimelineDropdownOpen)}
                    className="text-xs font-mono border border-border bg-background px-2 py-1 min-w-[80px] text-left flex items-center justify-between hover:bg-accent transition-colors"
                    aria-label="Timeline zoom level"
                  >
                    <span>{timelineZoomDays} {timelineZoomDays === 1 ? 'day' : 'days'}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${isTimelineDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Custom Dropdown */}
                {isTimelineDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-background border-2 border-border shadow-lg z-50 min-w-[80px]">
                    {[1, 3, 7, 14, 30, 60, 90].map((days) => (
                      <button
                        key={days}
                        onClick={() => {
                          setTimelineZoomDays(days);
                          setIsTimelineDropdownOpen(false);
                        }}
                        className={`w-full text-xs font-mono px-2 py-1 text-left hover:bg-accent transition-colors ${
                          timelineZoomDays === days ? 'bg-accent' : ''
                        }`}
                      >
                        {days} {days === 1 ? 'day' : 'days'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Timeline Legend */}
          <div className="border-b border-border bg-card p-4">
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              {(() => {
                // Count events per network state
                const networkStateCounts = filteredAndSortedEvents.reduce((counts, event) => {
                  counts[event.networkState] = (counts[event.networkState] || 0) + 1;
                  return counts;
                }, {} as Record<string, number>);

                // Sort by event count (descending) then by name
                const sortedNetworkStates = Object.keys(networkStateCounts).sort((a, b) => {
                  const countDiff = networkStateCounts[b] - networkStateCounts[a];
                  return countDiff !== 0 ? countDiff : a.localeCompare(b);
                });

                return sortedNetworkStates.map(networkState => (
                  <div key={networkState} className="flex items-center gap-1">
                    <div className={`w-3 h-3 ${getNetworkStateColor(networkState)}`}></div>
                    <span>{networkState}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {(() => {
            // Group events by date
            const eventsByDate = filteredAndSortedEvents.reduce((acc, event) => {
              if (!acc[event.date]) {
                acc[event.date] = [];
              }
              acc[event.date].push(event);
              return acc;
            }, {} as Record<string, typeof filteredAndSortedEvents>);

            // Get sorted unique dates
            const sortedDates = Object.keys(eventsByDate).sort();

            // Calculate date range - show ALL upcoming events
            // Get today's date in local timezone as YYYY-MM-DD string
            const now = new Date();
            const todayStr = now.getFullYear() + '-' +
              String(now.getMonth() + 1).padStart(2, '0') + '-' +
              String(now.getDate()).padStart(2, '0');

            // Find the last event date string
            const lastEventDateStr = filteredAndSortedEvents.length > 0
              ? filteredAndSortedEvents.reduce((latest, e) => e.date > latest ? e.date : latest, todayStr)
              : todayStr;

            // Generate date columns as YYYY-MM-DD strings from today to last event
            const dateColumns: string[] = [];
            const currentDate = new Date(todayStr + 'T00:00:00');
            const endDate = new Date(lastEventDateStr + 'T00:00:00');

            while (currentDate <= endDate) {
              const dateStr = currentDate.getFullYear() + '-' +
                String(currentDate.getMonth() + 1).padStart(2, '0') + '-' +
                String(currentDate.getDate()).padStart(2, '0');
              dateColumns.push(dateStr);
              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Calculate column width based on zoom level
            const getColumnWidth = (zoomDays: number): number => {
              switch (zoomDays) {
                case 1: return 800;  // Extra wide for detailed view
                case 3: return 350;  // Very wide
                case 7: return 180;  // Wide
                case 14: return 120; // Medium
                case 30: return 80;  // Standard
                case 60: return 60;  // Compact
                case 90: return 40;  // Very compact
                default: return 80;
              }
            };

            const columnWidth = getColumnWidth(timelineZoomDays);

            return (
              <>
                {/* Desktop Timeline Grid */}
                <div className="hidden md:block p-4 overflow-x-auto">
                  <div className={`${showOnlyToday ? 'max-w-3xl mx-auto' : 'min-w-[800px]'}`}>
                    <div className="space-y-6">
                      {/* Date Header */}
                      <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${dateColumns.length}, ${columnWidth}px)` }}>
                        <div className="text-xs font-mono font-bold text-muted-foreground"></div>
                        {dateColumns.map((dateStr, idx) => {
                          const date = new Date(dateStr + 'T00:00:00');
                          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayOfMonth = date.getDate();
                          const isToday = dateStr === todayStr;
                          const hasEvents = eventsByDate[dateStr];

                          return (
                            <div
                              key={idx}
                              className={`text-center border-l border-border p-1 ${isToday ? 'bg-primary/10' : ''} ${hasEvents ? 'font-bold' : ''}`}
                              suppressHydrationWarning
                            >
                              <div className="text-xs font-mono">{dayOfWeek}</div>
                              <div className={`text-xs font-mono ${isToday ? 'text-primary' : 'text-muted-foreground'}`} suppressHydrationWarning>
                                {dayOfMonth}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 24-hour Timeline Grid */}
                      {Array.from({ length: 24 }, (_, hour) => {
                        // Get events for this hour across all dates
                        const hourEvents = sortedDates.flatMap(date => {
                          const dateEvents = eventsByDate[date] || [];
                          return dateEvents
                            .filter(event => {
                              const eventStartHour = Math.floor(getEventStartHour(event));
                              const eventEndHour = Math.floor(getEventStartHour(event) + getEventDuration(event));
                              return hour >= eventStartHour && hour < eventEndHour;
                            })
                            .map(event => ({ ...event, date }));
                        });

                        // Only show rows with events
                        if (hourEvents.length === 0) return null;

                        return (
                          <div key={hour} className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${dateColumns.length}, ${columnWidth}px)` }}>
                            {/* Hour Label */}
                            <div className="text-xs font-mono text-muted-foreground flex items-center">
                              {hour.toString().padStart(2, '0')}:00
                            </div>

                            {/* Date Columns */}
                            {dateColumns.map((dateStr, idx) => {
                              const dayEvents = (eventsByDate[dateStr] || []).filter(event => {
                                const eventStartHour = Math.floor(getEventStartHour(event));
                                const eventEndHour = Math.floor(getEventStartHour(event) + getEventDuration(event));
                                return hour >= eventStartHour && hour < eventEndHour;
                              });

                              // Calculate columns for overlapping events in this hour
                              const eventsStartingThisHour = dayEvents.filter(event => Math.floor(getEventStartHour(event)) === hour);
                              const eventColumns: number[] = [];
                              const eventsWithCols = eventsStartingThisHour.map((event, eventIdx) => {
                                const startTime = getEventStartHour(event);
                                const endTime = startTime + getEventDuration(event);

                                let column = 0;
                                const usedColumns = new Set<number>();

                                // Check for overlaps with previously processed events
                                for (let i = 0; i < eventIdx; i++) {
                                  const otherEvent = eventsStartingThisHour[i];
                                  const otherStart = getEventStartHour(otherEvent);
                                  const otherEnd = otherStart + getEventDuration(otherEvent);

                                  if (startTime < otherEnd && endTime > otherStart) {
                                    usedColumns.add(eventColumns[i]);
                                  }
                                }

                                while (usedColumns.has(column)) {
                                  column++;
                                }

                                eventColumns.push(column);
                                return { event, column };
                              });

                              const maxCols = eventsStartingThisHour.length > 0 ? Math.max(1, ...eventColumns.map(c => c + 1)) : 1;

                              return (
                                <div
                                  key={idx}
                                  className="relative min-h-[60px] border-l border-t border-border bg-muted/20"
                                >
                                  {eventsWithCols.map(({ event, column }, eventIdx) => {
                                    const startHour = getEventStartHour(event);
                                    const duration = getEventDuration(event);

                                    const heightInPx = Math.max(40, duration * 60);
                                    const topOffset = ((startHour % 1) * 60);

                                    // Calculate column positioning
                                    const columnWidth = 100 / maxCols;
                                    const leftPercent = column * columnWidth;

                                    return (
                                      <div
                                        key={eventIdx}
                                        className={`absolute ${getNetworkStateColor(event.networkState)} rounded border border-border cursor-pointer hover:opacity-80 transition-all hover:z-10 overflow-hidden group`}
                                        style={{
                                          top: `${topOffset}px`,
                                          height: `${heightInPx}px`,
                                          left: `${leftPercent}%`,
                                          width: `calc(${columnWidth}% - 2px)`,
                                        }}
                                        onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                        title={`${event.title}\n${event.time}\n${event.location}\n${event.networkState}`}
                                      >
                                        <div className="p-1 text-white text-[10px] font-mono leading-tight h-full overflow-hidden">
                                          <div className="font-bold truncate">{event.title}</div>
                                          <div className="opacity-90 truncate">{event.time}</div>
                                          <div className="opacity-75 truncate text-[9px]">{event.networkState}</div>
                                        </div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-20 w-64 p-2 bg-popover border-2 border-border text-popover-foreground text-xs font-mono shadow-lg">
                                          <div className="font-bold mb-1">{event.title}</div>
                                          <div className="space-y-0.5 text-[10px]">
                                            <div>📅 {event.date}</div>
                                            <div>🕐 {event.time}</div>
                                            <div>📍 {event.location}</div>
                                            <div>🌐 {event.networkState}</div>
                                            <div>🏷️ {event.type}</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Empty State */}
                      {filteredAndSortedEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                          No events found in the selected date range
                        </div>
                      )}

                      {/* Link to Events Page - Desktop Timeline */}
                      {showOnlyToday && (
                        <div className="mt-6">
                          <Link
                            href="/events"
                            className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                          >
                            See all events -&gt;
                          </Link>
                        </div>
                      )}

                      {/* Blurred Tomorrow Event - Desktop Timeline */}
                      {!showOnlyToday && hasTomorrowEvents && tomorrowEvents[0] && (
                        <div className="mt-6 space-y-2">
                          <div className="filter blur-[2px] pointer-events-none opacity-50 select-none border-2 border-border p-4 bg-card space-y-2">
                            <div className="font-mono font-bold text-sm">{tomorrowEvents[0].title}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div>
                                <span className="text-muted-foreground">Date:</span> {tomorrowEvents[0].date}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time:</span> {tomorrowEvents[0].time}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span> {tomorrowEvents[0].location}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type:</span> {tomorrowEvents[0].type}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link
                              href="/events"
                              className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                              See all events -&gt;
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline View */}
                <div className="md:hidden p-4 overflow-x-auto overscroll-x-contain touch-pan-x">
                  <div className={`${showOnlyToday ? 'max-w-xl mx-auto' : 'min-w-[800px]'}`}>
                    <div className="space-y-6">
                      {/* Date Header */}
                      <div className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(${dateColumns.length}, ${Math.max(60, columnWidth * 0.75)}px)` }}>
                        <div className="text-xs font-mono font-bold text-muted-foreground"></div>
                        {dateColumns.map((dateStr, idx) => {
                          const date = new Date(dateStr + 'T00:00:00');
                          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                          const dayOfMonth = date.getDate();
                          const isToday = dateStr === todayStr;
                          const hasEvents = eventsByDate[dateStr];

                          return (
                            <div
                              key={idx}
                              className={`text-center border-l border-border p-1 ${isToday ? 'bg-primary/10' : ''} ${hasEvents ? 'font-bold' : ''}`}
                              suppressHydrationWarning
                            >
                              <div className="text-xs font-mono">{dayOfWeek}</div>
                              <div className={`text-xs font-mono ${isToday ? 'text-primary' : 'text-muted-foreground'}`} suppressHydrationWarning>
                                {dayOfMonth}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 24-hour Timeline Grid */}
                      {Array.from({ length: 24 }, (_, hour) => {
                        // Get events for this hour across all dates
                        const hourEvents = sortedDates.flatMap(date => {
                          const dateEvents = eventsByDate[date] || [];
                          return dateEvents
                            .filter(event => {
                              const eventStartHour = Math.floor(getEventStartHour(event));
                              const eventEndHour = Math.floor(getEventStartHour(event) + getEventDuration(event));
                              return hour >= eventStartHour && hour < eventEndHour;
                            })
                            .map(event => ({ ...event, date }));
                        });

                        // Only show rows with events
                        if (hourEvents.length === 0) return null;

                        return (
                          <div key={hour} className="grid gap-1" style={{ gridTemplateColumns: `100px repeat(${dateColumns.length}, ${Math.max(60, columnWidth * 0.75)}px)` }}>
                            {/* Hour Label */}
                            <div className="text-xs font-mono text-muted-foreground flex items-center">
                              {hour.toString().padStart(2, '0')}:00
                            </div>

                            {/* Date Columns */}
                            {dateColumns.map((dateStr, idx) => {
                              const dayEvents = (eventsByDate[dateStr] || []).filter(event => {
                                const eventStartHour = Math.floor(getEventStartHour(event));
                                const eventEndHour = Math.floor(getEventStartHour(event) + getEventDuration(event));
                                return hour >= eventStartHour && hour < eventEndHour;
                              });

                              // Calculate columns for overlapping events in this hour
                              const eventsStartingThisHour = dayEvents.filter(event => Math.floor(getEventStartHour(event)) === hour);
                              const eventColumns: number[] = [];
                              const eventsWithCols = eventsStartingThisHour.map((event, eventIdx) => {
                                const startTime = getEventStartHour(event);
                                const endTime = startTime + getEventDuration(event);

                                let column = 0;
                                const usedColumns = new Set<number>();

                                // Check for overlaps with previously processed events
                                for (let i = 0; i < eventIdx; i++) {
                                  const otherEvent = eventsStartingThisHour[i];
                                  const otherStart = getEventStartHour(otherEvent);
                                  const otherEnd = otherStart + getEventDuration(otherEvent);

                                  if (startTime < otherEnd && endTime > otherStart) {
                                    usedColumns.add(eventColumns[i]);
                                  }
                                }

                                while (usedColumns.has(column)) {
                                  column++;
                                }

                                eventColumns.push(column);
                                return { event, column };
                              });

                              const maxCols = eventsStartingThisHour.length > 0 ? Math.max(1, ...eventColumns.map(c => c + 1)) : 1;

                              return (
                                <div
                                  key={idx}
                                  className="relative min-h-[40px] border-l border-t border-border bg-muted/20"
                                >
                                  {eventsWithCols.map(({ event, column }, eventIdx) => {
                                    const startHour = getEventStartHour(event);
                                    const duration = getEventDuration(event);

                                    const heightInPx = Math.max(30, duration * 40);
                                    const topOffset = ((startHour % 1) * 40);

                                    // Calculate column positioning
                                    const columnWidth = 100 / maxCols;
                                    const leftPercent = column * columnWidth;

                                    return (
                                      <div
                                        key={eventIdx}
                                        className={`absolute ${getNetworkStateColor(event.networkState)} rounded border border-border cursor-pointer hover:opacity-80 transition-all hover:z-10 overflow-hidden group`}
                                        style={{
                                          top: `${topOffset}px`,
                                          height: `${heightInPx}px`,
                                          left: `${leftPercent}%`,
                                          width: `calc(${columnWidth}% - 2px)`,
                                        }}
                                        onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                        title={`${event.title}\n${event.time}\n${event.location}\n${event.networkState}`}
                                      >
                                        <div className="p-1 text-white text-[9px] font-mono leading-tight h-full overflow-hidden">
                                          <div className="font-bold truncate">{event.title}</div>
                                          <div className="opacity-90 truncate text-[8px]">{event.time}</div>
                                          <div className="opacity-75 truncate text-[7px]">{event.networkState}</div>
                                        </div>

                                        {/* Tooltip on hover */}
                                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block z-20 w-48 p-2 bg-popover border-2 border-border text-popover-foreground text-xs font-mono shadow-lg">
                                          <div className="font-bold mb-1">{event.title}</div>
                                          <div className="space-y-0.5 text-[10px]">
                                            <div>📅 {event.date}</div>
                                            <div>🕐 {event.time}</div>
                                            <div>📍 {event.location}</div>
                                            <div>🌐 {event.networkState}</div>
                                            <div>🏷️ {event.type}</div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Empty State */}
                      {filteredAndSortedEvents.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                          No events found in the selected date range
                        </div>
                      )}

                      {/* Link to Events Page - Mobile Timeline */}
                      {showOnlyToday && (
                        <div className="mt-6">
                          <Link
                            href="/events"
                            className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                          >
                            See all events -&gt;
                          </Link>
                        </div>
                      )}

                      {/* Blurred Tomorrow Event - Mobile Timeline */}
                      {!showOnlyToday && hasTomorrowEvents && tomorrowEvents[0] && (
                        <div className="mt-6 space-y-2">
                          <div className="filter blur-[2px] pointer-events-none opacity-50 select-none border-2 border-border p-4 bg-card space-y-2">
                            <div className="font-mono font-bold text-sm">{tomorrowEvents[0].title}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div>
                                <span className="text-muted-foreground">Date:</span> {tomorrowEvents[0].date}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Time:</span> {tomorrowEvents[0].time}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Location:</span> {tomorrowEvents[0].location}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Type:</span> {tomorrowEvents[0].type}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link
                              href="/events"
                              className="font-mono text-xs underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                              See all events -&gt;
                            </Link>
                          </div>
                        </div>
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
