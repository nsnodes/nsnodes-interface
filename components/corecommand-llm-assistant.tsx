"use client";

import { useState } from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import type { CoreCommandWritingImprovement } from '@/lib/types/corecommand';

interface CoreCommandLLMAssistantProps {
  section: 'title' | 'commandment' | 'description';
  currentText: string;
  context?: string;
  onSelect: (improved: string) => void;
  onClose: () => void;
}

export default function CoreCommandLLMAssistant({
  section,
  currentText,
  context,
  onSelect,
  onClose
}: CoreCommandLLMAssistantProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [suggestion, setSuggestion] = useState<CoreCommandWritingImprovement | null>(null);
  const [error, setError] = useState('');

  const improveText = async () => {
    if (!currentText.trim()) {
      setError('Please enter some text first');
      return;
    }

    setIsImproving(true);
    setError('');

    try {
      const response = await fetch('/api/corecommand/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: currentText,
          section,
          context
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to improve text');
      }

      const data = await response.json();
      setSuggestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve text. Please try again.');
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-border p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-mono flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            [ AI WRITING ASSISTANT ]
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Text */}
        <div className="mb-4 p-3 bg-muted/50 border border-border">
          <p className="text-xs font-mono text-muted-foreground mb-1">Current {section}:</p>
          <p className="font-mono text-sm">{currentText || '(empty)'}</p>
        </div>

        {/* Improve Button */}
        {!suggestion && (
          <button
            onClick={improveText}
            disabled={isImproving}
            className="w-full px-4 py-2 border-2 border-primary bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isImproving ? '[ IMPROVING... ]' : '[ IMPROVE WITH AI ]'}
          </button>
        )}

        {error && (
          <div className="p-3 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm mb-4">
            {error}
          </div>
        )}

        {/* Suggestions */}
        {suggestion && (
          <div className="space-y-4">
            {/* Improved Version */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">Recommended:</p>
              <div className="p-3 bg-primary/10 border-2 border-primary space-y-3">
                <p className="font-mono text-sm">{suggestion.improvedText}</p>
                <button
                  onClick={() => onSelect(suggestion.improvedText)}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-mono font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  USE THIS VERSION
                </button>
              </div>
            </div>

            {/* Alternatives */}
            {suggestion.alternatives.length > 0 && (
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">Alternatives:</p>
                <div className="space-y-2">
                  {suggestion.alternatives.map((alt, index) => (
                    <div key={index} className="p-3 bg-muted/50 border border-border space-y-2">
                      <p className="font-mono text-sm">{alt}</p>
                      <button
                        onClick={() => onSelect(alt)}
                        className="w-full px-3 py-1 border-2 border-border bg-background hover:bg-accent font-mono text-xs transition-colors"
                      >
                        Use this version
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {suggestion.reason && (
              <div className="p-3 bg-muted/50 border border-border">
                <p className="text-xs font-mono text-muted-foreground mb-1">Why:</p>
                <p className="font-mono text-sm">{suggestion.reason}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
