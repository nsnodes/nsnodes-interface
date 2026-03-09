'use client';

import { useState } from 'react';
import { Users, MapPin, ExternalLink, MessageCircle, Globe, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { SocietyDatabase } from '@/lib/data/societies-database';

// Custom SVG icons
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// Mock social stats for societies
const getMockSocialStats = (societyName: string) => {
  // Generate consistent fake numbers based on society name
  const hash = societyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const x_followers = Math.floor((hash * 137) % 50000 + 1000);
  const discord_members = Math.floor((hash * 149) % 20000 + 500);
  const youtube_subscribers = Math.floor((hash * 163) % 30000 + 1000);
  const telegram_members = Math.floor((hash * 179) % 10000 + 200);

  // Format with commas manually to avoid hydration mismatch
  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return {
    x_followers: formatNumber(x_followers),
    discord_members: formatNumber(discord_members),
    youtube_subscribers: formatNumber(youtube_subscribers),
    telegram_members: formatNumber(telegram_members)
  };
};

// Community radar scores (mock data sourced from Telegram discussions)
const RADAR_CATEGORIES = [
  'Scalability Tension',
  'Autonomy & Agency',
  'Quality of Life',
  'Belonging & Community',
  'Purpose Alignment',
  'Economic Opportunity',
] as const;

const RADAR_INFO: Record<string, { subtitle: string; measures: string; matters: string }> = {
  'Belonging & Community': {
    subtitle: 'The "We" Factor',
    measures: 'Emotional cohesion, mutual recognition, and sense of family among members. Not just "are people nice?" but "do they identify as us?"',
    matters: 'Predicts retention better than any other metric. Networks with high belonging survive conflicts; those without it fragment when growth slows.',
  },
  'Autonomy & Agency': {
    subtitle: 'The "I" Factor',
    measures: 'Perceived ability to self-direct, influence collective decisions, and exit without penalty. Freedom within the system, not just from external systems.',
    matters: 'Distinguishes true network societies from cults or corporations. High autonomy + high belonging = sustainable decentralization.',
  },
  'Economic Opportunity': {
    subtitle: 'The "Fairness" Factor',
    measures: 'Perceived access to sustainable livelihood, fair compensation, and wealth-building potential—not just "can I make money?" but "is the game rigged?"',
    matters: 'Economic anxiety destroys community faster than any other stressor. This metric predicts "mission drift" when idealists burn out.',
  },
  'Purpose Alignment': {
    subtitle: 'The "Why" Factor',
    measures: 'Clarity and resonance of collective mission. Do members share the same vision of what they\'re building and why?',
    matters: 'Purpose-aligned members stay through hardship; transactionally-motivated members leave at first better offer.',
  },
  'Scalability Tension': {
    subtitle: 'The "Growth Pain" Factor',
    measures: 'Felt experience of scale—coordination overhead, intimacy dilution, "vibe" preservation struggles. Not technical capacity, but psychological impact of growth.',
    matters: 'Every network society faces this. The question isn\'t whether tension exists, but whether members feel equipped to navigate it together.',
  },
  'Quality of Life': {
    subtitle: 'The "Sustainability" Factor',
    measures: 'Collective and individual wellbeing—burnout prevention, work-life balance, mental health, long-term viability. Not luxury, but sustainability.',
    matters: 'The "canary in the coal mine" metric. Quality of life degradation predicts collapse before financial or governance metrics show distress.',
  },
};

const getMockRadarScores = (societyName: string): number[] => {
  const lowerName = societyName.toLowerCase();
  if (lowerName.includes('próspera') || lowerName.includes('prospera')) {
    return [72, 91, 78, 65, 83, 88]; // out of 100
  }
  return [50, 50, 50, 50, 50, 50];
};

// Per-axis colors for the radar chart
const RADAR_COLORS = [
  '#f97316', // Scalability - orange
  '#8b5cf6', // Autonomy - violet
  '#10b981', // Quality of Life - emerald
  '#3b82f6', // Community - blue
  '#ec4899', // Attractiveness - pink
  '#eab308', // Economic Opportunity - yellow
];

// Metrics Display component with bars
function MetricsDisplay({ scores }: { scores: number[] }) {
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Overall Community Score */}
      <div className="text-center pb-4 border-b border-border">
        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Community Score</div>
        <div className="text-4xl font-bold font-mono text-primary">{averageScore}</div>
        <div className="text-xs font-mono text-muted-foreground mt-1">/ 100</div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-3">
        {RADAR_CATEGORIES.map((label, i) => {
          const info = RADAR_INFO[label];
          return (
            <div key={label} className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-help"
                  onMouseEnter={() => setActiveTooltip(label)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => setActiveTooltip(activeTooltip === label ? null : label)}
                >
                  {label}
                  <Info className="h-3 w-3 opacity-40" />
                </button>
                <span className="text-xs font-bold font-mono" style={{ color: RADAR_COLORS[i] }}>
                  {scores[i]}
                </span>
              </div>
              <div className="w-full h-2 bg-muted border border-border overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${scores[i]}%`,
                    backgroundColor: RADAR_COLORS[i]
                  }}
                />
              </div>

              {/* Tooltip */}
              {activeTooltip === label && info && (
                <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 border-2 border-border bg-card shadow-brutal-md text-left">
                  <div className="text-xs font-mono font-bold mb-1" style={{ color: RADAR_COLORS[i] }}>
                    {info.subtitle}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground leading-relaxed mb-2">
                    <span className="font-bold text-foreground">Measures: </span>
                    {info.measures}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground">Why it matters: </span>
                    {info.matters}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// SVG Radar Chart component
function RadarChart({ scores }: { scores: number[] }) {
  const viewSize = 500;
  const cx = viewSize / 2;
  const cy = viewSize / 2;
  const levels = 5;
  const maxRadius = 150;
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const getAngle = (i: number) =>
    (Math.PI * 2 * i) / RADAR_CATEGORIES.length - Math.PI / 2;

  const getPolygonPoints = (values: number[]) =>
    values
      .map((val, i) => {
        const angle = getAngle(i);
        const r = (val / 100) * maxRadius;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(' ');

  const getLabelPos = (i: number) => {
    const angle = getAngle(i);
    const r = maxRadius + 32;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Convert SVG coords to percentage for tooltip positioning
  const getTooltipStyle = (i: number): React.CSSProperties => {
    const pos = getLabelPos(i);
    const xPct = (pos.x / viewSize) * 100;
    const yPct = (pos.y / viewSize) * 100;
    return {
      left: `${xPct}%`,
      top: `${yPct}%`,
      transform: 'translate(-50%, -110%)',
    };
  };

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} className="w-full aspect-square">
      <defs>
        <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Grid levels */}
      {Array.from({ length: levels }, (_, level) => {
        const r = ((level + 1) / levels) * maxRadius;
        const points = RADAR_CATEGORIES.map((_, i) => {
          const angle = getAngle(i);
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-border"
            opacity={level === levels - 1 ? 0.6 : 0.3}
            strokeDasharray={level < levels - 1 ? '2,4' : undefined}
          />
        );
      })}

      {/* Axis lines with color */}
      {RADAR_CATEGORIES.map((_, i) => {
        const angle = getAngle(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + maxRadius * Math.cos(angle)}
            y2={cy + maxRadius * Math.sin(angle)}
            stroke={RADAR_COLORS[i]}
            strokeWidth="1"
            opacity="0.3"
          />
        );
      })}

      {/* Data polygon - gradient fill and stroke */}
      <polygon
        points={getPolygonPoints(scores)}
        fill="url(#radar-fill)"
        stroke="url(#radar-stroke)"
        strokeWidth="2.5"
      />

      {/* Data points with per-axis color */}
      {scores.map((val, i) => {
        const angle = getAngle(i);
        const r = (val / 100) * maxRadius;
        return (
          <g key={i}>
            <circle
              cx={cx + r * Math.cos(angle)}
              cy={cy + r * Math.sin(angle)}
              r="5"
              fill={RADAR_COLORS[i]}
              opacity="0.2"
            />
            <circle
              cx={cx + r * Math.cos(angle)}
              cy={cy + r * Math.sin(angle)}
              r="3"
              fill={RADAR_COLORS[i]}
            />
          </g>
        );
      })}

      {/* Labels */}
      {RADAR_CATEGORIES.map((label, i) => {
        const pos = getLabelPos(i);
        // Split long labels into two lines
        const words = label.split(' ');
        const isMultiWord = words.length > 1;
        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={RADAR_COLORS[i]}
            style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600, cursor: 'help' }}
            onMouseEnter={() => setHoveredAxis(i)}
            onMouseLeave={() => setHoveredAxis(null)}
            onClick={() => setHoveredAxis(hoveredAxis === i ? null : i)}
          >
            {isMultiWord ? (
              <>
                <tspan x={pos.x} dy="-0.5em">{words.slice(0, Math.ceil(words.length / 2)).join(' ')}</tspan>
                <tspan x={pos.x} dy="1.15em">{words.slice(Math.ceil(words.length / 2)).join(' ')}</tspan>
              </>
            ) : (
              label
            )}
          </text>
        );
      })}

      {/* Score labels */}
      {scores.map((val, i) => {
        const angle = getAngle(i);
        const r = (val / 100) * maxRadius + 14;
        return (
          <text
            key={`score-${i}`}
            x={cx + r * Math.cos(angle)}
            y={cy + r * Math.sin(angle)}
            textAnchor="middle"
            dominantBaseline="central"
            fill={RADAR_COLORS[i]}
            style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700 }}
          >
            {val}
          </text>
        );
      })}

      {/* Invisible hit areas for hover on each axis */}
      {RADAR_CATEGORIES.map((_, i) => {
        const pos = getLabelPos(i);
        return (
          <circle
            key={`hit-${i}`}
            cx={pos.x}
            cy={pos.y}
            r="30"
            fill="transparent"
            style={{ cursor: 'help' }}
            onMouseEnter={() => setHoveredAxis(i)}
            onMouseLeave={() => setHoveredAxis(null)}
            onClick={() => setHoveredAxis(hoveredAxis === i ? null : i)}
          />
        );
      })}
    </svg>

      {/* HTML tooltip overlay */}
      {hoveredAxis !== null && RADAR_INFO[RADAR_CATEGORIES[hoveredAxis]] && (
        <div
          className="absolute z-50 w-72 p-3 border-2 border-border bg-card shadow-brutal-md text-left pointer-events-none"
          style={getTooltipStyle(hoveredAxis)}
        >
          <div className="text-xs font-mono font-bold mb-1" style={{ color: RADAR_COLORS[hoveredAxis] }}>
            {RADAR_INFO[RADAR_CATEGORIES[hoveredAxis]].subtitle}
          </div>
          <div className="text-xs font-mono text-muted-foreground leading-relaxed mb-2">
            <span className="font-bold text-foreground">Measures: </span>
            {RADAR_INFO[RADAR_CATEGORIES[hoveredAxis]].measures}
          </div>
          <div className="text-xs font-mono text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Why it matters: </span>
            {RADAR_INFO[RADAR_CATEGORIES[hoveredAxis]].matters}
          </div>
        </div>
      )}
    </div>
  );
}

