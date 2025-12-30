"use client";

import { useEffect, useState, useRef } from "react";
import { Youtube, Twitter, Rss, ExternalLink, BookOpen, FileText, ChevronDown, Lock } from "lucide-react";
import { getArticles } from "@/lib/actions/articles";
import { UIArticle } from "@/lib/types/articles";

// NSNODES Creators - Core Network State builders
const nsnodesCreators = [
  {
    name: "Eric",
    handle: "@ericmiki.eth",
    description: "Network State builder and writer.",
    platforms: {
      substack: "https://paragraph.xyz/@ericmiki.eth",
      x: "N/A",
    },
    topics: ["Network States", "Crypto", "Governance"],
    followers: { substack: "1K+", x: "N/A" },
  },
  {
    name: "Parallelcitizen",
    handle: "@parallelcitizen",
    description: "Parallel citizen and network state advocate.",
    platforms: {
      substack: "https://www.parallelcitizen.xyz",
      x: "N/A",
    },
    topics: ["Citizenship", "Network States", "Governance"],
    followers: { substack: "1K+", x: "N/A" },
  },
  {
    name: "Michel",
    handle: "@4thgenerationcivilization",
    description: "Fourth generation civilization and network states.",
    platforms: {
      substack: "https://4thgenerationcivilization.substack.com",
      x: "N/A",
    },
    topics: ["Civilization", "Network States", "Future"],
    followers: { substack: "900+", x: "N/A" },
  },
  {
    name: "Sterling",
    handle: "@sterlinlujan",
    description: "Sterling Lujan network state perspectives.",
    platforms: {
      substack: "https://sterlinlujan.substack.com",
      x: "N/A",
    },
    topics: ["Network States", "Crypto", "Culture"],
    followers: { substack: "2.5K+", x: "N/A" },
  },
];

