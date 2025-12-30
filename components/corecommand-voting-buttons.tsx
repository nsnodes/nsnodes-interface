"use client";

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface CoreCommandVotingButtonsProps {
  upvotes: number;
  downvotes: number;
  voterNames: string[];
  onVote: (voteType: 'up' | 'down', voterName: string) => void;
}

export default function CoreCommandVotingButtons({
  upvotes,
  downvotes,
  voterNames,
  onVote
}: CoreCommandVotingButtonsProps) {
  const [voterName, setVoterName] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!voterName.trim()) {
      alert('Please enter your name to vote');
      return;
    }

    if (voterNames.includes(voterName.trim())) {
      alert('You have already voted on this commandment');
      setHasVoted(true);
      return;
    }

    setIsSubmitting(true);
    onVote(voteType, voterName.trim());
    setHasVoted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {hasVoted ? (
        <div className="text-center text-xs font-mono text-muted-foreground py-1">
          ✓ Voted
        </div>
      ) : (
        <>
          {/* Name Input */}
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
            placeholder="Your name..."
            className="w-full px-2 py-1 border-2 border-border bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isSubmitting}
          />

          {/* Vote Buttons */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleVote('up')}
              disabled={isSubmitting || !voterName.trim()}
              className="px-2 py-1 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-colors font-mono font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbsUp className="h-3 w-3" />
              ({upvotes})
            </button>
            <button
              type="button"
              onClick={() => handleVote('down')}
              disabled={isSubmitting || !voterName.trim()}
              className="px-2 py-1 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-mono font-bold text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ThumbsDown className="h-3 w-3" />
              ({downvotes})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
