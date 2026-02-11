/**
 * Centralized color constants for programmatic use.
 *
 * All underlying color VALUES live in app/globals.css as CSS custom properties.
 * This file only maps semantic names to Tailwind utility class strings so that
 * arrays and lookup objects stay in sync with the CSS source of truth.
 */

/* ── Timeline palette ── */

export const TIMELINE_COLORS = [
  'bg-timeline-1',
  'bg-timeline-2',
  'bg-timeline-3',
  'bg-timeline-4',
  'bg-timeline-5',
  'bg-timeline-6',
  'bg-timeline-7',
  'bg-timeline-8',
  'bg-timeline-9',
  'bg-timeline-10',
] as const;

export type TimelineColor = (typeof TIMELINE_COLORS)[number];

/* ── Network state palette ── */

const NETWORK_STATE_COLORS: Record<string, string> = {
  'edgpatagonia': 'bg-palette-1',
  'Network School': 'bg-palette-2',
  '4Seas': 'bg-palette-3',
  'Próspera': 'bg-palette-4',
  'INFINITA': 'bg-palette-5',
  'Invisible Garden Argentina': 'bg-palette-6',
  'Software Zuzalu': 'bg-palette-7',
  'Tomek ⚡ K': 'bg-palette-8',
  'Andrea S.': 'bg-palette-9',
  'Ârc': 'bg-palette-10',
  'Commons': 'bg-palette-11',
  'Edge City': 'bg-palette-12',
  'Logos': 'bg-palette-13',
  'Ipê City': 'bg-palette-14',
  'Build_Republic': 'bg-palette-15',
  'Infinita': 'bg-palette-16',
  'Crecimiento': 'bg-palette-17',
  'Aleph Crecimiento': 'bg-palette-18',
  'Montelibero': 'bg-palette-19',
};

export const DEFAULT_NETWORK_COLOR = 'bg-palette-default';

export function getNetworkStateColor(networkState: string): string {
  return NETWORK_STATE_COLORS[networkState] || DEFAULT_NETWORK_COLOR;
}
