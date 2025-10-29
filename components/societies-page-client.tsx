"use client";

import { Users, MapPin, ExternalLink, ChevronDown, ChevronUp, Calendar, MessageCircle, Globe, Tag, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SocietyDatabase } from "@/lib/data/societies-database";
import { SocietiesChartStats, SocietiesChartGraph } from "@/components/societies-chart";
import { getEvents } from "@/lib/actions/events";
import type { UIEvent } from "@/lib/types/events";
import { societyNamesMatch } from "@/lib/utils/society-matcher";
import { jobsDatabase } from "@/lib/data/jobs-database";

// Custom SVG icons
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

interface TransformedSociety {
  name: string;
  location: string;
  residents: string;
  growth: string;
  founded: string;
  description: string;
  website: string;
  x: string;
  discord: string;
  telegram: string | null;
  focus: string[];
  tier: number;
  type: string;
  application: string;
  icon?: string;
  category?: string;
}

interface SocietiesPageClientProps {
  societies: SocietyDatabase[];
}

// Helper functions to extract data from society
const getLocationFromSociety = (society: SocietyDatabase) => {
  // Use location from Airtable if available
  if (society.location) return society.location;
  
  // Extract location from URL or use a default based on type
  if (society.name.includes("Próspera")) return "Roatán, Honduras";
  if (society.name.includes("Network School") || society.name.includes("The Network School")) return "Forest City, Malaysia";
  if (society.name.includes("Edge City")) return "San Martín de los Andes, Argentina";
  if (society.name.includes("Liberland")) return "Liberland";
  if (society.name.includes("Sealand")) return "Sealand";
  if (society.name.includes("Montelibero")) return "Montenegro";
  if (society.name.includes("Cryptocity")) return "Margarita Island, Venezuela";
  if (society.name.includes("Forma City")) return "Various Locations";
  if (society.name.includes("Freeth'm")) return "Various Locations";
  if (society.name.includes("Atlas Island")) return "Floating City";
  if (society.name.includes("Zuzalu")) return "Montenegro";
  if (society.name.includes("Logos")) return "Online";
  if (society.name.includes("VDAO")) return "Decentralized";
  if (society.name.includes("Don't Die")) return "Global";
  if (society.name.includes("4seas.io")) return "Chiang Mai, Thailand";
  if (society.name.includes("Edge Esmeralda")) return "Costa Rica";
  if (society.name.includes("Infinita")) return "Próspera ZEDE, Honduras";
  if (society.name.includes("Ipê City")) return "Brazil";
  if (society.name.includes("build_republic")) return "Decentralized";
  
  // Default based on type
  if (society.type === "Physical") return "Physical Location";
  if (society.type === "Online") return "Online";
  if (society.type === "Popup") return "Pop-up Location";
  if (society.type === "Decentralized") return "Decentralized";
  
  return "Global";
};

const getResidentsFromSociety = (society: SocietyDatabase) => {
  // Estimate residents based on tier and type
  if (society.tier === 1) {
    if (society.type === "Physical") return "500-2500";
    if (society.type === "Online") return "1000-5000";
    if (society.type === "Popup") return "100-500";
    if (society.type === "Decentralized") return "500-2000";
  } else if (society.tier === 2) {
    if (society.type === "Physical") return "100-1000";
    if (society.type === "Online") return "500-2000";
    if (society.type === "Popup") return "50-200";
    if (society.type === "Decentralized") return "200-1000";
  } else if (society.tier === 3) {
    if (society.type === "Physical") return "50-500";
    if (society.type === "Online") return "100-1000";
    if (society.type === "Popup") return "25-100";
    if (society.type === "Decentralized") return "100-500";
  }
  return "50-200";
};

const getGrowthFromSociety = (society: SocietyDatabase) => {
  // Estimate growth based on tier
  if (society.tier === 1) return "+20%";
  if (society.tier === 2) return "+15%";
  if (society.tier === 3) return "+10%";
  return "+12%";
};

