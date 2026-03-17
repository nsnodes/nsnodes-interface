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
  - `icons/social-icons.tsx`: Shared SVG icons (XIcon, DiscordIcon)
  - `society/`: Society page components (see Society Components below)
  - `society-detail-client.tsx`: Society detail page orchestrator (~160 lines, composes society/ components)
  - `societies-page-client.tsx`: Societies list page with filtering, MiniRadar, score visualizations
- `public/`: Static assets

### Society Components (`components/society/`)

Modular components used by the society detail page:

- `society-logo.tsx`: Reusable logo with `size` prop (`sm`/`md`/`lg`), Image with fallback to initials
- `society-badges.tsx`: Location, category, type, founded badges
- `society-social-links.tsx`: Social links row with `showLabels` prop for detail vs card contexts
- `society-radar.tsx`: Community score radar chart + metrics sidebar (exports `RADAR_CATEGORIES`, `RADAR_COLORS`, `RADAR_INFO`)
- `society-content.tsx`: Editorial content sections (overview, history, FAQs, etc.) keyed by slug in `SOCIETY_CONTENT` record
- `society-related.tsx`: Related societies grid
- `society-jobs.tsx`: Open positions section, returns null if no jobs match
- `society-events.tsx`: Upcoming events section with timezone conversion, returns null if no events match
- `society-reviews.tsx`: Community reviews/testimonials, keyed by slug in `SOCIETY_REVIEWS` record, returns null if no reviews

To add editorial content for a new society, add an entry to the `SOCIETY_CONTENT` record in `society-content.tsx` keyed by the society's slug.
To add reviews for a society, add an entry to the `SOCIETY_REVIEWS` record in `society-reviews.tsx` keyed by the society's slug.

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