// NS Related Creators - Broader crypto and tech ecosystem
const nsRelatedCreators = [
  {
    name: "Balaji Srinivasan",
    handle: "@balajis",
    description: "Former CTO of Coinbase. Author of 'The Network State'. The OG.",
    platforms: {
      x: "https://twitter.com/balajis",
      substack: "https://balajis.com",
    },
    topics: ["Network States", "Crypto", "Longevity"],
    followers: { x: "1M+", substack: "50K+" },
  },
  {
    name: "Dryden Brown",
    handle: "@drydenwtbrown",
    description: "Founder of Praxis. Building the first Network State city.",
    platforms: {
      x: "https://twitter.com/drydenwtbrown",
      youtube: "https://youtube.com/@praxis",
    },
    topics: ["Praxis", "City Building", "Startups"],
    followers: { x: "50K+", substack: "N/A" },
  },
  {
    name: "Erik Torenberg",
    handle: "@eriktorenberg",
    description: "Tech writer and community builder. Network State enthusiast.",
    platforms: {
      x: "https://twitter.com/eriktorenberg",
      substack: "https://eriktorenberg.substack.com",
    },
    topics: ["Startups", "Community", "Network States"],
    followers: { x: "200K+", substack: "50K+" },
  },
  {
    name: "Cabin DAO",
    handle: "@creatorcabins",
    description: "Building a decentralized city. IRL Network State experiments.",
    platforms: {
      x: "https://twitter.com/creatorcabins",
      substack: "https://www.cabin.city",
    },
    topics: ["Coliving", "DAOs", "Community"],
    followers: { x: "25K+", substack: "N/A" },
  },
  {
    name: "Ray",
    handle: "@embassy",
    description: "Building Embassy network state communities.",
    platforms: {
      substack: "https://embassy.svit.la",
      x: "N/A",
    },
    topics: ["Community", "Network States", "Governance"],
    followers: { substack: "2K+", x: "N/A" },
  },
  {
    name: "Franco",
    handle: "@frontierfieldnotes",
    description: "Frontier field notes and network state explorations.",
    platforms: {
      substack: "https://frontierfieldnotes.substack.com",
      x: "N/A",
    },
    topics: ["Frontier", "Network States", "Exploration"],
    followers: { substack: "500+", x: "N/A" },
  },
  {
    name: "Noah",
    handle: "@themasterfool",
    description: "Network state writer and commentator.",
    platforms: {
      substack: "https://themasterfool.substack.com",
      x: "N/A",
    },
    topics: ["Network States", "Analysis", "Commentary"],
    followers: { substack: "800+", x: "N/A" },
  },
  {
    name: "Auspicious",
    handle: "@auspicious",
    description: "Auspicious network state insights.",
    platforms: {
      substack: "https://auspicious.substack.com",
      x: "N/A",
    },
    topics: ["Network States", "Strategy", "Analysis"],
    followers: { substack: "1.5K+", x: "N/A" },
  },
  {
    name: "Jarrett",
    handle: "@networkstatemagazine",
    description: "Publisher of Network State Magazine.",
    platforms: {
      substack: "https://open.substack.com/pub/networkstatemagazine/p/introducing-network-state-magazine",
      x: "N/A",
    },
    topics: ["Media", "Network States", "Publishing"],
    followers: { substack: "3K+", x: "N/A" },
  },
  {
    name: "Isa",
    handle: "@utopiainbeta",
    description: "Utopia in beta - exploring new forms of governance.",
    platforms: {
      substack: "https://utopiainbeta.substack.com",
      x: "N/A",
    },
    topics: ["Utopia", "Governance", "Experiments"],
    followers: { substack: "2K+", x: "N/A" },
  },
  {
    name: "Mario",
    handle: "@hypermario",
    description: "Hyper Mario network state content.",
    platforms: {
      substack: "https://substack.com/@hypermario",
      x: "N/A",
    },
    topics: ["Network States", "Tech", "Innovation"],
    followers: { substack: "1.2K+", x: "N/A" },
  },
  {
    name: "Vitalik Buterin",
    handle: "@VitalikButerin",
    description: "Ethereum founder. Philosopher-king of crypto.",
    platforms: {
      x: "https://twitter.com/VitalikButerin",
      substack: "https://vitalik.ca",
    },
    topics: ["Ethereum", "Governance", "Coordination"],
    followers: { x: "5M+", substack: "N/A" },
  },
  {
    name: "Naval Ravikant",
    handle: "@naval",
    description: "Philosopher, investor, and builder. Wealth wisdom in tweet form.",
    platforms: {
      x: "https://twitter.com/naval",
      substack: "https://nav.al",
    },
    topics: ["Philosophy", "Wealth", "Happiness"],
    followers: { x: "2M+", substack: "N/A" },
  },
  {
    name: "Lex Fridman",
    handle: "@lexfridman",
    description: "AI researcher. Long-form conversations with builders and thinkers.",
    platforms: {
      x: "https://twitter.com/lexfridman",
      youtube: "https://youtube.com/@lexfridman",
    },
    topics: ["AI", "Philosophy", "Long-form"],
    followers: { x: "3M+", substack: "N/A" },
  },
  {
    name: "Lyn Alden",
    handle: "@LynAldenContact",
    description: "Macroeconomics and Bitcoin. The best technical analysis.",
    platforms: {
      x: "https://twitter.com/LynAldenContact",
      substack: "https://lynalden.com",
    },
    topics: ["Bitcoin", "Macro", "Finance"],
    followers: { x: "800K+", substack: "100K+" },
  },
];

