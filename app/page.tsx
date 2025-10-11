"use client";

import { Calendar, TrendingUp, Users, ExternalLink, ArrowUpDown, ChevronDown, ChevronUp, MapPin, Tag, Network, Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
  { date: "2025-11-04", time: "06:00 – 09:00", title: "[TogETHer] Explore Chiang Mai’s Most Beautiful Hiking Trail!", location: "Chiang Mai, Thailand", networkState: "StarShare", type: "Hike", url: "https://app.sola.day/event/detail/11661" },

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
  { date: "2025-10-14", time: "9:30 PM", title: "decoding VC and how you can raise your first round", location: "Forest City, Malaysia", networkState: "Network School", type: "Discussion", url: "https://lu.ma/ns" },
  { date: "2025-10-17", time: "9:00 AM – 9:00 PM", title: "Ârc: Welcome Home at The Network State", location: "Forest City, Malaysiaa", networkState: "Network School", type: "Pop-Up", url: "https://luma.com/arc-ns" }
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
  const filtersRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close all filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setAllFiltersOpen(false);
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
        <div className="w-full flex justify-center md:justify-end">
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
        <div className="flex justify-end">
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

      {/* Events Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            [ UPCOMING EVENTS ]
          </h2>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="opacity-60">
              Listing {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'}
            </span>
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

        {/* Desktop Table */}
        <div className="hidden md:block space-y-6">
          {groupOrder.map(groupLabel => {
            const groupEvents = groupedEvents[groupLabel];
            if (!groupEvents || groupEvents.length === 0) return null;

            return (
              <div key={groupLabel} className="overflow-x-auto border-2 border-border">
                <table className="w-full font-mono text-sm">
                  <thead>
                    <tr className="bg-muted border-b-2 border-border">
                      <th colSpan={5} className="text-left p-4">
                        <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          [ {groupLabel.toUpperCase()} ]
                        </h3>
                      </th>
                    </tr>
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
                        className="text-left p-4 font-bold cursor-pointer hover:bg-accent transition-colors"
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
                      {groupEvents.map((event, index) => (
                        <tr
                          key={index}
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
                          <td className="p-4">
                            <span className="text-muted-foreground text-xs">
                              {event.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {groupOrder.map(groupLabel => {
            const groupEvents = groupedEvents[groupLabel];
            if (!groupEvents || groupEvents.length === 0) return null;

            return (
              <div key={groupLabel} className="space-y-2">
                <div className="border-2 border-border bg-muted p-3">
                  <h3 className="font-mono font-bold text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    [ {groupLabel.toUpperCase()} ]
                  </h3>
                </div>
                <div className="space-y-4">
                  {groupEvents.map((event, index) => (
                    <div
                      key={index}
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
              </div>
            );
          })}
        </div>
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
