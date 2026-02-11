"use client";

import { TrendingUp, ExternalLink, DollarSign, Target, User, Globe } from "lucide-react";
import { vcDatabase, getVCDatabaseStats } from "@/lib/data/vc-database";

export default function VCPage() {
  const stats = getVCDatabaseStats();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ VENTURE CAPITAL ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          The VCs funding the Network State revolution. These firms back crypto infrastructure,
          decentralized governance, and the future of coordination.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">$10B+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Deployed in Web3</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{stats.total}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Top-Tier Funds</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">{Object.keys(stats.byTopics).length}</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Focus Areas</div>
        </div>
      </section>

      {/* VC Listings */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          [ NETWORK STATE Related VCs ]
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {vcDatabase.map((vc, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{vc.name}</h3>
                  {vc.contact && (
                    <p className="text-sm font-mono text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {vc.contact}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs font-mono px-3 py-1 border border-border bg-muted whitespace-nowrap">
                    {vc.checkSize}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {vc.description}
              </p>

              {/* Topics */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span className="font-bold">FOCUS AREAS:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vc.topics.map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="px-2 py-1 text-xs font-mono border border-primary/30 bg-primary/5 text-primary"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notable Investments */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs font-mono text-muted-foreground font-bold">
                  NOTABLE INVESTMENTS:
                </div>
                <div className="flex flex-wrap gap-2">
                  {vc.investments.map((investment, investmentIndex) => (
                    <span
                      key={investmentIndex}
                      className="px-2 py-1 text-xs font-mono border border-border bg-muted"
                    >
                      {investment}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platform Links */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={vc.platforms.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  <Globe className="h-3 w-3" />
                  WEBSITE
                  <ExternalLink className="h-3 w-3" />
                </a>
                {vc.platforms.x && (
                  <a
                    href={vc.platforms.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    X (TWITTER)
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
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
