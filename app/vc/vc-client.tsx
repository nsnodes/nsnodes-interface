"use client";

import { TrendingUp, ExternalLink, DollarSign, Target } from "lucide-react";

const vcFirms = [
  {
    name: "a16z Crypto",
    focus: "Crypto infrastructure, DeFi, Web3",
    checkSize: "$1M - $100M",
    stage: "Seed to Growth",
    description: "The OG crypto fund. If you're building the future of money, they want to talk.",
    notable: ["Coinbase", "OpenSea", "Uniswap"],
    website: "https://a16zcrypto.com",
    twitter: "@a16zcrypto",
  },
  {
    name: "Paradigm",
    focus: "Crypto protocols, DeFi, Infrastructure",
    checkSize: "$1M - $100M+",
    stage: "Seed to Late",
    description: "Technical crypto investors. They actually understand the code.",
    notable: ["Optimism", "Blur", "FTX (RIP)"],
    website: "https://paradigm.xyz",
    twitter: "@paradigm",
  },
  {
    name: "Dragonfly Capital",
    focus: "Cross-border crypto, Asia focus",
    checkSize: "$500K - $30M",
    stage: "Seed to Series B",
    description: "East meets West. Building the global crypto ecosystem.",
    notable: ["dYdX", "Compound", "Celo"],
    website: "https://www.dcp.capital",
    twitter: "@dragonfly_xyz",
  },
  {
    name: "Polychain Capital",
    focus: "Web3 protocols, Infrastructure",
    checkSize: "$1M - $50M",
    stage: "Seed to Growth",
    description: "Early believers. Been in crypto since it was uncool (2016).",
    notable: ["Coinbase", "Filecoin", "Dapper Labs"],
    website: "https://polychain.capital",
    twitter: "@polychainvision",
  },
  {
    name: "Variant Fund",
    focus: "Ownership economy, Web3",
    checkSize: "$500K - $20M",
    stage: "Seed to Series A",
    description: "Ownership for creators and communities. The future is decentralized.",
    notable: ["Foundation", "Farcaster", "Layer3"],
    website: "https://variant.fund",
    twitter: "@variantfund",
  },
  {
    name: "1kx",
    focus: "Crypto networks, DeFi",
    checkSize: "$500K - $10M",
    stage: "Pre-seed to Series A",
    description: "Technical crypto fund. Community-first investing.",
    notable: ["Lido", "Gnosis", "SKALE"],
    website: "https://1kx.network",
    twitter: "@1kxnetwork",
  },
  {
    name: "Placeholder",
    focus: "Decentralized networks",
    checkSize: "$1M - $10M",
    stage: "Seed to Series A",
    description: "Deep crypto thesis. Building sustainable Web3 protocols.",
    notable: ["Maker", "Numerai", "Protocol Labs"],
    website: "https://placeholder.vc",
    twitter: "@placeholdervc",
  },
  {
    name: "Electric Capital",
    focus: "Crypto infrastructure, Developer tools",
    checkSize: "$500K - $30M",
    stage: "Seed to Growth",
    description: "Developer-focused. They publish the best crypto reports.",
    notable: ["Bitwise", "Anchorage", "NEAR"],
    website: "https://electriccapital.com",
    twitter: "@ElectricCapital",
  },
];

export default function VCPage() {
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
          <div className="text-3xl font-bold font-mono text-primary">8</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Top-Tier Funds</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">1000+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Portfolio Companies</div>
        </div>
      </section>

      {/* VC Listings */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          [ NETWORK STATE VCs ]
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {vcFirms.map((vc, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{vc.name}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{vc.twitter}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs font-mono px-3 py-1 border border-border bg-muted whitespace-nowrap">
                    {vc.stage}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {vc.description}
              </p>

              {/* Focus & Check Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span className="font-bold">FOCUS</span>
                  </div>
                  <p className="text-sm font-mono">{vc.focus}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-bold">CHECK SIZE</span>
                  </div>
                  <p className="text-sm font-mono text-money-positive font-bold">{vc.checkSize}</p>
                </div>
              </div>

              {/* Notable Investments */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs font-mono text-muted-foreground font-bold">
                  NOTABLE INVESTMENTS:
                </div>
                <div className="flex flex-wrap gap-2">
                  {vc.notable.map((company, companyIndex) => (
                    <span
                      key={companyIndex}
                      className="px-2 py-1 text-xs font-mono border border-primary/30 bg-primary/5 text-primary"
                    >
                      {company}
                    </span>
                  ))}
                </div>
              </div>

              {/* Website Link */}
              <div className="pt-2">
                <a
                  href={vc.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  VISIT WEBSITE
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  "VCs: We fund the future."                    │
    │  Anons: "Show me the cap table."              │
    │                                                 │
    │  [ trust minimized ] [ decentralized ] [ gm ]  │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
