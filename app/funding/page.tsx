"use client";

import { TrendingUp, ExternalLink, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FundingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║    "The future is already here – it's just not evenly           ║
║     distributed yet." - William Gibson                          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ FUNDING ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Capital for the Network State revolution. From venture capital to grants,
          find the funding that powers decentralized communities and crypto infrastructure.
        </p>
      </section>

      {/* Funding Options */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venture Capital Card */}
        <Link
          href="/funding/vc"
          className="border-2 border-border p-8 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold font-mono">[ VENTURE CAPITAL ]</h2>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
            Top-tier VCs funding the Network State ecosystem. From seed to growth stage,
            these firms back crypto infrastructure, decentralized governance, and Web3.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <div className="text-xs font-mono text-muted-foreground font-bold">TOTAL DEPLOYED</div>
              <div className="text-2xl font-bold font-mono text-primary">$10B+</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-muted-foreground font-bold">TOP FUNDS</div>
              <div className="text-2xl font-bold font-mono text-primary">8</div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 text-sm font-mono text-primary group-hover:underline">
            <span>EXPLORE VCs</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        </Link>

        {/* Grants Card */}
        <Link
          href="/funding/grants"
          className="border-2 border-border p-8 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold font-mono">[ GRANTS ]</h2>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>

          <p className="text-sm font-mono text-muted-foreground leading-relaxed">
            Non-dilutive funding for builders. Grants from protocols, foundations, and DAOs
            supporting public goods, research, and Network State infrastructure.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <div className="text-xs font-mono text-muted-foreground font-bold">PROGRAMS</div>
              <div className="text-2xl font-bold font-mono text-primary">12+</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono text-muted-foreground font-bold">AVAILABLE</div>
              <div className="text-2xl font-bold font-mono text-primary">$100M+</div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2 text-sm font-mono text-primary group-hover:underline">
            <span>EXPLORE GRANTS</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">1000+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Projects Funded</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">20+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Funding Sources</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">$10B+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Total Capital</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ BUILDING SOMETHING? ]</h3>
        <p className="text-sm font-mono text-muted-foreground max-w-2xl mx-auto">
          Whether you need equity investment or non-dilutive grants, there&apos;s capital
          available for Network State builders. Explore both options to find the right fit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/funding/vc"
            className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ BROWSE VCs ]
          </Link>
          <Link
            href="/funding/grants"
            className="px-6 py-3 border-2 border-border bg-background hover:bg-accent transition-colors font-mono shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ BROWSE GRANTS ]
          </Link>
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  Builder: "Need money to ship."                │
    │  VC: "Show me traction."                       │
    │  Grant: "Show me impact."                      │
    │  Anon: "Just ship it."                         │
    │                                                 │
    │  [ wagmi ] [ ngmi ] [ gm ] [ ser ]             │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
