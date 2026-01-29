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

## Page Hero Section Pattern

All new feature pages should follow this two-column hero section pattern:

```tsx
<section className="flex flex-col lg:flex-row items-start gap-8">
  {/* Left: Main Content */}
  <div className="text-center lg:text-left space-y-4 flex-1">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
      [ PAGE TITLE ]
    </h1>
    <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-lg">
      Brief description of what this page does. Keep it to 2-3 lines maximum.
    </p>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
      <button className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        [ PRIMARY ACTION ]
      </button>
      <button className="px-6 py-3 border-2 border-border bg-background hover:bg-accent transition-colors font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        [ SECONDARY ACTION ]
      </button>
    </div>
  </div>

  {/* Right: Meme Placeholder */}
  <div className="lg:w-96 flex-shrink-0">
    <div className="w-full border-2 border-dashed border-border p-8 bg-muted/30 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] min-h-[220px] flex items-center justify-center">
      <p className="font-mono text-sm font-bold text-muted-foreground">
        [ RELATED MEME ]
      </p>
    </div>
  </div>
</section>
```

**Key Pattern Elements:**

1. **Two-column layout**: Main content (flex-1) on left, meme placeholder (lg:w-96) on right
2. **Responsive**: Stacks vertically on mobile, side-by-side on lg+ screens
3. **Meme placeholder**: Right side with dashed border, centered text
4. **Action buttons**: Stack vertically on mobile, row on sm+ screens, centered on mobile/left-aligned on desktop
5. **Shadow style**: `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]`
6. **Hover effect**: `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`

**Full-Width Dropdowns:**

Interactive sections (forms, generators, etc.) should appear as full-width dropdowns below the hero section:

```tsx
{/* Full-Width Dropdowns - OUTSIDE the two-column section */}
{showDropdown && (
  <div className="border-2 border-border bg-card p-6">
    <DropdownComponent onClose={() => setShowDropdown(false)} />
  </div>
)}
```

This ensures dropdowns span full width, not constrained to the left column.

**Examples:**
- `/corecommand` page
- `/society` page

## Page Metadata Guidelines

When creating new pages, follow the title and meta description conventions in:
`./.agents/skills/page-metadata/AGENTS.md`

**Quick reference:**
- Homepage title starts with `nsnodes.com`
- All other page titles end with `| nsnodes.com`
- Meta descriptions should be 150-160 characters

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
