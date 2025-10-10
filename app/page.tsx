"use client";

import { Calendar, TrendingUp, Users } from "lucide-react";

const networkStates = [
  { name: "Balajistan", members: "12.5K", growth: "+23%" },
  { name: "Praxis", members: "8.2K", growth: "+18%" },
  { name: "Próspera", members: "5.7K", growth: "+15%" },
  { name: "Cabin", members: "4.3K", growth: "+31%" },
  { name: "Afropolitan", members: "3.9K", growth: "+27%" },
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
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">

        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ nsnodes.com ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Your central hub for Network State events, opportunities, and community updates.
          Because the future is opt-in.
        </p>
      </section>

      {/* Top Network States */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          [ TOP NETWORK STATES ]
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {networkStates.map((ns, index) => (
            <div
              key={ns.name}
              className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs opacity-60">#{index + 1}</span>
                  <span className="text-xs font-mono text-green-500">{ns.growth}</span>
                </div>
                <h3 className="font-mono font-bold text-sm sm:text-base">{ns.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-mono">{ns.members}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <a
            href="https://www.xyz.city/"
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
