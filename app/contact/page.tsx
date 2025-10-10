"use client";

import { MessageSquare, Heart, Users, Rocket } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║    "We're all gonna make it. Together." - Ancient proverb       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ CONTACT ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Join the conversation. Connect with builders. Shape the future.
        </p>
      </section>

      {/* Discord CTA */}
      <section className="max-w-3xl mx-auto">
        <div className="border-2 border-border p-8 bg-card shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] space-y-6 text-center">
          <div className="inline-block p-4 border-2 border-border bg-primary/10">
            <MessageSquare className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-mono">[ JOIN OUR DISCORD ]</h2>
          <p className="text-sm font-mono text-muted-foreground leading-relaxed max-w-xl mx-auto">
            The NSNodes Discord is where the community lives. Daily discussions about Network States,
            crypto, governance, and building the future. No jannies, only builders.
          </p>
          <a
            href="https://discord.gg/nsnodes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-border px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            [ JOIN DISCORD ] →
          </a>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2 justify-center">
          <Heart className="h-6 w-6" />
          [ WHY WE BUILD THIS ]
        </h2>

        <div className="border-2 border-border p-8 bg-card space-y-6">
          <div className="space-y-4 text-sm font-mono leading-relaxed">
            <p>
              NSNodes exists because the Network State movement needs a home. A place where
              builders, thinkers, and degens can find each other, share opportunities, and
              coordinate on building the future.
            </p>
            <p>
              We believe in:
            </p>
            <ul className="list-none space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span><strong>Exit over voice</strong> - Build new systems instead of fixing broken ones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span><strong>Decentralization</strong> - Power to the people, not the platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span><strong>Community first</strong> - We&apos;re all gonna make it, together</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span><strong>Open source everything</strong> - Fork it, improve it, ship it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">▸</span>
                <span><strong>Skin in the game</strong> - We&apos;re building Network States too</span>
              </li>
            </ul>
            <p className="pt-4">
              This platform is free, open-source, and community-driven. No ads, no surveillance,
              no corporate overlords. Just builders helping builders.
            </p>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border-2 border-border p-6 text-center bg-card">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-mono">5.2K+</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Community Members</div>
          </div>
          <div className="border-2 border-border p-6 text-center bg-card">
            <Rocket className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-mono">24</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Network States</div>
          </div>
          <div className="border-2 border-border p-6 text-center bg-card">
            <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold font-mono">100%</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">Community Driven</div>
          </div>
        </div>
      </section>

      {/* The Vision */}
      <section className="max-w-3xl mx-auto border-2 border-border p-8 bg-card">
        <h3 className="text-xl font-bold font-mono mb-4 text-center">[ THE VISION ]</h3>
        <div className="space-y-4 text-sm font-mono leading-relaxed">
          <p>
            In 2013, Balaji wrote about the idea of a Network State. In 2022, he published
            the full book. Now, in 2025, we&apos;re living it.
          </p>
          <p>
            Network States aren&apos;t coming. They&apos;re here. From Próspera&apos;s charter city
            in Honduras to Cabin&apos;s coliving network, from Praxis building a new city to
            Afropolitan&apos;s digital nation for Africans.
          </p>
          <p>
            NSNodes is the coordination layer. The Schelling point. The memetic hub.
          </p>
          <p className="text-center pt-4 text-primary font-bold">
            We&apos;re not just talking about the future.
            <br />
            We&apos;re building it. Together.
          </p>
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  "Few understand this."                        │
    │  "Have fun staying poor (in spirit)."          │
    │  "NGMI if you don't build."                    │
    │                                                 │
    │  [ gm ] [ wagmi ] [ lfg ] [ iykyk ]            │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-4">
        <p className="font-mono text-lg font-bold">See you in Discord, anon.</p>
        <pre className="text-xs font-mono opacity-60">
{`
    ⚡ Built with <3 for the Network State community ⚡
`}
        </pre>
      </section>
    </div>
  );
}
