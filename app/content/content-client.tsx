"use client";

import { useEffect, useState, useRef } from "react";
import { Youtube, Twitter, Rss, ExternalLink, BookOpen, FileText, ChevronDown, Lock } from "lucide-react";
import { getArticles } from "@/lib/actions/articles";
import { UIArticle } from "@/lib/types/articles";

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

// Substack icon SVG
const SubstackIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
  </svg>
);

// Paragraph icon (stylized P)
const ParagraphIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 4H7a4 4 0 0 0 0 8h2v8h2V6h2v14h2V6h2V4h-4z"/>
  </svg>
);

// Article card component for consistent rendering
function ArticleCard({ article, className = "" }: { article: UIArticle; className?: string }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all ${className}`}
    >
      {/* Main content area - grows to fill space */}
      <div className="flex-1 p-5">
        {/* Article Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Source Icon */}
            <div className="flex items-center gap-1 px-2 py-1 border border-border bg-muted text-xs font-mono">
              {article.source === 'substack' ? (
                <SubstackIcon className="h-3 w-3" />
              ) : (
                <ParagraphIcon className="h-3 w-3" />
              )}
            </div>
            {/* Author */}
            <span className="text-xs font-mono text-muted-foreground">
              {article.author}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {article.isPaid && (
              <div className="flex items-center gap-1 px-2 py-1 border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono">
                <Lock className="h-3 w-3" />
              </div>
            )}
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold font-mono mb-2 group-hover:text-primary transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="text-sm font-mono text-muted-foreground leading-relaxed line-clamp-2">
            {article.subtitle}
          </p>
        )}
      </div>

      {/* Date footer - always at bottom */}
      <div className="px-5 py-3 border-t border-border bg-muted/30">
        <span className="text-xs font-mono text-muted-foreground">
          {article.date}
        </span>
      </div>
    </a>
  );
}

export default function ContentClient() {
  const [articles, setArticles] = useState<UIArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const articlesData = await getArticles({ limit: 100 });
      setArticles(articlesData);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Split articles: first 4 for preview, rest for expanded view
  const previewArticles = articles.slice(0, 4);
  const remainingArticles = articles.slice(4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">

        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
          [ CONTENT HUB ]
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm sm:text-base">
          Follow the thinkers, builders, and memers shaping the Network State movement.
          These are the people defining our decentralized future.
        </p>
      </section>

      {/* Articles Feed Section */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <FileText className="h-6 w-6" />
          [ LATEST ARTICLES ]
        </h2>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-2 border-border bg-card animate-pulse">
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-5 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div className="px-5 py-3 border-t border-border bg-muted/30">
                  <div className="h-3 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Preview Grid - Always visible */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {previewArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Expanded Articles Container */}
            {remainingArticles.length > 0 && (
              <div className="border-2 border-border bg-card">
                {/* Expand/Collapse Header */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm">
                      {isExpanded ? "[ SHOWING ALL ]" : "[ LOAD MORE ]"}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {remainingArticles.length} more article{remainingArticles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Scrollable Content Area */}
                {isExpanded && (
                  <div
                    ref={scrollContainerRef}
                    className="border-t-2 border-border max-h-[600px] overflow-y-auto"
                  >
                    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {remainingArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {articles.length === 0 && (
              <div className="border-2 border-border p-12 bg-card text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="font-mono text-muted-foreground">No articles found</p>
              </div>
            )}
          </>
        )}
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

        </pre>
      </section>
    </div>
  );
}
