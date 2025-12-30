"use client";

import type { CoreCommandment } from '@/lib/types/corecommand';
import CoreCommandVotingButtons from '@/components/corecommand-voting-buttons';

interface CoreCommandCardProps {
  commandment: CoreCommandment;
  onVote: (id: string, voteType: 'up' | 'down', voterName: string) => void;
}

export default function CoreCommandCard({
  commandment,
  onVote
}: CoreCommandCardProps) {
  return (
    <div className="border-2 border-border p-3 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
      <div className="flex gap-3">
        {/* Left: Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header: Title and Net Votes */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold font-mono leading-tight flex-1">
              {commandment.title}
            </h3>
            <div className="flex-shrink-0 text-right">
              <div className={`text-lg font-bold font-mono leading-none ${commandment.netVotes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {commandment.netVotes > 0 ? '+' : ''}{commandment.netVotes}
              </div>
            </div>
          </div>

          {/* The Commandment */}
          <div className="border-l-2 border-primary pl-2 py-1 bg-muted/50">
            <p className="font-mono text-sm font-semibold italic leading-snug">
              &quot;{commandment.commandment}&quot;
            </p>
          </div>

          {/* Description */}
          <p className="text-xs font-mono text-foreground leading-relaxed">
            {commandment.description}
          </p>

          {/* Date */}
          <div className="text-[10px] font-mono text-muted-foreground">
            Proposed: {commandment.createdAt.toLocaleDateString()}
          </div>
        </div>

        {/* Right: Voting */}
        <div className="flex-shrink-0 w-36">
          <CoreCommandVotingButtons
            upvotes={commandment.upvotes}
            downvotes={commandment.downvotes}
            voterNames={commandment.voterNames}
            onVote={(voteType, name) => onVote(commandment.id, voteType, name)}
          />
        </div>
      </div>
    </div>
  );
}
