"use client";

import { Calendar, TrendingUp, Users, ExternalLink, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Tag, Network, Search, BarChart3, Table } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

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


const events = [
  // 🌿 Edge City Patagonia — Argentina
  { date: "2025-10-19", time: "6:30 PM – 9:00 PM", title: "Opening Ceremony", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16088" },
  { date: "2025-10-20", time: "7:00 AM – 8:00 AM", title: "Run Club", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16093" },
  { date: "2025-10-20", time: "8:00 AM – 9:00 AM", title: "Yoga", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16167" },
  { date: "2025-10-20", time: "10:00 AM – 12:00 PM", title: "Pomodoro Deepwork Session (Murmur Experiment)", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16114" },
  { date: "2025-10-21", time: "8:00 AM – 9:00 AM", title: "Yoga", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16171" },
  { date: "2025-10-21", time: "10:00 AM – 12:00 PM", title: "Pomodoro Deepwork Session (Murmur Experiment)", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16115" },
  { date: "2025-10-22", time: "7:00 AM – 8:00 AM", title: "Run Club", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16097" },
  { date: "2025-10-22", time: "7:15 AM – 9:00 AM", title: "Digital Detox Hike", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16140" },
  { date: "2025-10-22", time: "8:00 AM – 9:00 AM", title: "Yoga", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16175" },
  { date: "2025-10-22", time: "10:00 AM – 12:00 PM", title: "Pomodoro Deepwork Session (Murmur Experiment)", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16116" },
  { date: "2025-10-22", time: "14:00 – 15:00", title: "Funding \"woo woo\" ventures", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Workshop", url: "https://app.sola.day/event/detail/16359" },
  { date: "2025-11-10", time: "10:00 AM – 12:00 PM", title: "Pomodoro Deepwork Session (Murmur Experiment)", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Deepwork", url: "https://app.sola.day/event/detail/16135" },
  { date: "2025-11-04", time: "18:45 – 20:00", title: "Psychedelic Movie Screening", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Screening", url: "https://app.sola.day/event/detail/16195" },
  { date: "2025-11-06", time: "19:00 – 20:00", title: "Yoga Session", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Yoga", url: "https://app.sola.day/event/detail/16249" },
  { date: "2025-11-04", time: "19:00 – 20:00", title: "Yoga Session", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Yoga", url: "https://app.sola.day/event/detail/16248" },

  // 🌏 Chiang Mai — Thailand
  { date: "2025-10-25", time: "10:00 – 12:00", title: "AI ENGINEERS MEETUP WEEKLY CHIANG MAI", location: "Chiang Mai, Thailand", networkState: "4Seas Community", type: "Meetup", url: "https://app.sola.day/event/detail/16278" },

  // 🧘‍♀️ Network School — Forest City, Malaysia (Luma)
  { date: "2025-10-11", time: "10:00 PM", title: "Morning Meditation", location: "Forest City, Malaysia", networkState: "Network School", type: "Meditation", url: "https://lu.ma/ns" },
  { date: "2025-10-11", time: "11:00 PM", title: "Learnathon: ML Foundations", location: "Forest City, Malaysia", networkState: "Network School", type: "Workshop", url: "https://lu.ma/ns" },
  { date: "2025-10-11", time: "2:00 AM – 5:00 AM", title: "NS Badminton Club (NSBC)", location: "Forest City, Malaysia", networkState: "Network School", type: "Sports", url: "https://lu.ma/ns" },
  { date: "2025-10-11", time: "2:30 AM – 5:30 AM", title: "Beach Volleyball + Cold Plunge", location: "Forest City, Malaysia", networkState: "Network School", type: "Sports", url: "https://lu.ma/ns" },
  { date: "2025-10-11", time: "5:00 AM – 8:00 AM", title: "Vipassana Meditation", location: "Forest City, Malaysia", networkState: "Network School", type: "Meditation", url: "https://lu.ma/ns" },
  { date: "2025-10-12", time: "8:00 PM", title: "NS October Mixer", location: "Forest City, Malaysia", networkState: "Network School", type: "Mixer", url: "https://lu.ma/ns" },
  { date: "2025-10-12", time: "1:00 AM – 4:00 AM", title: "Commons: Opening Ceremony", location: "Forest City, Malaysia", networkState: "Network School", type: "Ceremony", url: "https://lu.ma/ns" },
  { date: "2025-10-12", time: "5:00 AM – 8:00 AM", title: "Vipassana Meditation", location: "Forest City, Malaysia", networkState: "Network School", type: "Meditation", url: "https://lu.ma/ns" },
  { date: "2025-10-13", time: "5:20 PM", title: "Morning Meditation", location: "Forest City, Malaysia", networkState: "Network School", type: "Meditation", url: "https://lu.ma/ns" },
  { date: "2025-10-13", time: "1:00 AM – 4:00 AM", title: "Nomad Tax Reality Check – Myths, Risks & Real Solutions", location: "Forest City, Malaysia", networkState: "Network School", type: "Discussion", url: "https://lu.ma/ns" },
  { date: "2025-10-14", time: "9:31 PM", title: "decoding VC and how you can raise your first round", location: "Forest City, Malaysia", networkState: "Network School", type: "Discussion", url: "https://lu.ma/ns" },
  { date: "2025-10-17", time: "9:00 AM – 9:00 PM", title: "Ârc: Welcome Home at The Network State", location: "Forest City, Malaysiaa", networkState: "Network School", type: "Pop-Up", url: "https://luma.com/arc-ns" }
]

const popupEvents = [
  { date: "2025-10-27", endDate: "2025-11-23", title: "Invisible Garden Argentina", location: "Buenos Aires, Argentina", networkState: "Invisible Garden Argentina", url: "https://app.sola.day/event/invisiblegardenar" },
  { date: "2025-10-18", endDate: "2025-11-15", title: "Edge City Patagonia", location: "San Martín, Argentina", networkState: "Edge City Patagonia", url: "https://app.sola.day/event/edgepatagonia" },
  { date: "2025-08-28", endDate: "2025-12-31", title: "Próspera", location: "Próspera, Roatán", networkState: "Próspera", url: "https://app.sola.day/event/prospera" },
  { date: "2025-07-19", endDate: "2025-08-01", title: "Zanzalu 2", location: "Zanzalu", networkState: "zanzalu", url: "https://app.sola.day/event/zanzalu" },
  { date: "2025-01-09", endDate: "2025-12-31", title: "INFINITA", location: "Próspera ZEDE", networkState: "Infinita City / Community", url: "https://app.sola.day/event/infinita" },
  { date: "2025-11-01", endDate: "2025-12-31", title: "4Seas", location: "Chiangmai, Thailand", networkState: "4Seas Community", url: "https://app.sola.day/event/4seas" }
]



type SortField = "date" | "event" | "location" | "networkState" | "type";
type SortDirection = "asc" | "desc";

export default function Home() {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedNetworkStates, setSelectedNetworkStates] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("upcoming");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [networkStateSearch, setNetworkStateSearch] = useState<string>("");
  const [typeSearch, setTypeSearch] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [allFiltersOpen, setAllFiltersOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"table" | "gantt">("table");
  const [timelineZoomDays, setTimelineZoomDays] = useState<number>(30);
  const [isTimelineDropdownOpen, setIsTimelineDropdownOpen] = useState<boolean>(false);
  const [popupViewMode, setPopupViewMode] = useState<"table" | "gantt">("gantt");
  const [popupZoomDays, setPopupZoomDays] = useState<number>(365);
  const [isPopupDropdownOpen, setIsPopupDropdownOpen] = useState<boolean>(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const timelineDropdownRef = useRef<HTMLDivElement>(null);
  const popupDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close all filters and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Get unique values for filters
  const uniqueNetworkStates = Array.from(new Set(events.map(e => e.networkState))).sort();
  const uniqueTypes = Array.from(new Set(events.map(e => e.type))).sort();
  const uniqueLocations = Array.from(new Set(events.map(e => e.location))).sort();

  // Filter lists based on search
  const filteredNetworkStates = uniqueNetworkStates.filter(ns =>
    ns.toLowerCase().includes(networkStateSearch.toLowerCase())
  );
  const filteredTypes = uniqueTypes.filter(type =>
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );
  const filteredLocations = uniqueLocations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
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
      if (selectedLocations.length > 0 && !selectedLocations.includes(event.location)) {
        return false;
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
          compareValue = a.location.localeCompare(b.location);
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

  const getNetworkStateColor = (networkState: string) => {
    const colors: Record<string, string> = {
      'Edge City Patagonia': 'bg-green-600',
      'Network School': 'bg-gray-600',
      '4Seas Community': 'bg-cyan-600',
      'StarShare': 'bg-purple-600',
      'ZuCity Japan': 'bg-pink-600',
      'Próspera': 'bg-orange-600',
      'ShanhaiWoo': 'bg-red-600',
      'Edge City': 'bg-emerald-600',
      'Invisible Garden Argentina': 'bg-indigo-600',
      'ETH Safari': 'bg-yellow-600',
      'Web3 META Hub': 'bg-teal-600',
      'ShanhaiWoo · Singapore': 'bg-red-500',
      'east2046festival': 'bg-violet-600',
      'zanzalu': 'bg-rose-600',
      'Infinita City / Community': 'bg-slate-600',
    };
    return colors[networkState] || 'bg-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4 text-left">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80"></pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ nsnodes.com ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-prose">
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
            className="h-auto max-w-full border-2 border-border"
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
                {(() => {
                  // Count events per network state
                  const networkStateCounts = popupEvents.reduce((counts, event) => {
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
              // Calculate date range - start from current month
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              // Find the latest date from all events
              const allDates = popupEvents.flatMap(event => [
                new Date(event.date), 
                new Date(event.endDate)
              ]);
              const latestDate = new Date(Math.max(...allDates.map(d => d.getTime())));
              
              // Start from current month
              const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              
              // Generate month columns (horizontal) from current month
              const monthColumns: Date[] = [];
              for (let d = new Date(startMonth); 
                   d <= latestDate; 
                   d.setMonth(d.getMonth() + 1)) {
                monthColumns.push(new Date(d));
              }

              // Generate week columns within each month
              const weekColumns: { month: Date; week: Date; weekEnd: Date }[] = [];
              monthColumns.forEach(month => {
                const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
                const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
                
                // Find first week of month
                const firstWeekStart = new Date(monthStart);
                firstWeekStart.setDate(firstWeekStart.getDate() - firstWeekStart.getDay());
                
                // Generate weeks for this month
                for (let weekStart = new Date(firstWeekStart); 
                     weekStart <= monthEnd; 
                     weekStart.setDate(weekStart.getDate() + 7)) {
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekEnd.getDate() + 6);
                  
                  weekColumns.push({
                    month: new Date(month),
                    week: new Date(weekStart),
                    weekEnd: new Date(weekEnd)
                  });
                }
              });

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

                            // Calculate week number
                            const getWeekNumber = (date: Date) => {
                              const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                              const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
                              return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                            };

                            const weekNumber = getWeekNumber(weekStart);

                            return (
                              <div
                                key={idx}
                                className={`text-center border-l border-border p-1 ${isCurrentWeek ? 'bg-primary/20' : isCurrentMonth ? 'bg-primary/10' : 'bg-muted/50'}`}
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
                                        className={`absolute ${getNetworkStateColor(event.networkState)} rounded border border-border cursor-pointer hover:opacity-80 transition-all hover:z-10 overflow-hidden group`}
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
                  <div className="md:hidden p-4 space-y-6">
                    {(() => {
                      // Sort popup events by start date
                      const sortedPopupEvents = [...popupEvents].sort((a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                      );

                      return sortedPopupEvents.map((event, idx) => {
                        const eventStart = new Date(event.date);
                        const eventEnd = new Date(event.endDate);
                        const dateLabel = eventStart.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });
                        const endDateLabel = eventEnd.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        });

                        // Calculate duration in days
                        const durationDays = Math.ceil((eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                          <div key={idx} className="border-2 border-border bg-card">
                            {/* Event Header */}
                            <div className="bg-muted border-b-2 border-border p-3">
                              <h4 className="font-mono font-bold text-sm">{event.title}</h4>
                              <div className="font-mono text-xs text-muted-foreground mt-1">
                                {event.networkState}
                              </div>
                            </div>

                            {/* Timeline Visual */}
                            <div className="p-3">
                              <div className="space-y-2">
                                {/* Date Range */}
                                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                                  <span>{dateLabel}</span>
                                  <span>{endDateLabel}</span>
                                </div>

                                {/* Timeline Bar */}
                                <div className="relative">
                                  <div className={`${getNetworkStateColor(event.networkState)} rounded border-2 border-border p-3 cursor-pointer hover:opacity-90 transition-opacity`}
                                    onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                  >
                                    <div className="text-white space-y-1">
                                      <div className="font-mono font-bold text-xs">
                                        {durationDays} {durationDays === 1 ? 'day' : 'days'}
                                      </div>
                                      <div className="font-mono text-[10px] opacity-90">
                                        📍 {event.location}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Duration Info */}
                                <div className="text-center text-[10px] font-mono text-muted-foreground">
                                  {event.date} → {event.endDate}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </section>

      {/* Events Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            [ UPCOMING EVENTS ]
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="opacity-60">
                Listing {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'}
              </span>
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
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Search locations..."
                    className="w-full pl-7 pr-2 py-1 text-xs font-mono border border-border bg-background"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {filteredLocations.map(location => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                        className="cursor-pointer"
                      />
                      <span className="text-xs font-mono">{location}</span>
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
        {(selectedNetworkStates.length > 0 || selectedTypes.length > 0 || selectedLocations.length > 0 || selectedDateRange !== "upcoming") && (
          <button
            type="button"
            onClick={() => {
              setSelectedNetworkStates([]);
              setSelectedTypes([]);
              setSelectedLocations([]);
              setSelectedDateRange("upcoming");
              setCustomStartDate("");
              setCustomEndDate("");
            }}
            className="font-mono text-xs border-2 border-border px-4 py-2 bg-card hover:bg-accent transition-colors"
          >
            [ CLEAR ALL FILTERS ]
          </button>
        )}

        {/* Table View */}
        {viewMode === "table" && (
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
                              <td className="p-4">{event.location}</td>
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
                          <p className="text-xs font-mono text-muted-foreground">{event.location}</p>
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
        {viewMode === "gantt" && (
          <div className="border-2 border-border bg-card">
            {/* Timeline Header */}
            <div className="border-b-2 border-border bg-muted p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  [ EVENT TIMELINE ]
                </h3>
                <div ref={timelineDropdownRef} className="relative">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-mono text-muted-foreground">View:</label>
                    <button
                      onClick={() => setIsTimelineDropdownOpen(!isTimelineDropdownOpen)}
                      className="text-xs font-mono border border-border bg-background px-2 py-1 min-w-[80px] text-left flex items-center justify-between hover:bg-accent transition-colors"
                      aria-label="Timeline zoom level"
                    >
                      <span>{timelineZoomDays} days</span>
                      <ChevronDown className={`h-3 w-3 transition-transform ${isTimelineDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {/* Custom Dropdown */}
                  {isTimelineDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-background border-2 border-border shadow-lg z-50 min-w-[80px]">
                      {[7, 14, 30, 60, 90].map((days) => (
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

              // Calculate date range
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const endDate = new Date(today);
              endDate.setDate(endDate.getDate() + timelineZoomDays);

              // Generate date columns for the timeline
              const dateColumns: Date[] = [];
              for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
                dateColumns.push(new Date(d));
              }

              return (
                <>
                  {/* Desktop Timeline Grid */}
                  <div className="hidden md:block p-4 overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="space-y-6">
                        {/* Date Header */}
                        <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${Math.min(dateColumns.length, 31)}, minmax(80px, 1fr))` }}>
                          <div className="text-xs font-mono font-bold text-muted-foreground"></div>
                          {dateColumns.slice(0, 31).map((date, idx) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                            const dayOfMonth = date.getDate();
                            const isToday = dateStr === today.toISOString().split('T')[0];
                            const hasEvents = eventsByDate[dateStr];

                            return (
                              <div
                                key={idx}
                                className={`text-center border-l border-border p-1 ${isToday ? 'bg-primary/10' : ''} ${hasEvents ? 'font-bold' : ''}`}
                              >
                                <div className="text-xs font-mono">{dayOfWeek}</div>
                                <div className={`text-xs font-mono ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
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
                            <div key={hour} className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${Math.min(dateColumns.length, 31)}, minmax(80px, 1fr))` }}>
                              {/* Hour Label */}
                              <div className="text-xs font-mono text-muted-foreground flex items-center">
                                {hour.toString().padStart(2, '0')}:00
                              </div>

                              {/* Date Columns */}
                              {dateColumns.slice(0, 31).map((date, idx) => {
                                const dateStr = date.toISOString().split('T')[0];
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
                  <div className="md:hidden p-4 space-y-6">
                    {sortedDates.map((date: string) => {
                      const dateEvents = eventsByDate[date] || [];
                      if (dateEvents.length === 0) return null;

                      const eventDate = new Date(date);
                      const dateLabel = eventDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      });

                      // Sort events by start time for this date
                      const sortedEvents = [...dateEvents].sort((a, b) => {
                        return getEventStartHour(a) - getEventStartHour(b);
                      });

                      // Calculate overlapping events and assign columns
                      const columns: number[] = [];
                      const eventsWithColumns = sortedEvents.map((event, idx) => {
                        const startTime = getEventStartHour(event);
                        const endTime = startTime + getEventDuration(event);

                        // Find overlapping events before this one
                        let column = 0;
                        const usedColumns = new Set<number>();

                        for (let i = 0; i < idx; i++) {
                          const otherEvent = sortedEvents[i];
                          const otherStart = getEventStartHour(otherEvent);
                          const otherEnd = otherStart + getEventDuration(otherEvent);

                          // Check if events overlap
                          if (startTime < otherEnd && endTime > otherStart) {
                            usedColumns.add(columns[i]);
                          }
                        }

                        // Find first available column
                        while (usedColumns.has(column)) {
                          column++;
                        }

                        columns.push(column);
                        return { event, column };
                      });

                      // Calculate max columns needed
                      const maxColumns = Math.max(1, ...columns.map(c => c + 1));

                      // Get the hour range for this day
                      const minHour = Math.floor(Math.min(...sortedEvents.map(e => getEventStartHour(e))));
                      const maxHour = Math.ceil(Math.max(...sortedEvents.map(e => getEventStartHour(e) + getEventDuration(e))));

                      return (
                        <div key={date} className="border-2 border-border bg-card">
                          {/* Date Header */}
                          <div className="bg-muted border-b-2 border-border p-3">
                            <h4 className="font-mono font-bold text-sm">{dateLabel}</h4>
                          </div>

                          {/* Timeline Grid */}
                          <div className="p-3">
                            <div className="relative">
                              {/* Hour markers and grid */}
                              {Array.from({ length: maxHour - minHour + 1 }, (_, i) => {
                                const hour = minHour + i;
                                return (
                                  <div key={hour} className="flex border-t border-border" style={{ height: '60px' }}>
                                    {/* Hour label */}
                                    <div className="w-12 flex-shrink-0 text-[10px] font-mono text-muted-foreground pt-1">
                                      {hour.toString().padStart(2, '0')}:00
                                    </div>
                                    {/* Grid line */}
                                    <div className="flex-1 bg-muted/20 relative"></div>
                                  </div>
                                );
                              })}

                              {/* Events overlay */}
                              <div className="absolute top-0 left-12 right-0 bottom-0">
                                {eventsWithColumns.map(({ event, column }, idx) => {
                                  const startHour = getEventStartHour(event);
                                  const duration = getEventDuration(event);
                                  const topPosition = (startHour - minHour) * 60;
                                  const height = duration * 60;

                                  // Calculate column width and position
                                  const columnWidth = 100 / maxColumns;
                                  const leftPercent = column * columnWidth;
                                  const widthPercent = columnWidth;

                                  return (
                                    <div
                                      key={idx}
                                      className={`absolute ${getNetworkStateColor(event.networkState)} rounded border-2 border-border cursor-pointer hover:opacity-90 transition-opacity overflow-hidden`}
                                      style={{
                                        top: `${topPosition}px`,
                                        height: `${Math.max(height, 40)}px`,
                                        left: `${leftPercent}%`,
                                        width: `calc(${widthPercent}% - 4px)`,
                                      }}
                                      onClick={() => window.open(event.url, '_blank', 'noopener,noreferrer')}
                                    >
                                      <div className="p-2 text-white h-full overflow-hidden">
                                        <div className="font-mono font-bold text-[11px] leading-tight truncate">
                                          {event.title}
                                        </div>
                                        <div className="font-mono text-[10px] opacity-90 truncate">
                                          {event.time}
                                        </div>
                                        <div className="font-mono text-[9px] opacity-75 truncate">
                                          {event.networkState}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center overflow-x-hidden">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80 max-w-full overflow-x-auto">
        </pre>
      </section>
      </div>
    </div>
  );
}
