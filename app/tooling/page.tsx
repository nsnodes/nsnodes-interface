"use client";

import { Github, Star, GitFork, ExternalLink, Code2 } from "lucide-react";

const tools = [
  {
    name: "The Network State Book",
    author: "balajis",
    description: "The foundational text and website. How to start a new country.",
    stars: "1.2k",
    forks: "150",
    language: "TypeScript",
    category: "Documentation",
    url: "https://github.com/balajis/networkstatebook",
  },
  {
    name: "Praxis App",
    author: "praxisapp",
    description: "Mobile app for the Praxis Network State community.",
    stars: "580",
    forks: "45",
    language: "React Native",
    category: "Mobile",
    url: "https://github.com/praxisapp/app",
  },
  {
    name: "Network State Node",
    author: "network-state",
    description: "Run your own node for decentralized governance and coordination.",
    stars: "890",
    forks: "120",
    language: "Rust",
    category: "Infrastructure",
    url: "https://github.com/network-state/node",
  },
  {
    name: "DAO Governance Toolkit",
    author: "aragon",
    description: "Tools for decentralized autonomous organizations and on-chain voting.",
    stars: "2.3k",
    forks: "340",
    language: "Solidity",
    category: "Governance",
    url: "https://github.com/aragon/dao-toolkit",
  },
  {
    name: "Cabin Dashboard",
    author: "CabinDAO",
    description: "Community management and coliving coordination tools.",
    stars: "420",
    forks: "67",
    language: "Next.js",
    category: "Community",
    url: "https://github.com/CabinDAO/cabin",
  },
  {
    name: "Network State Map",
    author: "nsmap",
    description: "Visualize Network States and their members around the world.",
    stars: "650",
    forks: "89",
    language: "JavaScript",
    category: "Visualization",
    url: "https://github.com/nsmap/map",
  },
  {
    name: "Crypto City Simulator",
    author: "vbuterin",
    description: "Simulate economic models for charter cities and Network States.",
    stars: "1.8k",
    forks: "230",
    language: "Python",
    category: "Simulation",
    url: "https://github.com/vbuterin/city-sim",
  },
  {
    name: "Snapshot Voting",
    author: "snapshot-labs",
    description: "Off-chain gasless voting for DAOs and decentralized communities.",
    stars: "3.5k",
    forks: "520",
    language: "Vue.js",
    category: "Governance",
    url: "https://github.com/snapshot-labs/snapshot",
  },
  {
    name: "Citizen Registry",
    author: "networkstate",
    description: "Decentralized identity and citizenship registry for Network States.",
    stars: "720",
    forks: "95",
    language: "Solidity",
    category: "Identity",
    url: "https://github.com/networkstate/citizen-registry",
  },
  {
    name: "Territory NFTs",
    author: "territorio",
    description: "NFT-based land and territory ownership for virtual and physical spaces.",
    stars: "540",
    forks: "78",
    language: "Solidity",
    category: "NFT",
    url: "https://github.com/territorio/nft",
  },
];

export default function ToolingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║        "Software is eating the world, blockchain is             ║
║         eating government." - Not Marc Andreessen               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ NETWORK STATE TOOLING ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Open-source tools for building, governing, and scaling Network States.
          Fork it. Build it. Ship it.
        </p>
      </section>

      {/* Categories */}
      <section className="flex flex-wrap gap-2 justify-center">
        {["All", "Governance", "Infrastructure", "Community", "Identity", "Visualization"].map(
          (category) => (
            <button
              key={category}
              className="px-4 py-2 font-mono text-xs border-2 border-border bg-background hover:bg-accent transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              [ {category.toUpperCase()} ]
            </button>
          )
        )}
      </section>

      {/* Tools Grid */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          [ OPEN SOURCE TOOLS ]
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-bold font-mono">{tool.name}</h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    <Github className="inline h-3 w-3 mr-1" />
                    {tool.author}
                  </p>
                </div>
                <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                  {tool.category}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>{tool.stars}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <GitFork className="h-3 w-3" />
                  <span>{tool.forks}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>{tool.language}</span>
                </div>
              </div>

              {/* GitHub Link */}
              <div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  <Github className="h-4 w-4" />
                  VIEW ON GITHUB
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ CONTRIBUTE TO THE STACK ]</h3>
        <p className="text-sm font-mono text-muted-foreground max-w-2xl mx-auto">
          Building tools for Network States? Submit a PR to add your project.
          All code is open-source. All contributions are welcome.
        </p>
        <button className="border-2 border-border px-6 py-3 bg-primary text-primary-foreground font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          [ SUBMIT YOUR TOOL ] →
        </button>
      </section>

      {/* Meme Section */}
      <section className="border-2 border-border p-6 bg-card text-center">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">
{`
    ┌─────────────────────────────────────────────────┐
    │                                                 │
    │  "Code is law."                                │
    │  "Fork the government."                        │
    │  "npm install @network-state/core"            │
    │                                                 │
    │  [ open source everything ] [ wagmi ]          │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