// X logo SVG
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

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
  const [expandedCreators, setExpandedCreators] = useState<Set<string>>(new Set());
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

  // Split articles: first 10 for preview, rest for expanded view
  const previewArticles = articles.slice(0, 10);
  const remainingArticles = articles.slice(10);

  // Toggle creator dropdown
  const toggleCreator = (creatorName: string) => {
    setExpandedCreators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(creatorName)) {
        newSet.delete(creatorName);
      } else {
        newSet.add(creatorName);
      }
      return newSet;
    });
  };

  // Get articles for a specific creator
  const getCreatorArticles = (creatorName: string) => {
    return articles.filter(article => article.author === creatorName);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-start gap-8">
        <div className="text-center lg:text-left space-y-4 flex-1">
          <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">

          </pre>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ NS CONTENT ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-lg">
            Follow the thinkers, builders, and memers shaping the Network State movement.
            These are the people defining our decentralized future.
          </p>

          {/* CTA Section */}
          <div className="pt-4">
            <a
              href="mailto:nsnodes@gmail.com?subject=Content Creator Listing Request&body=Hi, I'd like to list my Network State content on NSNodes. Please include: Name, Platform (Substack, X, YouTube, etc.), Follower count, Focus areas, and Content links."
              className="inline-block border-2 border-border px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              [ LIST YOUR NS CONTENT ] →
            </a>
          </div>

          {/* Article Feed Section - Under CTA */}
          <div className="pt-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
              <FileText className="h-6 w-6" />
              [ ARTICLE FEED ]
            </h2>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4">
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
                <div className="grid grid-cols-1 gap-4">
                  {previewArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Expanded Articles Container */}
                {remainingArticles.length > 0 && (
                  <div className="border-2 border-border bg-card">
                    {/* Expand/Collapse Header */}
                    <button
                      type="button"
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
                        <div className="p-4 grid grid-cols-1 gap-4">
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
          </div>
        </div>

        {/* NSNODES Creators - Top Right */}
        <div className="lg:w-96 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold font-mono flex items-center gap-2 justify-center lg:justify-start text-foreground px-4 py-2 border-2 border-primary/50 bg-primary/5">
              <BookOpen className="h-5 w-5" />
              [ NSNODES CREATORS ]
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {nsnodesCreators.map((creator, index) => (
              <div
                key={index}
                className="border-2 border-primary/30 p-3 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-2"
              >
                {/* Header with name, platform buttons, and recent posts toggle */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold font-mono">{creator.name}</h3>
                  <div className="flex items-center gap-2">
                    {creator.platforms.substack && (
                      <a
                        href={creator.platforms.substack}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      >
                        <SubstackIcon className="h-2 w-2" />
                        <span>{creator.followers.substack}</span>
                      </a>
                    )}
                    {creator.platforms.x && (
                      <a
                        href={creator.platforms.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      >
                        <XIcon className="h-2 w-2" />
                        <span>{creator.followers.x}</span>
                      </a>
                    )}
                    {creator.platforms.substack && (
                      <button
                        type="button"
                        onClick={() => toggleCreator(creator.name)}
                        className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                      >
                        <span className="font-bold">{expandedCreators.has(creator.name) ? "[–]" : "[+]"}</span>
                        <span>Posts</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Substack Posts Dropdown */}
                {creator.platforms.substack && expandedCreators.has(creator.name) && (
                  <>
                    <div className="border-t border-border max-h-[300px] overflow-y-auto p-2 space-y-2">
                      {getCreatorArticles(creator.name).length > 0 ? (
                        getCreatorArticles(creator.name).map((article) => (
                          <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 border border-border bg-background hover:bg-accent transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1">
                                <SubstackIcon className="h-2 w-2" />
                                <span className="text-[10px] font-mono text-muted-foreground">{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {article.isPaid && (
                                  <div className="flex items-center gap-0.5 px-1 py-0.5 border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] font-mono">
                                    <Lock className="h-2 w-2" />
                                  </div>
                                )}
                                <ExternalLink className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                            <h4 className="text-[10px] font-bold font-mono mb-0.5 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                              {article.title}
                            </h4>
                            <span className="text-[8px] font-mono text-muted-foreground">
                              {article.date}
                            </span>
                          </a>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground font-mono text-[10px]">
                          No recent posts
                        </div>
                      )}
                    </div>

                    {/* Show All Link */}
                    {getCreatorArticles(creator.name).length > 0 && (
                      <div className="border-t border-border p-1.5">
                        <a
                          href={creator.platforms.substack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center w-full px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                          <span className="flex items-center justify-center gap-1">
                            Show all posts
                            <ExternalLink className="h-2 w-2" />
                          </span>
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
            </div>
          </div>

          {/* NS Related Creators Section */}
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold font-mono flex items-center gap-2 justify-center lg:justify-start">
              <BookOpen className="h-5 w-5" />
              [ NS RELATED CREATORS ]
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {nsRelatedCreators.map((creator, index) => (
                <div
                  key={index}
                  className="border-2 border-border p-3 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all space-y-2"
                >
                  {/* Header with name, platform buttons, and recent posts toggle */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold font-mono">{creator.name}</h3>
                    <div className="flex items-center gap-2">
                      {creator.platforms.substack && (
                        <a
                          href={creator.platforms.substack}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                          <SubstackIcon className="h-2 w-2" />
                          <span>{creator.followers.substack}</span>
                        </a>
                      )}
                      {creator.platforms.x && (
                        <a
                          href={creator.platforms.x}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                          <XIcon className="h-2 w-2" />
                          <span>{creator.followers.x}</span>
                        </a>
                      )}
                      {creator.platforms.substack && (
                        <button
                          type="button"
                          onClick={() => toggleCreator(creator.name)}
                          className="flex items-center gap-1 px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                          <span className="font-bold">{expandedCreators.has(creator.name) ? "[–]" : "[+]"}</span>
                          <span>Posts</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Recent Substack Posts Dropdown */}
                  {creator.platforms.substack && expandedCreators.has(creator.name) && (
                    <>
                      <div className="border-t border-border max-h-[300px] overflow-y-auto p-2 space-y-2">
                        {getCreatorArticles(creator.name).length > 0 ? (
                          getCreatorArticles(creator.name).map((article) => (
                            <a
                              key={article.id}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 border border-border bg-background hover:bg-accent transition-colors group"
                            >
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1">
                                  <SubstackIcon className="h-2 w-2" />
                                  <span className="text-[10px] font-mono text-muted-foreground">{article.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {article.isPaid && (
                                    <div className="flex items-center gap-0.5 px-1 py-0.5 border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] font-mono">
                                      <Lock className="h-2 w-2" />
                                    </div>
                                  )}
                                  <ExternalLink className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <h4 className="text-[10px] font-bold font-mono mb-0.5 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                {article.title}
                              </h4>
                              <span className="text-[8px] font-mono text-muted-foreground">
                                {article.date}
                              </span>
                            </a>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground font-mono text-[10px]">
                            No recent posts
                          </div>
                        )}
                      </div>

                      {/* Show All Link */}
                      {getCreatorArticles(creator.name).length > 0 && (
                        <div className="border-t border-border p-1.5">
                          <a
                            href={creator.platforms.substack}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center w-full px-2 py-1 border-2 border-border bg-background hover:bg-accent transition-colors text-[10px] font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                          >
                            <span className="flex items-center justify-center gap-1">
                              Show all posts
                              <ExternalLink className="h-2 w-2" />
                            </span>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* Two-column layout: Content on left, Sticky Creators on right */}
      <section className="flex flex-col lg:flex-row lg:items-start gap-8 relative">
        {/* Left side - Main content */}
        <div className="flex-1 space-y-12 min-w-0 lg:min-h-[calc(100vh-4rem)]">
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
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold font-mono">The Network State</h3>
                  <ExternalLink className="h-4 w-4" />
                </div>
                <p className="text-sm font-mono text-muted-foreground">Balaji Srinivasan</p>
                <p className="text-xs font-mono text-muted-foreground">The foundational book on network states.</p>
              </a>

              <a
                href="https://vitalik.ca/general/2021/10/31/pos.html"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-border p-6 bg-card hover:bg-accent transition-all space-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold font-mono">Proof of Stake</h3>
                  <ExternalLink className="h-4 w-4" />
                </div>
                <p className="text-sm font-mono text-muted-foreground">Vitalik Buterin</p>
                <p className="text-xs font-mono text-muted-foreground">Understanding the future of blockchain consensus.</p>
              </a>
            </div>
          </section>

          {/* Meme Section */}
          <section className="border-2 border-border p-6 bg-card text-center">
            <pre className="font-mono text-xs sm:text-sm leading-relaxed opacity-80">

            </pre>
          </section>
        </div>
      </section>
    </div>
  );
}
