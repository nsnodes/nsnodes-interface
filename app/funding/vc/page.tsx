"use client";

import { TrendingUp, ExternalLink, Target, User, Globe } from "lucide-react";
import { vcDatabase, getVCDatabaseStats } from "@/lib/data/vc-database";
import Image from "next/image";

export default function VCPage() {
  const stats = getVCDatabaseStats();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-8">
        <div className="text-center lg:text-left space-y-4 flex-1">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
          </pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ VENTURE CAPITAL ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base">
            The VCs funding the Network State revolution. These firms back crypto infrastructure,
            decentralized governance, and the future of coordination.
          </p>
          
          {/* CTA Section */}
          <div className="pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=VC Listing Request&body=Hi, I'd like to list our VC firm on NSNodes. Please include: Firm name, Contact person, Description, Focus areas, Notable investments, Check size, Website, and X profile."
              className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              [ LIST VC ] →
            </a>
          </div>
        </div>
        
        {/* VC Brand Image */}
        <div className="flex-shrink-0">
          <Image 
            src="/vc-brand.png" 
            alt="VC brand meme" 
            width={400}
            height={300}
            className="w-full h-auto border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
          />
        </div>
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
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{vc.name}</h3>
                  {vc.contact && (
                    <p className="text-sm font-mono text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {vc.contactX ? (
                        <a
                          href={vc.contactX}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {vc.contact}
                        </a>
                      ) : (
                        vc.contact
                      )}
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
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
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
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    X
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ LIST YOUR VC ]</h3>
        <p className="text-sm font-mono text-muted-foreground">
          Running a VC firm that backs Network State projects? Get listed and connect
          with the builders shaping the future of governance and coordination.
        </p>
        <a
          href="mailto:nsnodes@gmail.com?subject=VC Listing Request&body=Hi, I'd like to list our VC firm on NSNodes. Please include: Firm name, Contact person, Description, Focus areas, Notable investments, Check size, Website, and X profile."
          className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          [ LIST VC ] →
        </a>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">

        </pre>
      </section>
    </div>
  );
}
