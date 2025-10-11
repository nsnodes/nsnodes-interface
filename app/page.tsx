"use client";

import { Calendar, TrendingUp, Users, ExternalLink } from "lucide-react";
import Image from "next/image";

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
  {
    name: "Zuitzerland",
    location: "Swiss Alps, Switzerland",                  // Location on xyz.city:contentReference[oaicite:12]{index=12}
    residents: "25-100",                                  // Residents range:contentReference[oaicite:13]{index=13}
    growth: "+27%",
    website: "https://www.zuitzerland.ch/?utm_source=nsnodes.com",
    x: "https://x.com/zuitzerland",
    // Only a Telegram link is available; no Discord.
  },
];


const events = [
  {
    date: "2025-10-15",
    title: "Network State Summit 2025",
    location: "Virtual / Miami",
    networkState: "Balajistan",
    type: "Conference",
  },
  {
    date: "2025-10-18",
    title: "Praxis Builder Meetup",
    location: "San Francisco",
    networkState: "Praxis",
    type: "Meetup",
  },
  {
    date: "2025-10-22",
    title: "Próspera Economic Forum",
    location: "Honduras",
    networkState: "Próspera",
    type: "Forum",
  },
  {
    date: "2025-10-25",
    title: "Cabin Community Gathering",
    location: "Remote",
    networkState: "Cabin",
    type: "Social",
  },
  {
    date: "2025-10-28",
    title: "Afropolitan Tech Workshop",
    location: "Lagos / Virtual",
    networkState: "Afropolitan",
    type: "Workshop",
  },
  {
    date: "2025-11-05",
    title: "Network State Governance Debate",
    location: "Virtual",
    networkState: "Multiple",
    type: "Discussion",
  },
  {
    date: "2025-11-12",
    title: "Decentralized City Planning Summit",
    location: "Dubai",
    networkState: "Multiple",
    type: "Conference",
  },
  {
    date: "2025-11-20",
    title: "Startup City Demo Day",
    location: "Singapore",
    networkState: "Praxis",
    type: "Demo Day",
  },
];

export default function Home() {
  return (
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
              className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
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
                <div className="flex items-center gap-3 pt-1">
                  {ns.x && (
                    <a
                      href={ns.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="X/Twitter"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {ns.discord && (
                    <a
                      href={ns.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Discord"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </a>
                  )}
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
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          [ UPCOMING EVENTS ]
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto border-2 border-border">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="text-left p-4 font-bold">[ DATE ]</th>
                <th className="text-left p-4 font-bold">[ EVENT ]</th>
                <th className="text-left p-4 font-bold">[ LOCATION ]</th>
                <th className="text-left p-4 font-bold">[ NETWORK STATE ]</th>
                <th className="text-left p-4 font-bold">[ TYPE ]</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-accent transition-colors"
                >
                  <td className="p-4">{event.date}</td>
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

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] space-y-2"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono text-muted-foreground">{event.date}</span>
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
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center overflow-x-hidden">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80 max-w-full overflow-x-auto">
{`
    ┌─────────────────────────────────────────┐
    │  "Exit > Voice"                         │
    │  "1 BTC = 1 BTC"                        │
    │  "Few understand this"                  │
    └─────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
