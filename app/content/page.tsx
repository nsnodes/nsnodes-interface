"use client";

import { Youtube, Twitter, Rss, ExternalLink, BookOpen } from "lucide-react";

const creators = [
  {
    name: "Balaji Srinivasan",
    handle: "@balajis",
    description: "Former CTO of Coinbase. Author of 'The Network State'. The OG.",
    platforms: {
      twitter: "https://twitter.com/balajis",
      blog: "https://balajis.com",
    },
    topics: ["Network States", "Crypto", "Longevity"],
    followers: "1M+",
  },
  {
    name: "Vitalik Buterin",
    handle: "@VitalikButerin",
    description: "Ethereum founder. Philosopher-king of crypto.",
    platforms: {
      twitter: "https://twitter.com/VitalikButerin",
      blog: "https://vitalik.ca",
    },
    topics: ["Ethereum", "Governance", "Coordination"],
    followers: "5M+",
  },
  {
    name: "Dryden Brown",
    handle: "@drydenwtbrown",
    description: "Founder of Praxis. Building the first Network State city.",
    platforms: {
      twitter: "https://twitter.com/drydenwtbrown",
      youtube: "https://youtube.com/@praxis",
    },
    topics: ["Praxis", "City Building", "Startups"],
    followers: "50K+",
  },
  {
    name: "Naval Ravikant",
    handle: "@naval",
    description: "Philosopher, investor, and builder. Wealth wisdom in tweet form.",
    platforms: {
      twitter: "https://twitter.com/naval",
      blog: "https://nav.al",
    },
    topics: ["Philosophy", "Wealth", "Happiness"],
    followers: "2M+",
  },
  {
    name: "Lex Fridman",
    handle: "@lexfridman",
    description: "AI researcher. Long-form conversations with builders and thinkers.",
    platforms: {
      twitter: "https://twitter.com/lexfridman",
      youtube: "https://youtube.com/@lexfridman",
    },
    topics: ["AI", "Philosophy", "Long-form"],
    followers: "3M+",
  },
  {
    name: "Lyn Alden",
    handle: "@LynAldenContact",
    description: "Macroeconomics and Bitcoin. The best technical analysis.",
    platforms: {
      twitter: "https://twitter.com/LynAldenContact",
      blog: "https://lynalden.com",
    },
    topics: ["Bitcoin", "Macro", "Finance"],
    followers: "800K+",
  },
  {
    name: "Erik Torenberg",
    handle: "@eriktorenberg",
    description: "Tech writer and community builder. Network State enthusiast.",
    platforms: {
      twitter: "https://twitter.com/eriktorenberg",
      blog: "https://eriktorenberg.substack.com",
    },
    topics: ["Startups", "Community", "Network States"],
    followers: "200K+",
  },
  {
    name: "Cabin DAO",
    handle: "@creatorcabins",
    description: "Building a decentralized city. IRL Network State experiments.",
    platforms: {
      twitter: "https://twitter.com/creatorcabins",
      blog: "https://www.cabin.city",
    },
    topics: ["Coliving", "DAOs", "Community"],
    followers: "25K+",
  },
];

export default function ContentPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║       "Content is the new oil. Attention is the currency."      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ CONTENT CREATORS ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Follow the thinkers, builders, and memers shaping the Network State movement.
          These are the people defining our decentralized future.
        </p>
      </section>

      {/* Creator Cards */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          [ ESSENTIAL FOLLOWS ]
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {creators.map((creator, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-mono">{creator.name}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{creator.handle}</p>
                </div>
                <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                  {creator.followers}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {creator.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {creator.topics.map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-2 py-1 text-xs font-mono border border-primary/30 bg-primary/5 text-primary"
                  >
                    #{topic}
                  </span>
                ))}
              </div>

              {/* Platform Links */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                {creator.platforms.twitter && (
                  <a
                    href={creator.platforms.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    <Twitter className="h-3 w-3" />
                    Twitter
                  </a>
                )}
                {creator.platforms.youtube && (
                  <a
                    href={creator.platforms.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    <Youtube className="h-3 w-3" />
                    YouTube
                  </a>
                )}
                {creator.platforms.blog && (
                  <a
                    href={creator.platforms.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    <Rss className="h-3 w-3" />
                    Blog
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading List */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          [ ESSENTIAL READING ]
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://thenetworkstate.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-border p-6 bg-card hover:bg-accent transition-all space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold font-mono">The Network State</h3>
              <ExternalLink className="h-4 w-4" />
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              by Balaji Srinivasan
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              The foundational text. How to start a new country.
            </p>
          </a>

          <a
            href="https://vitalik.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-border p-6 bg-card hover:bg-accent transition-all space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold font-mono">Vitalik&apos;s Blog</h3>
              <ExternalLink className="h-4 w-4" />
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              by Vitalik Buterin
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Deep dives on crypto, governance, and coordination.
            </p>
          </a>
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  "Touch grass? No anon, BUILD a new nation     │
    │   on the grass."                               │
    │                                                 │
    │  [ read. learn. build. exit. ]                 │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
