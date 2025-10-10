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
- `lib/`: Utility functions
  - `utils.ts`: Contains `cn()` helper for merging Tailwind classes with clsx and tailwind-merge
- `components/`: React components (structured for shadcn/ui)
  - `ui/`: shadcn/ui components (use `npx shadcn@latest add <component>` to add new components)
- `public/`: Static assets

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
