"use client";

import { Briefcase, ExternalLink, MapPin, DollarSign } from "lucide-react";

const jobs = [
  {
    title: "Community Manager",
    company: "Praxis",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $90k",
    description: "Build and engage our growing community of builders and creators.",
    tags: ["Community", "Web3", "Remote"],
  },
  {
    title: "Solidity Developer",
    company: "Balajistan DAO",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $120k",
    description: "Build smart contracts for our decentralized governance system.",
    tags: ["Solidity", "Smart Contracts", "DeFi"],
  },
  {
    title: "Urban Planner",
    company: "Próspera",
    location: "Honduras",
    type: "Full-time",
    salary: "$70k - $100k",
    description: "Design the physical infrastructure for our charter city.",
    tags: ["Urban Planning", "Architecture", "On-site"],
  },
  {
    title: "Marketing Lead",
    company: "Afropolitan",
    location: "Remote / Lagos",
    type: "Full-time",
    salary: "$50k - $80k",
    description: "Drive growth and awareness for the digital nation for Africans.",
    tags: ["Marketing", "Growth", "Web3"],
  },
  {
    title: "Full-Stack Developer",
    company: "Cabin",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $140k",
    description: "Build tools for decentralized communities and coliving spaces.",
    tags: ["React", "Node.js", "Web3"],
  },
  {
    title: "Legal Counsel",
    company: "Network State Legal DAO",
    location: "Remote",
    type: "Part-time",
    salary: "$60k - $100k",
    description: "Navigate the legal frameworks for new forms of governance.",
    tags: ["Legal", "Governance", "Crypto"],
  },
  {
    title: "Content Creator",
    company: "NS Media Collective",
    location: "Remote",
    type: "Contract",
    salary: "$40k - $70k",
    description: "Create content about Network States for social media.",
    tags: ["Content", "Social Media", "Writing"],
  },
  {
    title: "Tokenomics Designer",
    company: "Multiple DAOs",
    location: "Remote",
    type: "Contract",
    salary: "$100k - $150k",
    description: "Design token systems for emerging Network State projects.",
    tags: ["Tokenomics", "Economics", "Web3"],
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║         "Build the future you want to live in"                  ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ NETWORK STATE JOBS ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Find opportunities in the emerging Network State ecosystem. From smart contracts
          to city planning, we&apos;re building new nations.
        </p>
      </section>

      {/* CTA Button */}
      <section className="flex justify-center">
        <button className="border-2 border-border px-8 py-4 bg-primary text-primary-foreground font-mono font-bold text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
          [ POST A JOB ] →
        </button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">24</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Open Positions</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">12</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Network States Hiring</div>
        </div>
        <div className="border-2 border-border p-6 text-center bg-card">
          <div className="text-3xl font-bold font-mono text-primary">5</div>
          <div className="text-sm font-mono text-muted-foreground mt-2">Countries Represented</div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          [ LATEST OPPORTUNITIES ]
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-mono">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-mono">
                    <span className="font-semibold">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 font-mono text-sm sm:text-base font-bold whitespace-nowrap">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm font-mono text-muted-foreground">{job.description}</p>

              {/* Tags and Apply Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-xs font-mono border border-border bg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="border-2 border-border px-4 py-2 bg-background font-mono text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                  APPLY
                  <ExternalLink className="h-3 w-3" />
                </button>
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
    │  "Anon, your 9-5 is a legacy institution.      │
    │   The Network State needs YOU."                │
    │                                                 │
    │  [ probably nothing ] [ few ] [ lfg ]          │
    │                                                 │
    └─────────────────────────────────────────────────┘
`}
        </pre>
      </section>
    </div>
  );
}
