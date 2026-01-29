"use client";

import { useState } from 'react';
import { Sparkles, Shuffle, X, Plus } from 'lucide-react';
import type { CoreCommandSuggestion, CoreCommandment } from '@/lib/types/corecommand';
import { getCommandmentsByPopularity } from '@/lib/data/corecommand-database';

interface CoreCommandIdeaGeneratorProps {
  onClose: () => void;
  onSubmit?: (commandment: CoreCommandment) => void;
}

export default function CoreCommandIdeaGenerator({ onClose, onSubmit }: CoreCommandIdeaGeneratorProps) {
  const [mode, setMode] = useState<'random' | 'context'>('random');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<CoreCommandSuggestion[]>([]);
  const [error, setError] = useState('');
  const [postingIndex, setPostingIndex] = useState<number | null>(null);
  const [submitterName, setSubmitterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateWithAI = async () => {
    if (mode === 'context' && !context.trim()) {
      setError('Please provide context for generation');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Get existing commandments to avoid duplicates
      const existingCommandments = getCommandmentsByPopularity();
      const existingTitles = existingCommandments.map(c => c.title);

      const response = await fetch('/api/corecommand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          context: mode === 'context' ? context : undefined,
          count: 1,
          existingTitles
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate ideas');
      }

      const data = await response.json();
      setSuggestions(prev => [...prev, ...data.ideas]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate ideas. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = (index: number) => {
    setPostingIndex(index);
  };

  const handleSubmitPost = async (index: number) => {
    if (!submitterName.trim()) {
      alert('Please enter your name');
      return;
    }

    if (!onSubmit) {
      alert('Submit function not available');
      return;
    }

    setIsSubmitting(true);

    const suggestion = suggestions[index];
    const ethName = submitterName.endsWith('.eth') ? submitterName : `${submitterName}.eth`;
    const newCommandment: CoreCommandment = {
      id: Date.now().toString(),
      title: suggestion.title,
      commandment: suggestion.commandment,
      description: suggestion.description,
      upvotes: 0,
      downvotes: 0,
      voterNames: [],
      createdAt: new Date(),
      netVotes: 0,
      proposedBy: ethName
    };

    onSubmit(newCommandment);

    // Reset posting state
    setPostingIndex(null);
    setSubmitterName('');
    setIsSubmitting(false);

    // Clear the suggestion after posting
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  const cancelPost = () => {
    setPostingIndex(null);
    setSubmitterName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold font-mono flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          [ IDEA GENERATOR ]
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-accent transition-colors"
          aria-label="Close idea generator"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Mode Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setMode('random');
              setSuggestions([]);
              setError('');
            }}
            className={`p-3 border-2 font-mono font-bold text-xs transition-colors ${
              mode === 'random'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-accent'
            }`}
          >
            <Shuffle className="h-4 w-4 mx-auto mb-1" />
            Random
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('context');
              setSuggestions([]);
              setError('');
            }}
            className={`p-3 border-2 font-mono font-bold text-xs transition-colors ${
              mode === 'context'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:bg-accent'
            }`}
          >
            <Sparkles className="h-4 w-4 mx-auto mb-1" />
            From Context
          </button>
        </div>

        {/* Context Input (only for context mode) */}
        {mode === 'context' && (
          <div>
            <label className="block text-sm font-mono font-medium mb-1">
              Your Context
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe a theme or concept you're interested in... e.g., 'cryptocurrency and education' or 'decentralized identity'"
              rows={3}
              className="w-full px-3 py-2 border-2 border-border bg-background font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          type="button"
          onClick={generateWithAI}
          disabled={isGenerating || (mode === 'context' && !context.trim())}
          className="w-full px-6 py-3 border-2 border-border bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {isGenerating
            ? '[ GENERATING... ]'
            : suggestions.length > 0
              ? '[ GENERATE ANOTHER ]'
              : '[ GENERATE IDEA ]'
          }
        </button>

        {error && (
          <div className="p-3 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Suggestions Display */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-mono">[ GENERATED IDEAS ]</h3>

          {suggestions.map((suggestion, index) => (
            <div key={index} className="border-2 border-border p-4 bg-muted/50 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold font-mono">{suggestion.title}</h4>
                <span className="text-xs font-mono text-muted-foreground">#{index + 1}</span>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2 bg-background">
                <p className="font-mono text-sm font-semibold italic">
                  &quot;{suggestion.commandment}&quot;
                </p>
              </div>

              <div className="text-sm font-mono text-muted-foreground">
                {suggestion.description}
              </div>

              {/* Post Button or Name Input */}
              {postingIndex === index ? (
                <div className="pt-3 border-t border-border space-y-3">
                  <div>
                    <label className="block text-xs font-mono font-medium mb-1">
                      Your .eth Name *
                    </label>
                    <input
                      type="text"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                      placeholder="yourname.eth"
                      className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">
                      Will be shown as "Proposed by yourname.eth"
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSubmitPost(index)}
                      disabled={isSubmitting || !submitterName.trim()}
                      className="flex-1 px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {isSubmitting ? '[ POSTING... ]' : '[ POST ]'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelPost}
                      disabled={isSubmitting}
                      className="px-4 py-2 border-2 border-border bg-background hover:bg-accent font-mono font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      [ CANCEL ]
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => handlePost(index)}
                    className="w-full px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    [ POST THIS COMMANDMENT ]
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