interface SocietyDetailClientProps {
  society: SocietyDatabase;
  relatedSocieties: SocietyDatabase[];
}

export default function SocietyDetailClient({
  society,
  relatedSocieties
}: SocietyDetailClientProps) {
  const mockStats = getMockSocialStats(society.name);

  // Derive radar scores from society props (already multiplied by 100 in server transform)
  const radarScores = [
    society.scalability ?? 50,
    society.autonomy ?? 50,
    society.qol ?? 50,
    society.belonging ?? 50,
    society.purpose ?? 50,
    society.economic ?? 50,
  ];

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
        <div className="space-y-4 border-2 border-border p-6 bg-card shadow-brutal-md">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden relative">
              {society.icon ? (
                <div className="w-full h-full p-2 flex items-center justify-center">
                  <Image
                    src={society.icon}
                    alt={`${society.name} logo`}
                    width={80}
                    height={80}
                    unoptimized={true}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const parent = target.parentElement?.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-2xl font-bold font-mono text-primary">${society.name.substring(0, 2).toUpperCase()}</span>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <span className="text-2xl font-bold font-mono text-primary">
                  {society.name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name, Mission, Badges */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold font-mono mb-2">
                [ {society.name.toUpperCase()} ]
              </h1>
              {society.mission && (
                <p className="text-sm font-mono text-muted-foreground mb-4 leading-relaxed">
                  {society.mission}
                </p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                  {society.type}
                </div>
                {society.category && (
                  <div className="text-xs font-mono px-2 py-1 border border-primary/30 bg-primary/5 text-primary whitespace-nowrap">
                    {society.category}
                  </div>
                )}
                {society.founded && society.founded.toLowerCase() !== 'unknown' && (
                  <div className="text-xs font-mono px-2 py-1 border border-border bg-muted whitespace-nowrap">
                    Founded {society.founded}
                  </div>
                )}
                {society.location && (
                  <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground px-2 py-1 border border-border bg-muted">
                    <MapPin className="h-3 w-3" />
                    {society.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* X Followers */}
          {mockStats.x_followers !== 'N/A' && (
            <div className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <div className="flex items-center gap-2 mb-2">
                <XIcon className="h-4 w-4" />
                <span className="text-xs font-mono text-muted-foreground uppercase">[ X FOLLOWERS ]</span>
              </div>
              <div className="text-2xl font-bold font-mono">{mockStats.x_followers}</div>
            </div>
          )}

          {/* Discord Members */}
          {mockStats.discord_members !== 'N/A' && (
            <div className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <div className="flex items-center gap-2 mb-2">
                <DiscordIcon className="h-4 w-4" />
                <span className="text-xs font-mono text-muted-foreground uppercase">[ DISCORD MEMBERS ]</span>
              </div>
              <div className="text-2xl font-bold font-mono">{mockStats.discord_members}</div>
            </div>
          )}

          {/* YouTube Subscribers */}
          {mockStats.youtube_subscribers !== 'N/A' && (
            <div className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span className="text-xs font-mono text-muted-foreground uppercase">[ YOUTUBE SUBS ]</span>
              </div>
              <div className="text-2xl font-bold font-mono">{mockStats.youtube_subscribers}</div>
            </div>
          )}

          {/* Telegram Members */}
          {mockStats.telegram_members !== 'N/A' && (
            <div className="border-2 border-border p-4 bg-background shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-mono text-muted-foreground uppercase">[ TELEGRAM ]</span>
              </div>
              <div className="text-2xl font-bold font-mono">{mockStats.telegram_members}</div>
            </div>
          )}
        </div>

        {/* Community Radar and Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radar Chart - 2/3 width */}
          <div className="lg:col-span-2 border-2 border-border bg-card shadow-brutal-md">
            <div className="p-4 border-b border-border">
              <h2 className="font-mono font-bold text-sm">[ COMMUNITY SCORE ]</h2>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                Aggregated from community discussions on{' '}
                <a
                  href="https://t.me/+P3r-8XdRfXoyYWVl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Telegram
                </a>
              </p>
            </div>
            <div className="p-6">
              <RadarChart scores={radarScores} />
            </div>
            {society.telegram && (
              <div className="px-4 pb-4">
                <a
                  href={society.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-mono font-bold shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  <MessageCircle className="h-4 w-4" />
                  Join the conversation on Telegram
                </a>
              </div>
            )}
          </div>

          {/* Metrics Display */}
          <div className="border-2 border-border bg-card shadow-brutal-md p-6">
            <MetricsDisplay scores={radarScores} />
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-2 border-2 border-border p-4 bg-background shadow-brutal-md">
          <a
            href={society.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            title="Website"
          >
            <Globe className="h-3 w-3" />
            Website
          </a>
          {society.x && (
            <a
              href={society.x}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              title="X (Twitter)"
            >
              <XIcon className="h-3 w-3" />
              X
            </a>
          )}
          {society.discord && (
            <a
              href={society.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              title="Discord"
            >
              <DiscordIcon className="h-3 w-3" />
              Discord
            </a>
          )}
          {society.telegram && (
            <a
              href={society.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              title="Telegram"
            >
              <MessageCircle className="h-3 w-3" />
              Telegram
            </a>
          )}
          {society.application && (
            <a
              href={society.application}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ml-auto"
              title="Apply to Society"
            >
              Apply
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Related Societies */}
        {relatedSocieties.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-mono">[ RELATED SOCIETIES ]</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSocieties.map((relatedSociety, index) => (
                <Link
                  key={index}
                  href={`/societies/${relatedSociety.name.toLowerCase().trim().replace(/^the\s+/i, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`}
                  className="border-2 border-border p-4 bg-card hover:bg-accent transition-colors shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
                      {relatedSociety.icon ? (
                        <div className="w-full h-full p-1 flex items-center justify-center">
                          <Image
                            src={relatedSociety.icon}
                            alt={`${relatedSociety.name} logo`}
                            width={48}
                            height={48}
                            unoptimized={true}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-bold font-mono text-primary">
                          {relatedSociety.name.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono font-bold text-sm">{relatedSociety.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs font-mono px-1.5 py-0.5 border border-border bg-muted whitespace-nowrap">
                          {relatedSociety.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
