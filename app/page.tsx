"use client";

import { Calendar, TrendingUp, Users, ExternalLink, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Tag, Network, Search, BarChart3, Table, Monitor } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { getEvents, getPopupCities } from "@/lib/actions/events";
import type { UIEvent, PopupCity } from "@/lib/types/events";

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

type SortField = "date" | "event" | "location" | "networkState" | "type";
type SortDirection = "asc" | "desc";

export default function Home() {
  // Database state
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [popupEvents, setPopupEvents] = useState<PopupCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [timelineZoomDays, setTimelineZoomDays] = useState<number>(7);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState<boolean>(false);
  const [popupViewMode, setPopupViewMode] = useState<"table" | "gantt">("gantt");
  const [popupZoomDays, setPopupZoomDays] = useState<number>(365);
  const [isPopupDropdownOpen, setIsPopupDropdownOpen] = useState<boolean>(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const timelineDropdownRef = useRef<HTMLDivElement>(null);
  const popupDropdownRef = useRef<HTMLDivElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle click outside to close all filters and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking the clear button
      if (clearButtonRef.current && clearButtonRef.current.contains(event.target as Node)) {
        return;
      }
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setAllFiltersOpen(false);
      }
      if (timelineDropdownRef.current && !timelineDropdownRef.current.contains(event.target as Node)) {
        setIsTimelineDropdownOpen(false);
      }
      if (popupDropdownRef.current && !popupDropdownRef.current.contains(event.target as Node)) {
        setIsPopupDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
      case "upcoming": {
        // Show all events from today onwards
        return { start: today, end: new Date("2099-12-31") };
      }
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
        // Show all events regardless of date
        return null;
      default:
        return null;
    }
  };

  // Get unique values for filters (filter out null/undefined/empty)
  const uniqueNetworkStates = Array.from(
    new Set(events.map(e => e.networkState).filter(Boolean))
  ).sort();
  const uniqueTypes = Array.from(
    new Set(events.map(e => e.type).filter(Boolean))
  ).sort();
  
  // Create locations list (includes "Virtual" from event.location and countries)
  const uniqueLocations = Array.from(
    new Set([
      // Add "Virtual" if any events have it as location
      ...events.filter(e => e.location === 'Virtual').map(() => 'Virtual'),
      // Add all countries
      ...events.map(e => e.country).filter(c => c && c !== 'Unknown')
    ])
  ).sort((a, b) => {
    // Always put "Virtual" first
    if (a === 'Virtual') return -1;
    if (b === 'Virtual') return 1;
    return a.localeCompare(b);
  });

  // Filter lists based on search (with null safety)
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

  const filteredAndSortedEvents = [...events]
    .filter(event => {
      // Date range filter
      if (selectedDateRange) {
        const dateRange = getDateRange(selectedDateRange);
        if (dateRange) {
          const eventDate = new Date(event.date);
          if (eventDate < dateRange.start || eventDate > dateRange.end) {
            return false;
          }
        }
      }

      if (selectedNetworkStates.length > 0 && !selectedNetworkStates.includes(event.networkState)) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
        return false;
      }
      // Location filter: check both "Virtual" location and country
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
          // Prioritize "Virtual" at the top (or bottom depending on sort direction)
          if (a.location === "Virtual" && b.location !== "Virtual") {
            compareValue = -1; // Virtual comes first
          } else if (a.location !== "Virtual" && b.location === "Virtual") {
            compareValue = 1; // Virtual comes first
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

  // Define the order of groups
  const groupOrder = ["Today", "Tomorrow", "This Week", "Later"];

  // Gantt chart helper functions
  const getEventDuration = (event: typeof events[0]) => {
    // Parse time range (e.g., "6:30 PM – 9:00 PM" or "10:00 AM – 12:00 PM")
    const timeMatch = event.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?\s*[–-]\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!timeMatch) return 2; // Default 2 hours if can't parse
    
    const [, startHour, startMin = "00", startPeriod, endHour, endMin = "00", endPeriod] = timeMatch;
    
    let startTime = parseInt(startHour) + (startMin ? parseInt(startMin) / 60 : 0);
    let endTime = parseInt(endHour) + (endMin ? parseInt(endMin) / 60 : 0);
    
    // Convert to 24-hour format
    if (startPeriod?.toUpperCase() === 'PM' && startTime < 12) startTime += 12;
    if (endPeriod?.toUpperCase() === 'PM' && endTime < 12) endTime += 12;
    if (startPeriod?.toUpperCase() === 'AM' && startTime === 12) startTime = 0;
    if (endPeriod?.toUpperCase() === 'AM' && endTime === 12) endTime = 0;
    
    return Math.max(1, endTime - startTime); // Minimum 1 hour
  };

  const getEventStartHour = (event: typeof events[0]) => {
    const timeMatch = event.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
    if (!timeMatch) return 9; // Default 9 AM
    
    const [, hour, min = "00", period] = timeMatch;
    let time = parseInt(hour) + (min ? parseInt(min) / 60 : 0);
    
    if (period?.toUpperCase() === 'PM' && time < 12) time += 12;
    if (period?.toUpperCase() === 'AM' && time === 12) time = 0;
    
    return time;
  };

  // Colors from the original hardcoded popup cities (mix of gradients and solid colors)
  const popupCityColors = [
    'bg-gradient-to-r from-indigo-700 to-purple-600',  // Invisible Garden Argentina
    'bg-gradient-to-r from-green-700 to-emerald-600',  // Edge City Patagonia
    'bg-orange-600',                                    // Próspera
    'bg-rose-600',                                      // zanzalu
    'bg-slate-600',                                     // Infinita City / Community
    'bg-gradient-to-r from-cyan-700 to-blue-500',      // 4Seas Community
  ];

  // Get color for popup city by index
  const getPopupCityColor = (index: number) => {
    return popupCityColors[index % popupCityColors.length];
  };

  const getNetworkStateColor = (networkState: string) => {
    const colors: Record<string, string> = {
      // High contrast color palette for better visual distinction
      'edgpatagonia': 'bg-emerald-500',
      'Network School': 'bg-blue-600',
      '4Seas': 'bg-cyan-500',
      'Próspera': 'bg-orange-500',
      'INFINITA': 'bg-fuchsia-500',
      'Invisible Garden Argentina': 'bg-lime-500',
      'Software Zuzalu': 'bg-violet-600',
      'Tomek ⚡ K': 'bg-amber-500',
      'Andrea S.': 'bg-rose-500',
      // Legacy network states (in case they appear)
      'StarShare': 'bg-purple-600',
      'ZuCity Japan': 'bg-pink-600',
      'ShanhaiWoo': 'bg-red-600',
      'Edge City': 'bg-teal-600',
      'ETH Safari': 'bg-yellow-500',
      'Web3 META Hub': 'bg-indigo-600',
      'ShanhaiWoo · Singapore': 'bg-red-500',
      'east2046festival': 'bg-purple-500',
      'zanzalu': 'bg-pink-500',
      'Infinita City / Community': 'bg-slate-600',
    };
    return colors[networkState] || 'bg-gray-600';
  };

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
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            [ POP-UP]
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="opacity-60">
                Listing {popupEvents.length} {popupEvents.length === 1 ? 'event' : 'events'}
              </span>
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

        {/* Table View */}
        {popupViewMode === "table" && (
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
                    {popupEvents.map((event, index) => (
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
              {popupEvents.map((event, index) => (
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
          </>
        )}

        {/* Timeline View */}
        {popupViewMode === "gantt" && (
          <div className="border-2 border-border bg-card">
            {/* Timeline Header */}
            <div className="border-b-2 border-border bg-muted p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  [ POP-UP ]
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
                {popupEvents.map((event, index) => (
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
                        {popupEvents.map((event, eventIdx) => {
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
                        {popupEvents.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                            No pop-up events found
                          </div>
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
                        {popupEvents.map((event, eventIdx) => {
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
                        {popupEvents.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                            No pop-up events found
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

      {/* Events Table */}
      <section id="upcoming-events" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            [ UPCOMING EVENTS ]
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
              e.stopPropagation(); // Prevent event bubbling to parent elements
              setSelectedNetworkStates([]);
              setSelectedTypes([]);
              setSelectedCountries([]);
              setSelectedDateRange("upcoming");
              setCustomStartDate("");
              setCustomEndDate("");
              setAllFiltersOpen(false); // Close the filters dropdown
            }}
            className="font-mono text-xs border-2 border-border px-4 py-2 bg-card hover:bg-accent transition-colors"
          >
            [ CLEAR ALL FILTERS ]
          </button>
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
              
              // Debug: log events grouped by date
              if (typeof window !== 'undefined') {
                console.log('Timeline Debug - Events by date:', eventsByDate);
                console.log('Timeline Debug - Sorted dates:', sortedDates);
              }

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
              
              // Debug: log date columns
              if (typeof window !== 'undefined') {
                console.log('Timeline Debug - Date columns:', dateColumns);
                console.log('Timeline Debug - Today:', todayStr);
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
                    <div className="min-w-[800px]">
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
                      </div>
                    </div>
                  </div>

                  {/* Mobile Timeline View */}
                  <div className="md:hidden p-4 overflow-x-auto overscroll-x-contain touch-pan-x">
                    <div className="min-w-[800px]">
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
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </section>

    </div>
  );
}
