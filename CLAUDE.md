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

## Git Commit Guidelines

### Creating Backup Commits

After completing any significant work or changes, create regular git commits to serve as checkpoints/backup points. This makes it easy to revert if something goes wrong.

**When to commit:**
- After completing a feature or task
- Before making major refactoring changes
- After fixing bugs or implementing new functionality
- When ending a work session

**How to commit:**
```bash
# Stage all changes
git add .

# Create a descriptive commit message
git commit -m "<type>: <description>"

# Examples:
git commit -m "feat: add compact creator cards with dropdown for recent posts"
git commit -m "fix: resolve article loading issue in content hub"
git commit -m "style: reduce padding and spacing in creator cards"
git commit -m "refactor: reorganize content page layout"
```

**Commit message types:**
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - Styling changes (CSS, layout, spacing)
- `refactor:` - Code restructuring without behavior change
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks, updates
- `test:` - Adding or updating tests
- `perf:` - Performance improvements

**Viewing commit history:**
```bash
# Show recent commits
git log --oneline -10

# Show detailed commit history
git log --graph --oneline --all

# View changes in a commit
git show <commit-hash>
```

**Reverting if needed:**
```bash
# Revert to a previous commit (creates new commit)
git revert <commit-hash>

# Or reset (use with caution - discards uncommitted changes)
git reset --hard <commit-hash>
```
