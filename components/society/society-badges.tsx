import { MapPin } from 'lucide-react';
import type { SocietyLifecycleStatus, SocietyUrlStatus } from '@/lib/data/societies-database';

// Score color helpers shared across pages
export const getScoreColor = (score: number) =>
  score >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
  score >= 50 ? 'text-blue-600 dark:text-blue-400' :
  score >= 25 ? 'text-amber-600 dark:text-amber-400' :
  'text-red-600 dark:text-red-400';

export const getScoreBorderColor = (score: number) =>
  score >= 75 ? 'border-emerald-500/30' :
  score >= 50 ? 'border-blue-500/30' :
  score >= 25 ? 'border-amber-500/30' :
  'border-red-500/30';

export const getScoreBgColor = (score: number) =>
  score >= 75 ? 'bg-emerald-500/5' :
  score >= 50 ? 'bg-blue-500/5' :
  score >= 25 ? 'bg-amber-500/5' :
  'bg-red-500/5';

export const getScoreBarColor = (score: number) =>
  score >= 75 ? 'bg-emerald-500' :
  score >= 50 ? 'bg-blue-500' :
  score >= 25 ? 'bg-amber-500' :
  'bg-red-500';

interface SocietyBadgesProps {
  location?: string;
  category?: string;
  type: string;
  founded?: string;
  tier?: number;
  communityScore?: number;
  status?: SocietyLifecycleStatus;
  urlStatus?: SocietyUrlStatus;
  urlStatusNote?: string;
}

const lifecycleBadgeClasses: Record<SocietyLifecycleStatus, string> = {
  active: 'border-status-success/40 bg-status-success/10 text-status-success',
  watchlist: 'border-status-soon/40 bg-status-soon/10 text-foreground',
  dormant: 'border-muted-foreground/30 bg-muted text-muted-foreground',
  archived: 'border-muted-foreground/30 bg-muted text-muted-foreground',
  removed: 'border-destructive/40 bg-destructive/10 text-destructive',
};

const urlBadgeClasses: Record<SocietyUrlStatus, string> = {
  ok: 'border-status-success/40 bg-status-success/10 text-status-success',
  redirect: 'border-status-soon/40 bg-status-soon/10 text-foreground',
  timeout: 'border-destructive/40 bg-destructive/10 text-destructive',
  error: 'border-destructive/40 bg-destructive/10 text-destructive',
  ssl_error: 'border-destructive/40 bg-destructive/10 text-destructive',
  unknown: 'border-muted-foreground/30 bg-muted text-muted-foreground',
};

export function SocietyBadges({
  location,
  category,
  type,
  founded,
  tier,
  communityScore,
  status,
  urlStatus,
  urlStatusNote,
}: SocietyBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {location && (
        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground px-2 py-1 border border-border bg-muted">
          <MapPin className="h-3 w-3" />
          {location}
        </div>
      )}
      {category && (
        <div className="text-xs font-mono px-2 py-1 border border-primary/30 bg-primary/5 text-primary whitespace-nowrap">
          {category}
        </div>
      )}
      <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
        {type}
      </div>
      {founded && founded.toLowerCase() !== 'unknown' && (
        <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
          Founded {founded}
        </div>
      )}
      {communityScore != null && communityScore > 0 && (
        <div className={`text-xs font-mono px-2 py-1 border ${getScoreBorderColor(communityScore)} ${getScoreBgColor(communityScore)} ${getScoreColor(communityScore)} whitespace-nowrap font-bold`}>
          Score: {communityScore}/100
        </div>
      )}
      {status && status !== 'active' && (
        <div className={`text-xs font-mono px-2 py-1 border whitespace-nowrap ${lifecycleBadgeClasses[status]}`}>
          {status}
        </div>
      )}
      {urlStatus && urlStatus !== 'ok' && (
        <div
          className={`text-xs font-mono px-2 py-1 border whitespace-nowrap ${urlBadgeClasses[urlStatus]}`}
          title={urlStatusNote}
        >
          site: {urlStatus.replace('_', ' ')}
        </div>
      )}
    </div>
  );
}
