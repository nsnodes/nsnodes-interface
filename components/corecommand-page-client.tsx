"use client";

import { useState, useEffect } from 'react';
import { Sparkles, Plus, Search, X } from 'lucide-react';
import type { CoreCommandment } from '@/lib/types/corecommand';
import CoreCommandCard from '@/components/corecommand-card';
import CoreCommandSubmissionForm from '@/components/corecommand-submission-form';
import CoreCommandIdeaGenerator from '@/components/corecommand-idea-generator';

interface CoreCommandPageClientProps {
  commandments: CoreCommandment[];
}

export default function CoreCommandPageClient({ commandments }: CoreCommandPageClientProps) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showIdeaGenerator, setShowIdeaGenerator] = useState(false);
  const [commandmentsList, setCommandmentsList] = useState<CoreCommandment[]>(commandments);
  const [sortBy, setSortBy] = useState<'popularity' | 'recency'>('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [allCommandments, setAllCommandments] = useState<CoreCommandment[]>(commandments);

  const handleNewCommandment = (newCommandment: CoreCommandment) => {
    const commandmentWithProposer: CoreCommandment = {
      ...newCommandment,
      proposedBy: `${newCommandment.proposedBy || 'anonymous.eth'}`
    };
    const newList = [commandmentWithProposer, ...allCommandments];
    setAllCommandments(newList);
    setCommandmentsList(newList);
    setShowSubmissionForm(false);
  };

  const handleIdeaPosted = (newCommandment: CoreCommandment) => {
    const commandmentWithProposer: CoreCommandment = {
      ...newCommandment,
      proposedBy: `${newCommandment.proposedBy || 'anonymous.eth'}`
    };
    const newList = [commandmentWithProposer, ...allCommandments];
    setAllCommandments(newList);
    setCommandmentsList(newList);
    setShowIdeaGenerator(false);
  };

  const handleVote = (id: string, voteType: 'up' | 'down', voterName: string) => {
    const updateList = (list: CoreCommandment[]) => list.map(cmd => {
      if (cmd.id !== id) return cmd;

      // Check if already voted
      if (cmd.voterNames.includes(voterName)) {
        return cmd; // Already voted, no change
      }

      const updatedCmd = { ...cmd };
      updatedCmd.voterNames = [...cmd.voterNames, voterName];

      if (voteType === 'up') {
        updatedCmd.upvotes += 1;
      } else {
        updatedCmd.downvotes += 1;
      }

      updatedCmd.netVotes = updatedCmd.upvotes - updatedCmd.downvotes;
      return updatedCmd;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.netVotes - a.netVotes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setAllCommandments(updateList(allCommandments));
    setCommandmentsList(updateList(commandmentsList));
  };

  // Smart search using LLM
  const performSmartSearch = async (query: string) => {
    if (!query.trim()) {
      setCommandmentsList(allCommandments);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // First, try semantic search using LLM
      const response = await fetch('/api/corecommand/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        try {
          const data = await response.json();
          if (data.matches && data.matches.length > 0) {
            setCommandmentsList(data.matches);
            return;
          }
        } catch (jsonError) {
          console.error('Failed to parse search response:', jsonError);
        }
      } else {
        console.error('Search API returned non-OK status:', response.status);
      }
    } catch (error) {
      console.log('Semantic search unavailable, falling back to text search:', error);
    }

    // Fallback to text-based search (always runs if semantic search doesn't return results)
    const lowercaseQuery = query.toLowerCase();
    const filtered = allCommandments.filter(cmd =>
      cmd.title.toLowerCase().includes(lowercaseQuery) ||
      cmd.commandment.toLowerCase().includes(lowercaseQuery) ||
      cmd.description.toLowerCase().includes(lowercaseQuery)
    );
    setCommandmentsList(filtered);
  } finally {
      // Always reset searching state, even if something goes wrong
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSmartSearch(searchQuery);
      } else {
        setCommandmentsList(allCommandments);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setCommandmentsList(allCommandments);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section - Two Column Layout */}
      <section className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left: Main Content */}
        <div className="text-center lg:text-left space-y-4 flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ CORE COMMANDMENTS ]
          </h1>
          <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-lg">
            Propose and vote on moral commandments for network societies.
            Inspired by Balaji&apos;s concept of moral innovations - new ethical frameworks
            for the digital age.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button
              type="button"
              onClick={() => {
                setShowIdeaGenerator(!showIdeaGenerator);
                setShowSubmissionForm(false);
              }}
              className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              [ GENERATE IDEAS ]
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSubmissionForm(!showSubmissionForm);
                setShowIdeaGenerator(false);
              }}
              className="px-6 py-3 border-2 border-border bg-background hover:bg-accent transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              [ PROPOSE COMMANDMENT ]
            </button>
          </div>
        </div>

        {/* Right: Meme Placeholder */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="w-full border-2 border-dashed border-border p-8 bg-muted/30 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] min-h-[220px] flex items-center justify-center">
            <p className="font-mono text-sm font-bold text-muted-foreground">
              [ RELATED MEME ]
            </p>
          </div>
        </div>
      </section>

      {/* Full-Width Dropdowns */}
      {/* Idea Generator Dropdown */}
      {showIdeaGenerator && (
        <div className="border-2 border-border bg-card p-6">
          <CoreCommandIdeaGenerator
            onClose={() => setShowIdeaGenerator(false)}
            onSubmit={handleIdeaPosted}
          />
        </div>
      )}

      {/* Submission Form Dropdown */}
      {showSubmissionForm && (
        <div className="border-2 border-border bg-card p-6">
          <CoreCommandSubmissionForm
            onSubmit={handleNewCommandment}
            onClose={() => setShowSubmissionForm(false)}
          />
        </div>
      )}

      {/* Commandments List */}
      <section className="space-y-6">
        <div className="space-y-4">
          {/* Header with Search and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold font-mono">
              [ COMMANDMENTS ] {searchQuery && `(${commandmentsList.length} found)`}
            </h2>

            {/* Sort Toggle */}
            <select
              value={sortBy}
              title="Sort commandments by"
              onChange={(e) => {
                const newSortBy = e.target.value as 'popularity' | 'recency';
                setSortBy(newSortBy);
                setCommandmentsList(prev => {
                  const sorted = [...prev];
                  if (newSortBy === 'popularity') {
                    return sorted.sort((a, b) => b.netVotes - a.netVotes);
                  } else {
                    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  }
                });
              }}
              className="px-4 py-2 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="recency">Sort by: Recency</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Semantic search (e.g., 'privacy', 'governance', 'identity')"
              className="w-full pl-10 pr-10 py-2 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground animate-pulse">
                AI...
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {commandmentsList.map((commandment) => (
            <CoreCommandCard
              key={commandment.id}
              commandment={commandment}
              onVote={handleVote}
            />
          ))}
          {commandmentsList.length === 0 && searchQuery && (
            <div className="text-center py-12 border-2 border-border bg-muted/50">
              <p className="font-mono text-muted-foreground">
                No commandments found matching &quot;{searchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-mono text-sm hover:bg-primary/90 transition-colors"
              >
                [ CLEAR SEARCH ]
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="border-2 border-border p-8 bg-card text-center space-y-4">
        <h3 className="text-xl font-bold font-mono">[ ABOUT CORE COMMANDMENTS ]</h3>
        <p className="text-sm font-mono text-muted-foreground max-w-3xl mx-auto">
          As nation states decline, network states rise. But they need new ethical frameworks -
          moral innovations that align with digital-first, opt-in, borderless communities.
          These commandments explore what becomes possible when cryptography enables new forms of
          property, identity, governance, and cooperation.
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          Inspired by Balaji Srinivasan&apos;s work on network states and moral innovations.
        </p>
      </section>
    </div>
  );
}
