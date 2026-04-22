# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application using the App Router, React 19, TypeScript, and Tailwind CSS v4. The project is configured with shadcn/ui component library (New York style) and uses Turbopack for development and builds.

## Development Commands

- **Development server**: `npm run dev` (runs with Turbopack)
- **Production build**: `npm run build` (builds with Turbopack)
- **Start production server**: `npm run start`
- **Lint**: `npm run lint` (ESLint with Next.js config)

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router
- **React**: 19.1.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Bundler**: Turbopack (development and production)

### Project Structure
- `app/`: Next.js App Router pages and layouts
  - `layout.tsx`: Root layout with Geist Sans and Geist Mono fonts
  - `page.tsx`: Home page
  - `globals.css`: Global styles with Tailwind CSS v4 and CSS variables for theming
  - `societies/[slug]/page.tsx`: Society detail page (SSG with `generateStaticParams`)
- `lib/`: Utility functions and data
  - `utils.ts`: Contains `cn()` helper for merging Tailwind classes with clsx and tailwind-merge
  - `actions/events.ts`: Server actions for fetching events from Supabase (cached with `unstable_cache`)
  - `actions/societies.ts`: Server actions for fetching societies from Supabase
  - `data/jobs-database.ts`: Static job listings database
  - `data/societies-database.ts`: `SocietyDatabase` type definition
  - `utils/society-matcher.ts`: `societyNamesMatch()` for flexible name matching across events/jobs/societies
  - `utils/slug.ts`: `societyNameToSlug()`, `findSocietyBySlug()` helpers
  - `hooks/useClientTimezone.ts`: Client-side timezone conversion for events
- `components/`: React components (structured for shadcn/ui)
  - `ui/`: shadcn/ui components (use `npx shadcn@latest add <component>` to add new components)
  - `icons/social-icons.tsx`: Shared SVG icons (XIcon, DiscordIcon, YoutubeIcon, TelegramIcon)
  - `society/`: Society page components (see Society Components below)
  - `society-detail-client.tsx`: Society detail page orchestrator (composes society/ components, real social stats from Supabase)
  - `societies-page-client.tsx`: Societies list page with filtering, precomputed event/job lookups via useMemo
- `public/`: Static assets

### Society Components (`components/society/`)

Modular components used by the society detail page:

- `society-logo.tsx`: Reusable logo with `size` prop (`sm`/`md`/`lg`), Image with fallback to initials
- `society-badges.tsx`: Location, category, type, founded badges
- `society-social-links.tsx`: Social links row with `showLabels` prop for detail vs card contexts, `slug` prop for internal linking
- `society-schedule-call.tsx`: Schedule a Call CTA with Google Meet link, topics list
- `society-radar.tsx`: Community score radar chart + metrics sidebar (currently hidden)
- `society-content.tsx`: Editorial content sections (overview, history, kid-friendly, discount, FAQs, etc.) — receives `content: SocietyContentData | null` as a prop from the page; returns `null` if absent
- `society-related.tsx`: Related societies grid
- `society-jobs.tsx`: Open positions section, returns null if no jobs match
- `society-events.tsx`: Upcoming events section with timezone conversion, returns null if no events match
- `society-reviews.tsx`: Community reviews/testimonials (currently hidden from detail page)

Editorial content lives in `content/societies/{slug}.json`, loaded server-side via `loadSocietyContent(slug)` in `lib/data/society-content.ts`. These files are managed by the `society-scraper` repo (weekly automated PRs) — hand edits are overwritten. To adjust copy, modify the scraper prompt; for one-off tweaks, edit the JSON directly.

### Path Aliases
The project uses `@/*` as an alias for the root directory (configured in [tsconfig.json](tsconfig.json)).

### Styling System
- Tailwind CSS v4 with custom theme using CSS variables in OKLCH color space
- Dark mode support via `.dark` class
- Comprehensive design token system for colors, spacing, and radii
- Uses `tw-animate-css` for animations
- Custom utility `cn()` in `lib/utils.ts` for conditional class merging

### shadcn/ui Configuration
Configured in [components.json](components.json):
- Style: "new-york"
- Base color: "neutral"
- Icon library: lucide
- CSS variables enabled
- Component aliases set up for easy imports

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: "bundler"
- JSX: "preserve" (handled by Next.js)

### ESLint Configuration
Uses Next.js recommended presets:
- `next/core-web-vitals`
- `next/typescript`
Ignores: `node_modules`, `.next`, `out`, `build`, `next-env.d.ts`

## Adding Components

To add shadcn/ui components:
```bash
npx shadcn@latest add <component-name>
```

Components will be added to `components/ui/` and automatically configured to work with the project's styling system.

## Page Metadata Guidelines

When creating new pages, follow the title and meta description conventions in:
`./.agents/skills/page-metadata/AGENTS.md`

**Quick reference:**
- Homepage title starts with `nsnodes.com`
- All other page titles end with `| nsnodes.com`
- Meta descriptions should be 150-160 characters

## Performance Guidelines

- **Memoize expensive lookups**: When a page iterates over societies and matches them against events or jobs using `societyNamesMatch()`, precompute the results into a `Map` or `Set` with `useMemo` keyed on the input data. Do NOT call `societyNamesMatch()` inside render loops or sort callbacks on every render.
- **Pattern**: Build lookup maps once when data changes, then use `map.get(name)` or `set.has(name)` in render. See `societies-page-client.tsx` for the reference implementation (`eventsBySociety`, `upcomingCountBySociety`, `openPositionsBySociety`).
- **`societyNamesMatch()`** is expensive (normalization, string splitting, acronym checks) — avoid calling it per-row per-render.
- **Supabase data is cached for 1 hour** in `lib/actions/societies.ts`. Restart the dev server to clear the cache during development.

## SEO Guidelines

- Society detail pages use JSON-LD structured data (Organization + FAQPage schema) — see `app/societies/[slug]/page.tsx`
- Each society page sets `alternates.canonical` and page-specific OG URL (not the homepage)
- Use `TITLE_OVERRIDES` in the page's `generateMetadata` for custom per-society titles
- Description is auto-generated from the first overview paragraph in `content/societies/{slug}.json` (truncated to 155 chars)