const getFoundedFromSociety = (society: SocietyDatabase) => {
  // Use founded field from Airtable if available
  if (society.founded) {
    return society.founded;
  }
  
  // Fallback: Estimate founding year based on tier and known societies
  if (society.name.includes("Próspera")) return "2020";
  if (society.name.includes("Sealand")) return "1967";
  if (society.name.includes("Liberland")) return "2015";
  if (society.name.includes("Network School") || society.name.includes("The Network School")) return "2023";
  if (society.name.includes("Edge City")) return "2023";
  if (society.name.includes("Don't Die")) return "2023";
  if (society.name.includes("Zuzalu")) return "2023";
  if (society.name.includes("Logos")) return "2022";
  if (society.name.includes("VDAO")) return "2023";
  
  // Default based on tier
  if (society.tier === 1) return "2023";
  if (society.tier === 2) return "2022";
  if (society.tier === 3) return "2021";
  return "2023";
};

const getFocusFromSociety = (society: SocietyDatabase) => {
  // Extract focus areas from mission and type
  const focus = [];
  
  if (society.mission.toLowerCase().includes("crypto") || society.mission.toLowerCase().includes("blockchain")) {
    focus.push("Crypto/Blockchain");
  }
  if (society.mission.toLowerCase().includes("governance") || society.mission.toLowerCase().includes("democracy")) {
    focus.push("Governance");
  }
  if (society.mission.toLowerCase().includes("freedom") || society.mission.toLowerCase().includes("liberty")) {
    focus.push("Freedom");
  }
  if (society.mission.toLowerCase().includes("community")) {
    focus.push("Community");
  }
  if (society.mission.toLowerCase().includes("technology") || society.mission.toLowerCase().includes("tech")) {
    focus.push("Technology");
  }
  if (society.mission.toLowerCase().includes("education")) {
    focus.push("Education");
  }
  if (society.mission.toLowerCase().includes("innovation")) {
    focus.push("Innovation");
  }
  if (society.mission.toLowerCase().includes("sustainability") || society.mission.toLowerCase().includes("environment")) {
    focus.push("Sustainability");
  }
  if (society.mission.toLowerCase().includes("longevity") || society.mission.toLowerCase().includes("health")) {
    focus.push("Longevity");
  }
  if (society.mission.toLowerCase().includes("space")) {
    focus.push("Space");
  }
  if (society.mission.toLowerCase().includes("nomad")) {
    focus.push("Digital Nomads");
  }
  
  // Add type-based focus
  if (society.type === "Physical") focus.push("Physical Community");
  if (society.type === "Online") focus.push("Digital Community");
  if (society.type === "Popup") focus.push("Pop-up Events");
  if (society.type === "Decentralized") focus.push("Decentralized");
  
  // Default focus if none found
  if (focus.length === 0) {
    focus.push("Network State");
  }
  
  return focus.slice(0, 4); // Limit to 4 focus areas
};

// Transform societies database to match the UI structure
const transformSocietiesData = (societies: SocietyDatabase[]): TransformedSociety[] => {
  return societies.map(society => ({
    name: society.name,
    location: getLocationFromSociety(society),
    residents: getResidentsFromSociety(society),
    growth: getGrowthFromSociety(society),
    founded: getFoundedFromSociety(society),
    description: society.mission,
    website: society.url,
    x: society.x,
    discord: society.discord,
    telegram: society.telegram || null,
    focus: getFocusFromSociety(society),
    tier: society.tier,
    type: society.type,
    application: society.application,
    icon: society.icon,
    category: society.category,
  }));
};

