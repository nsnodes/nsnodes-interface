'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { SocietyDatabase } from '@/lib/data/societies-database';
import type { Job } from '@/lib/data/jobs-database';
import type { UIEvent } from '@/lib/types/events';
import { XIcon, DiscordIcon, YoutubeIcon, TelegramIcon } from '@/components/icons/social-icons';
import { SocietyLogo } from '@/components/society/society-logo';
import { SocietyBadges } from '@/components/society/society-badges';
import { SocietySocialLinks } from '@/components/society/society-social-links';
import { SocietyScheduleCall } from '@/components/society/society-schedule-call';
import { SocietyContent } from '@/components/society/society-content';
import { SocietyCover } from '@/components/society/society-cover';

import { societyNameToSlug } from '@/lib/utils/slug';
import { SocietyRelated } from '@/components/society/society-related';
import { SocietyJobs } from '@/components/society/society-jobs';
import { UpcomingEventsSection } from '@/components/upcoming-events-section';

const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

interface SocietyDetailClientProps {
  society: SocietyDatabase;
  relatedSocieties: SocietyDatabase[];
  jobs?: Job[];
  events?: UIEvent[];
}

export default function SocietyDetailClient({
  society,
  relatedSocieties,
  jobs = [],
  events = [],
}: SocietyDetailClientProps) {
  const hasStats = society.x_followers != null || society.discord_members != null || society.youtube_subscribers != null || society.telegram_members != null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Back Navigation */}
        <Link
          href="/societies"
          className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-sm font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Societies
        </Link>

        {/* Hero Section */}
        <div className="border-2 border-border bg-card shadow-brutal-md overflow-hidden">
          {/* Cover Image */}
          <SocietyCover slug={societyNameToSlug(society.name)} />
          <div className="space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <SocietyLogo name={society.name} icon={society.icon} size="lg" />
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold font-mono mb-2">
                [ {society.name.toUpperCase()} ]
              </h1>
              {society.mission && (
                <p className="text-sm font-mono text-muted-foreground mb-4 leading-relaxed">
                  {society.mission}
                </p>
              )}
              <SocietyBadges
                location={society.location}
                category={society.category}
                type={society.type}
                founded={society.founded}
              />
              <div className="mt-4">
                <SocietySocialLinks
                  website={society.url}
                  x={society.x}
                  discord={society.discord}
                  telegram={society.telegram}
                  youtube={society.youtube}
                  application={society.application}
                  showLabels
                  hasOpenPositions={jobs.length > 0}
                  societyName={society.name}
                />
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Stats Grid */}
        {hasStats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {society.x_followers != null && (
              <a href={society.x || undefined} target="_blank" rel="noopener noreferrer" className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <XIcon className="h-4 w-4" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">[ X FOLLOWERS ]</span>
                </div>
                <div className="text-2xl font-bold font-mono">{formatNumber(society.x_followers)}</div>
              </a>
            )}
            {society.discord_members != null && (
              <a href={society.discord || undefined} target="_blank" rel="noopener noreferrer" className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <DiscordIcon className="h-4 w-4" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">[ DISCORD MEMBERS ]</span>
                </div>
                <div className="text-2xl font-bold font-mono">{formatNumber(society.discord_members)}</div>
              </a>
            )}
            {society.youtube_subscribers != null && (
              <a href={society.youtube || undefined} target="_blank" rel="noopener noreferrer" className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <YoutubeIcon className="h-4 w-4" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">[ YOUTUBE SUBS ]</span>
                </div>
                <div className="text-2xl font-bold font-mono">{formatNumber(society.youtube_subscribers)}</div>
              </a>
            )}
            {society.telegram_members != null && (
              <a href={society.telegram || undefined} target="_blank" rel="noopener noreferrer" className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <TelegramIcon className="h-4 w-4" />
                  <span className="text-xs font-mono text-muted-foreground uppercase">[ TELEGRAM ]</span>
                </div>
                <div className="text-2xl font-bold font-mono">{formatNumber(society.telegram_members)}</div>
              </a>
            )}
          </div>
        )}

        {/* Schedule a Call (Network School only) */}
        {societyNameToSlug(society.name) === 'network-school' && (
          <SocietyScheduleCall
            url="https://calendar.app.google/qLMUJ9FyAX3n9Ccm7"
            description="Ask us anything about how it is to live at Network School. Team have real life experience from both living and working there."
            topics={[
              'How does the application process work?',
              'How is it to bring kids to Network School?',
              'How does a day look like?',
            ]}
          />
        )}

        {/* Events */}
        {events.length > 0 && (
          <UpcomingEventsSection
            events={events}
            isLoading={false}
            error={null}
            hideFilters
            initialNetworkStates={[society.name]}
            defaultViewMode="gantt"
            compact
          />
        )}

        {/* Content Sections */}
        <SocietyContent societyName={society.name} />

        {/* Jobs */}
        <SocietyJobs jobs={jobs} societyName={society.name} />

        {/* Schedule a Call bottom (Network School only) */}
        {societyNameToSlug(society.name) === 'network-school' && (
          <SocietyScheduleCall
            url="https://calendar.app.google/qLMUJ9FyAX3n9Ccm7"
            description="Ask us anything about how it is to live at Network School. Team have real life experience from both living and working there."
            topics={[
              'How does the application process work?',
              'How is it to bring kids to Network School?',
            ]}
          />
        )}

        {/* Related Societies */}
        <SocietyRelated societies={relatedSocieties} />
      </div>
    </main>
  );
}
