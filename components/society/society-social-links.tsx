'use client';

import { Globe, ExternalLink, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { XIcon, DiscordIcon, TelegramIcon, YoutubeIcon } from '@/components/icons/social-icons';

interface SocietySocialLinksProps {
  website: string;
  x?: string;
  discord?: string;
  telegram?: string | null;
  youtube?: string;
  application?: string;
  showLabels?: boolean;
  hasOpenPositions?: boolean;
  societyName?: string;
  applyAlignEnd?: boolean;
  slug?: string;
}

export function SocietySocialLinks({
  website, x, discord, telegram, youtube, application,
  showLabels = false, hasOpenPositions = false, societyName, applyAlignEnd = false, slug
}: SocietySocialLinksProps) {
  const btnClass = "inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={website} target="_blank" rel="noopener noreferrer" className={btnClass} title="Website">
        <Globe className="h-3 w-3" />
        {showLabels && 'Website'}
      </a>
      {x && (
        <a href={x} target="_blank" rel="noopener noreferrer" className={btnClass} title="X (Twitter)">
          <XIcon className="h-3 w-3" />
          {showLabels && 'X'}
        </a>
      )}
      {discord && (
        <a href={discord} target="_blank" rel="noopener noreferrer" className={btnClass} title="Discord">
          <DiscordIcon className="h-3 w-3" />
          {showLabels && 'Discord'}
        </a>
      )}
      {telegram && (
        <a href={telegram} target="_blank" rel="noopener noreferrer" className={btnClass} title="Telegram">
          <TelegramIcon className="h-3 w-3" />
          {showLabels && 'Telegram'}
        </a>
      )}
      {youtube && (
        <a href={youtube} target="_blank" rel="noopener noreferrer" className={btnClass} title="YouTube">
          <YoutubeIcon className="h-3 w-3" />
          {showLabels && 'YouTube'}
        </a>
      )}
      {hasOpenPositions && societyName && (
        <Link
          href={`/jobs?employer=${encodeURIComponent(societyName)}`}
          className={btnClass}
          title="View Open Positions"
        >
          <Briefcase className="h-3 w-3" />
          Recruiting now
        </Link>
      )}
      {slug && (
        <Link
          href={`/societies/${slug}`}
          className={`inline-flex items-center gap-1 px-3 py-2 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none${applyAlignEnd ? ' ml-auto' : ''}`}
        >
          More Info
          <ExternalLink className="h-3 w-3" />
        </Link>
      )}
      {application && !slug && (
        <a
          href={application}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 px-3 py-2 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none${applyAlignEnd ? ' ml-auto' : ''}`}
        >
          Apply
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