export default function SocietiesPageClient({ societies }: SocietiesPageClientProps) {
  const [expandedSociety, setExpandedSociety] = useState<string | null>(null);
  const [events, setEvents] = useState<UIEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [showGrowthChart, setShowGrowthChart] = useState<boolean>(false);
  
  const networkStates = transformSocietiesData(societies);

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

  // Get events for a specific network state
  const getEventsForNetworkState = (networkStateName: string) => {
    return events.filter(event =>
      societyNamesMatch(event.networkState, networkStateName)
    );
  };

  const toggleSociety = (societyName: string) => {
    setExpandedSociety(expandedSociety === societyName ? null : societyName);
  };

  // Get upcoming events count for each society
  const getUpcomingEventsCount = (networkStateName: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && societyNamesMatch(event.networkState, networkStateName);
    }).length;
  };

  // Get unique locations and types for filters
  const uniqueLocations = Array.from(new Set(networkStates.map(s => s.location))).sort();
  const uniqueTypes = Array.from(new Set(networkStates.map(s => s.type))).sort();

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

  // Check if a society has open job positions
  const hasOpenPositions = (societyName: string): boolean => {
    return jobsDatabase.some(job => 
      societyNamesMatch(job.company, societyName)
    );
  };

  // Filter and sort societies
  const filteredAndSortedSocieties = [...networkStates]
    .filter(society => {
      // Search filter
      if (searchTerm && !society.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Location filter
      if (selectedLocations.length > 0 && !selectedLocations.includes(society.location)) {
        return false;
      }

      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(society.type)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const countA = getUpcomingEventsCount(a.name);
      const countB = getUpcomingEventsCount(b.name);
      return countB - countA; // Descending order by event count
    });

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
              className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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
            Showing {filteredAndSortedSocieties.length} of {networkStates.length} societies
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
            const societyEvents = getEventsForNetworkState(society.name);
            const isExpanded = expandedSociety === society.name;
            const originalSociety = societies.find(s => s.name === society.name);

            return (
              <div
                key={index}
                className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-3"
              >
                {/* Header: Logo, Name + Description, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  {/* Logo */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden relative">
                    {originalSociety?.icon ? (
                      <div className="w-full h-full p-1.5 flex items-center justify-center">
                        <Image
                          src={originalSociety.icon}
                          alt={`${society.name} logo`}
                          width={56}
                          height={56}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback to abbreviation if image fails
                            const target = e.currentTarget;
                            const parent = target.parentElement?.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-xl font-bold font-mono text-primary">${society.name.substring(0, 2).toUpperCase()}</span>`;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-xl font-bold font-mono text-primary">
                        {society.name.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Name + Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-2">
                      <div className="flex-shrink-0 sm:self-start">
                        <h3 className="text-lg font-bold font-mono leading-snug">{society.name}</h3>
                      </div>
                      <p className="text-sm font-mono text-muted-foreground leading-relaxed flex-1 sm:self-start sm:pt-[0.125rem]">
                        {society.description}
                      </p>
                    </div>
                    
                    {/* Location, Category, Badges */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{society.location}</span>
                      </div>
                      {society.category && (
                        <div className="text-xs font-mono px-2 py-1 border border-primary/30 bg-primary/5 text-primary inline-block">
                          {society.category}
                        </div>
                      )}
                      <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                        {society.type}
                      </div>
                      {society.founded && society.founded.toLowerCase() !== "unknown" && (
                        <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                          Founded {society.founded}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border mt-2">
                  <a
                    href={society.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    title="Website"
                  >
                    <Globe className="h-3 w-3" />
                  </a>
                  {society.x && (
                    <a
                      href={society.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      title="X (Twitter)"
                    >
                      <XIcon className="h-3 w-3" />
                    </a>
                  )}
                  {society.discord && (
                    <a
                      href={society.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      title="Discord"
                    >
                      <DiscordIcon className="h-3 w-3" />
                    </a>
                  )}
                  {society.telegram && (
                    <a
                      href={society.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      title="Telegram"
                    >
                      <MessageCircle className="h-3 w-3" />
                    </a>
                  )}
                  {hasOpenPositions(society.name) && (
                    <Link
                      href={`/jobs?employer=${encodeURIComponent(society.name)}`}
                      className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      title="View Open Positions"
                    >
                      <Briefcase className="h-3 w-3" />
                      Recruiting now
                    </Link>
                  )}
                  {society.application && (
                    <a
                      href={society.application}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-2 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ml-auto"
                      title="Apply to Society"
                    >
                      Apply
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
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
                                <div className="font-mono font-bold text-sm">{event.title}</div>
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
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ GET IN TOUCH ]
          </Link>
          <Link
            href="/#upcoming-events"
            className="px-6 py-3 border-2 border-border bg-background hover:bg-accent transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
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

