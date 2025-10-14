"use client";

import { Gift, ExternalLink, DollarSign, Target, Calendar } from "lucide-react";

const grantPrograms = [
  {
    name: "Ethereum Foundation Grants",
    focus: "Ethereum infrastructure, Research, Public goods",
    grantSize: "$10K - $500K",
    type: "Rolling applications",
    description: "The OG Ethereum grants. Building the foundation of Web3.",
    categories: ["Infrastructure", "Research", "Community"],
    website: "https://esp.ethereum.foundation",
    twitter: "@EF_ESP",
  },
  {
    name: "Gitcoin Grants",
    focus: "Public goods, Open source, Community",
    grantSize: "Quadratic funding",
    type: "Quarterly rounds",
    description: "Community-driven funding. Your donors get matched through quadratic funding magic.",
    categories: ["Open Source", "Community", "Climate"],
    website: "https://grants.gitcoin.co",
    twitter: "@gitcoin",
  },
  {
    name: "Optimism RetroPGF",
    focus: "Public goods, Impact",
    grantSize: "$10M+ per round",
    type: "Retroactive funding",
    description: "Get paid for impact you've already created. The future of public goods funding.",
    categories: ["Public Goods", "Infrastructure", "Tooling"],
    website: "https://app.optimism.io/retropgf",
    twitter: "@optimismFND",
  },
  {
    name: "Protocol Labs Research Grants",
    focus: "Decentralized storage, Research",
    grantSize: "$5K - $200K",
    type: "Open RFPs",
    description: "Building the decentralized web. IPFS, Filecoin, and beyond.",
    categories: ["Research", "Storage", "Web3"],
    website: "https://grants.protocol.ai",
    twitter: "@protocollabs",
  },
  {
    name: "Polygon Grants",
    focus: "Scaling solutions, dApps, DeFi",
    grantSize: "$5K - $100K",
    type: "Rolling applications",
    description: "Building on Polygon. Grants for devs scaling Ethereum.",
    categories: ["DeFi", "Gaming", "Infrastructure"],
    website: "https://polygon.technology/funds",
    twitter: "@0xPolygon",
  },
  {
    name: "Arbitrum Grants",
    focus: "L2 ecosystem, Developer tools",
    grantSize: "$1K - $250K",
    type: "Multiple programs",
    description: "Growing the Arbitrum ecosystem. From hackathons to serious grants.",
    categories: ["DeFi", "Gaming", "Infrastructure"],
    website: "https://arbitrum.foundation",
    twitter: "@ArbitrumFdn",
  },
  {
    name: "Starknet Grants",
    focus: "ZK technology, Cairo development",
    grantSize: "$5K - $100K",
    type: "Rolling applications",
    description: "Building with zero-knowledge proofs. The future of scaling.",
    categories: ["ZK Tech", "DeFi", "Tooling"],
    website: "https://www.starknet.io/en/community/grants",
    twitter: "@Starknet",
  },
  {
    name: "Uniswap Grants Program",
    focus: "DeFi, Governance, Analytics",
    grantSize: "$1K - $100K",
    type: "Wave-based funding",
    description: "Building the DeFi stack. Grants from the largest DEX.",
    categories: ["DeFi", "Analytics", "Governance"],
    website: "https://www.unigrants.org",
    twitter: "@uniswap",
  },
  {
    name: "Balaji's 1729 Grants",
    focus: "Network States, Longevity, Crypto",
    grantSize: "Variable",
    type: "Task-based",
    description: "Get paid to learn and build. Tasks, tutorials, and bounties.",
    categories: ["Network States", "Education", "Research"],
    website: "https://1729.com",
    twitter: "@balajis",
  },
  {
    name: "Moloch DAO",
    focus: "Ethereum infrastructure, Public goods",
    grantSize: "$5K - $50K",
    type: "Proposal-based",
    description: "The OG grant DAO. Community-governed funding for Ethereum public goods.",
    categories: ["Infrastructure", "Public Goods", "Community"],
    website: "https://molochdao.com",
    twitter: "@MolochDAO",
  },
  {
    name: "Nouns DAO",
    focus: "CC0 art, Culture, Public goods",
    grantSize: "$1K - $500K",
    type: "Proposal-based",
    description: "Proliferating the Nouns meme. Daily auctions funding public goods.",
    categories: ["Art", "Culture", "Public Goods"],
    website: "https://nouns.wtf",
    twitter: "@nounsdao",
  },
  {
    name: "MetaCartel Ventures",
    focus: "Community DAOs, DeFi, NFTs",
    grantSize: "$1K - $10K",
    type: "Membership-based",
    description: "The grant DAO for builders by builders. Community-first funding.",
    categories: ["DAOs", "DeFi", "NFTs"],
    website: "https://metacartel.xyz",
    twitter: "@META_CARTEL",
  },
];

export default function GrantsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║    "Don't ask for permission, ask for forgiveness."             ║
║     - Grace Hopper                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ GRANTS ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Non-dilutive funding for Network State builders. From protocol grants to DAO funding,
          get capital without giving up equity.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">$100M+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Available Annually</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">12</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Active Programs</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">5000+</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Grants Awarded</div>
        </div>
      </section>

      {/* Grant Listings */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Gift className="h-6 w-6" />
          [ GRANT PROGRAMS ]
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {grantPrograms.map((grant, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{grant.name}</h3>
                  <p className="text-sm font-mono text-muted-foreground">{grant.twitter}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs font-mono px-3 py-1 border border-border bg-muted whitespace-nowrap">
                    {grant.type}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {grant.description}
              </p>

              {/* Focus & Grant Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <Target className="h-3 w-3" />
                    <span className="font-bold">FOCUS</span>
                  </div>
                  <p className="text-sm font-mono">{grant.focus}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-bold">GRANT SIZE</span>
                  </div>
                  <p className="text-sm font-mono text-green-500 font-bold">{grant.grantSize}</p>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="text-xs font-mono text-muted-foreground font-bold">
                  CATEGORIES:
                </div>
                <div className="flex flex-wrap gap-2">
                  {grant.categories.map((category, categoryIndex) => (
                    <span
                      key={categoryIndex}
                      className="px-2 py-1 text-xs font-mono border border-primary/30 bg-primary/5 text-primary"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Website Link */}
              <div className="pt-2">
                <a
                  href={grant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  APPLY NOW
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="border-2 border-border p-6 bg-card space-y-4">
        <h3 className="text-xl font-bold font-mono flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          [ GRANT APPLICATION TIPS ]
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
          <div className="space-y-2">
            <div className="font-bold text-primary">✓ DO:</div>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• Show existing work and traction</li>
              <li>• Be specific about milestones</li>
              <li>• Highlight public good impact</li>
              <li>• Include timeline and budget</li>
              <li>• Build in public and share updates</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-bold text-destructive">✗ DON&apos;T:</div>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>• Ask for unrealistic amounts</li>
              <li>• Be vague about deliverables</li>
              <li>• Ignore community feedback</li>
              <li>• Disappear after receiving funds</li>
              <li>• Copy-paste applications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  Builder: "Need grant."                        │
    │  DAO: "What's the impact?"                     │
    │  Builder: "Public good vibes."                 │
    │  DAO: "Approved. Ship it."                     │
    │                                                 │
    │  [ ngmi ] → [ wagmi ] → [ gm ]                 │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
