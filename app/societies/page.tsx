"use client";

import { Users, MapPin, TrendingUp, ExternalLink, ChevronDown, ChevronUp, Calendar, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Comprehensive network states data
const networkStates = [
  {
    name: "Network School",
    location: "Forest City, Malaysia",
    residents: "100-500",
    growth: "+23%",
    founded: "2023",
    description: "Building the future of education and community in Southeast Asia. A hub for builders, learners, and Network State pioneers.",
    website: "https://ns.com/?utm_source=nsnodes.com",
    x: "https://x.com/balajis",
    discord: null,
    telegram: null,
    focus: ["Education", "Community", "Technology"],
  },
  {
    name: "Próspera",
    location: "Roatán, Honduras",
    residents: "500-2500",
    growth: "+18%",
    founded: "2020",
    description: "Honduras' ZEDE (Zone for Employment and Economic Development). Building a new model for governance and economic freedom.",
    website: "https://www.prospera.co/?utm_source=nsnodes.com",
    x: "https://x.com/prosperaglobal",
    discord: "https://discord.com/invite/FKSGnQWxXp",
    telegram: null,
    focus: ["Governance", "Economic Freedom", "Innovation"],
  },
  {
    name: "ZuCity Japan",
    location: "Nagano, Japan",
    residents: "100-500",
    growth: "+15%",
    founded: "2023",
    description: "Pop-up city experiment in the Japanese Alps. Building community infrastructure for the Network State era.",
    website: "https://zucity.org/?utm_source=nsnodes.com",
    x: "https://x.com/zucity_japan",
    discord: "https://discord.com/invite/vqkUaSpDhf",
    telegram: null,
    focus: ["Pop-up Cities", "Community", "Events"],
  },
  {
    name: "Edge City",
    location: "San Martín de los Andes, Argentina",
    residents: "100-500",
    growth: "+31%",
    founded: "2023",
    description: "Pop-up city network bringing together builders, creators, and visionaries. Creating space for deep work and community.",
    website: "https://www.edgecity.live/?utm_source=nsnodes.com",
    x: "https://x.com/joinedgecity",
    discord: null,
    telegram: null,
    focus: ["Pop-up Cities", "Events", "Community"],
  },
  {
    name: "ShanhaiWoo",
    location: "Innovis, Singapore",
    residents: "100-500",
    growth: "+27%",
    founded: "2023",
    description: "Singapore's Network State experiment. Bridging East and West through technology and community.",
    website: "https://www.shanhaiwoo.com/?utm_source=nsnodes.com",
    x: "https://x.com/shanhaiwoo",
    discord: null,
    telegram: "https://t.me/shanhaiwoo",
    focus: ["Technology", "Community", "East-West Bridge"],
  },
  {
    name: "4Seas Community",
    location: "Chiang Mai, Thailand",
    residents: "50-100",
    growth: "+12%",
    founded: "2024",
    description: "Southeast Asian hub for digital nomads and builders. Creating infrastructure for location-independent communities.",
    website: "https://4seas.io/?utm_source=nsnodes.com",
    x: "https://x.com/4seascommunity",
    discord: null,
    telegram: null,
    focus: ["Digital Nomads", "Community", "Events"],
  },
  {
    name: "Invisible Garden Argentina",
    location: "Buenos Aires, Argentina",
    residents: "50-100",
    growth: "+20%",
    founded: "2024",
    description: "Pop-up city experiment in Buenos Aires. Building regenerative communities and sustainable living models.",
    website: "https://invisiblegarden.ar/?utm_source=nsnodes.com",
    x: "https://x.com/invisiblegarden",
    discord: null,
    telegram: null,
    focus: ["Regeneration", "Pop-up Cities", "Community"],
  },
  {
    name: "Infinita City",
    location: "Próspera ZEDE, Honduras",
    residents: "100-200",
    growth: "+15%",
    founded: "2024",
    description: "Community within Próspera ZEDE. Building the future of urban living and governance.",
    website: "https://infinita.city/?utm_source=nsnodes.com",
    x: "https://x.com/infinitacity",
    discord: null,
    telegram: null,
    focus: ["Urban Living", "Governance", "Community"],
  },
];

// Events data
const events = [
  // Edge City Patagonia
  { date: "2025-10-19", time: "6:30 PM – 9:00 PM", title: "Opening Ceremony", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16088" },
  { date: "2025-10-20", time: "7:00 AM – 8:00 AM", title: "Run Club", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16093" },
  { date: "2025-10-20", time: "8:00 AM – 9:00 AM", title: "Yoga", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Event", url: "https://app.sola.day/event/detail/16167" },
  { date: "2025-10-22", time: "14:00 – 15:00", title: "Funding \"woo woo\" ventures", location: "San Martín de los Andes, Argentina", networkState: "Edge City Patagonia", type: "Workshop", url: "https://app.sola.day/event/detail/16359" },

  // 4Seas Community
  { date: "2025-10-25", time: "10:00 – 12:00", title: "AI ENGINEERS MEETUP WEEKLY CHIANG MAI", location: "Chiang Mai, Thailand", networkState: "4Seas Community", type: "Meetup", url: "https://app.sola.day/event/detail/16278" },

  // Network School
  { date: "2025-10-11", time: "10:00 PM", title: "Morning Meditation", location: "Forest City, Malaysia", networkState: "Network School", type: "Meditation", url: "https://lu.ma/ns" },
  { date: "2025-10-11", time: "11:00 PM", title: "Learnathon: ML Foundations", location: "Forest City, Malaysia", networkState: "Network School", type: "Workshop", url: "https://lu.ma/ns" },
  { date: "2025-10-12", time: "8:00 PM", title: "NS October Mixer", location: "Forest City, Malaysia", networkState: "Network School", type: "Mixer", url: "https://lu.ma/ns" },
  { date: "2025-10-14", time: "9:30 PM", title: "decoding VC and how you can raise your first round", location: "Forest City, Malaysia", networkState: "Network School", type: "Discussion", url: "https://lu.ma/ns" },
];

export default function SocietiesPage() {
  const [expandedSociety, setExpandedSociety] = useState<string | null>(null);

  // Get events for a specific network state
  const getEventsForNetworkState = (networkStateName: string) => {
    // Match variations of names (e.g., "Edge City" matches "Edge City Patagonia")
    return events.filter(event =>
      event.networkState.toLowerCase().includes(networkStateName.toLowerCase()) ||
      networkStateName.toLowerCase().includes(event.networkState.toLowerCase())
    );
  };

  const toggleSociety = (societyName: string) => {
    setExpandedSociety(expandedSociety === societyName ? null : societyName);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ NETWORK STATE SOCIETIES ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Explore the emerging Network States building the decentralized future. From pop-up cities
          to permanent communities, these are the pioneers of new forms of governance and living.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{networkStates.length}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Active Societies</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">2000+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Total Residents</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">+20%</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Avg Growth Rate</div>
        </div>
      </section>

      {/* Network States List */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Users className="h-6 w-6" />
          [ ALL SOCIETIES ]
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {networkStates.map((society, index) => {
            const societyEvents = getEventsForNetworkState(society.name);
            const isExpanded = expandedSociety === society.name;

            return (
              <div
                key={index}
                className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-mono">{society.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{society.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{society.residents} residents</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-green-500">{society.growth}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="text-xs font-mono px-3 py-1 border border-border bg-muted whitespace-nowrap">
                      Founded {society.founded}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                  {society.description}
                </p>

                {/* Focus Areas */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="text-xs font-mono text-muted-foreground font-bold">
                    FOCUS AREAS:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {society.focus.map((area, areaIndex) => (
                      <span
                        key={areaIndex}
                        className="px-2 py-1 text-xs font-mono border border-primary/30 bg-primary/5 text-primary"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <a
                    href={society.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    WEBSITE
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  {society.x && (
                    <a
                      href={society.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      X / TWITTER
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {society.discord && (
                    <a
                      href={society.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      DISCORD
                      <MessageCircle className="h-3 w-3" />
                    </a>
                  )}
                  {society.telegram && (
                    <a
                      href={society.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                    >
                      TELEGRAM
                      <MessageCircle className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Events Dropdown */}
                {societyEvents.length > 0 && (
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
                        {societyEvents.map((event, eventIndex) => (
                          <a
                            key={eventIndex}
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border border-border bg-background hover:bg-accent transition-colors"
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
                          href="/#upcoming-events"
                          className="block text-center text-xs font-mono text-primary hover:underline mt-3"
                        >
                          View all events on homepage →
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
        <p className="text-sm font-mono text-muted-foreground max-w-2xl mx-auto">
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
