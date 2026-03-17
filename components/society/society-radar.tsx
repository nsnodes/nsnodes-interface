'use client';

import { useState } from 'react';
import { MessageCircle, Info } from 'lucide-react';

export const RADAR_CATEGORIES = [
  'Scalability Tension',
  'Autonomy & Agency',
  'Quality of Life',
  'Belonging & Community',
  'Purpose Alignment',
  'Economic Opportunity',
] as const;

export const RADAR_INFO: Record<string, { subtitle: string; measures: string; matters: string }> = {
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

export const RADAR_COLORS = [
  '#f97316', // Scalability - orange
  '#8b5cf6', // Autonomy - violet
  '#10b981', // Quality of Life - emerald
  '#3b82f6', // Community - blue
  '#ec4899', // Purpose - pink
  '#eab308', // Economic Opportunity - yellow
];

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

        {/* Axis lines */}
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

        {/* Data polygon */}
        <polygon
          points={getPolygonPoints(scores)}
          fill="url(#radar-fill)"
          stroke="url(#radar-stroke)"
          strokeWidth="2.5"
        />

        {/* Data points */}
        {scores.map((val, i) => {
          const angle = getAngle(i);
          const r = (val / 100) * maxRadius;
          return (
            <g key={i}>
              <circle cx={cx + r * Math.cos(angle)} cy={cy + r * Math.sin(angle)} r="5" fill={RADAR_COLORS[i]} opacity="0.2" />
              <circle cx={cx + r * Math.cos(angle)} cy={cy + r * Math.sin(angle)} r="3" fill={RADAR_COLORS[i]} />
            </g>
          );
        })}

        {/* Labels */}
        {RADAR_CATEGORIES.map((label, i) => {
          const pos = getLabelPos(i);
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

        {/* Invisible hit areas */}
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

function MetricsDisplay({ scores }: { scores: number[] }) {
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-center pb-4 border-b border-border">
        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Community Score</div>
        <div className="text-4xl font-bold font-mono text-primary">{averageScore}</div>
        <div className="text-xs font-mono text-muted-foreground mt-1">/ 100</div>
      </div>

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
                  style={{ width: `${scores[i]}%`, backgroundColor: RADAR_COLORS[i] }}
                />
              </div>

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

interface SocietyRadarProps {
  scores: number[];
  telegramUrl?: string;
}

export function SocietyRadar({ scores, telegramUrl }: SocietyRadarProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ COMMUNITY SCORE ]</h2>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Aggregated from community discussions on{' '}
            <a href="https://t.me/+P3r-8XdRfXoyYWVl" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Telegram
            </a>
            . Read more at our{' '}
            <a href="https://nsnodes.substack.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
              Substack post
            </a>
            .
          </p>
        </div>
        <div className="p-6">
          <RadarChart scores={scores} />
        </div>
        {telegramUrl && (
          <div className="px-4 pb-4">
            <a
              href={telegramUrl}
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

      <div className="border-2 border-border bg-card shadow-brutal-md p-6">
        <MetricsDisplay scores={scores} />
      </div>
    </div>
  );
}
