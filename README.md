```
 /$$   /$$  /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$$  /$$$$$$$$  /$$$$$$ 
| $$$ | $$ /$$__  $$| $$$ | $$ /$$__  $$| $$__  $$| $$_____/ /$$__  $$
| $$$$| $$| $$  \__/| $$$$| $$| $$  \ $$| $$  \ $$| $$      | $$  \__/
| $$ $$ $$|  $$$$$$ | $$ $$ $$| $$  | $$| $$  | $$| $$$$$   |  $$$$$$ 
| $$  $$$$ \____  $$| $$  $$$$| $$  | $$| $$  | $$| $$__/    \____  $$
| $$\  $$$ /$$  \ $$| $$\  $$$| $$  | $$| $$  | $$| $$       /$$  \ $$
| $$ \  $$|  $$$$$$/| $$ \  $$|  $$$$$$/| $$$$$$$/| $$$$$$$$|  $$$$$$/
|__/  \__/ \______/ |__/  \__/ \______/ |_______/ |________/ \______/ 
```

# NSNodes - Network State Hub

![NSNodes](https://img.shields.io/badge/Status-Live-green) ![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black) ![License](https://img.shields.io/badge/License-MIT-blue)

> The ultimate hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.

## 🚀 Features

- **Event Dashboard** - Track Network State events, conferences, and meetups
- **Jobs Board** - Find opportunities in the Network State ecosystem
- **Content Creators** - Follow the best thinkers and builders in the space
- **VC Directory** - Connect with crypto-native venture capital firms
- **Investment DAO** - Explore decentralized investment opportunities
- **Societies** - Discover Network State societies with community scores, radar charts, jobs, and events
- **Funding Hub** - Grants and VC funding information
- **Open Source Tooling** - Discover GitHub repos building the future
- **Community Hub** - Join the Discord and connect with builders

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **React:** 19.1.0
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (New York style)
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono
- **Bundler:** Turbopack
- **Database:** Supabase (with dynamic events sync)
- **Deployment:** Vercel

## 🏃 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
nsnodes/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Homepage - Event Dashboard
│   ├── jobs/                  # Jobs page
│   ├── content/               # Content creators page
│   ├── vc/                    # Venture capital page
│   ├── investment-dao/        # Investment DAO page
│   ├── societies/             # Societies list page
│   │   └── [slug]/            # Society detail pages (SSG)
│   ├── funding/               # Funding hub (grants & VC)
│   ├── tooling/               # GitHub tooling page
│   ├── contact/               # Contact/community page
│   ├── layout.tsx             # Root layout with nav
│   └── globals.css            # Global styles + ASCII effects
├── components/                # React components
│   ├── icons/                 # Shared SVG icons (X, Discord)
│   ├── society/               # Society detail components
│   │   ├── society-logo.tsx   # Logo with size variants
│   │   ├── society-badges.tsx # Location/type/category badges
│   │   ├── society-social-links.tsx
│   │   ├── society-radar.tsx  # Community score radar chart
│   │   ├── society-content.tsx # Editorial content (per-society)
│   │   ├── society-related.tsx # Related societies grid
│   │   ├── society-jobs.tsx   # Filtered job listings
│   │   └── society-events.tsx # Upcoming events preview
│   ├── society-detail-client.tsx  # Society detail orchestrator
│   ├── societies-page-client.tsx  # Societies list with filtering
│   ├── societies-chart.tsx    # Societies visualization
│   └── theme-provider.tsx     # Theme context
├── lib/                       # Utilities and data
│   ├── actions/               # Server actions (events, societies)
│   ├── data/                  # Static databases (jobs, societies)
│   ├── hooks/                 # React hooks (useClientTimezone)
│   ├── supabase/              # Supabase client
│   ├── types/                 # TypeScript types (events, etc.)
│   ├── utils/                 # Helpers (slug, society-matcher)
│   └── utils.ts               # cn() helper for Tailwind
└── public/                    # Static assets
```

## 🎯 Pages

1. **Homepage (/)** - Event dashboard with top Network States and upcoming events
2. **/jobs** - Network State job listings with CTA to post jobs
3. **/content** - Content creators, influencers, and essential reading
4. **/vc** - Venture capital firms funding the Network State movement
5. **/investment-dao** - Decentralized investment opportunities
6. **/societies** - Network State societies with community score radar, filtering, and score visualizations
7. **/societies/[slug]** - Society detail pages with radar chart, jobs, events, editorial content, and related societies
8. **/funding** - Grants and VC funding information
9. **/tooling** - Open-source GitHub repos and tools
10. **/contact** - Discord link and mission statement

## 🌙 Dark Mode

Toggle between light and dark themes using the button in the navigation. Theme preference is saved to localStorage.

## 📅 Dynamic Events Integration

The platform now features dynamic event synchronization with Supabase:

- **Real-time Events**: Events are loaded dynamically from the database
- **Popup Cities**: Special long-running events tagged as 'popup-city'
- **Event Filtering**: Filter by country, source, tags, and date ranges
- **Server Actions**: Efficient server-side data fetching
- **Type Safety**: Full TypeScript support for events

See `EVENTS_SETUP.md` for configuration details.

## 🤝 Contributing

We're building in public! Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

## 📜 License

MIT License - Fork it, improve it, ship it.

## 🌐 Community

Join the nsnodes Telegram: https://t.me/+RwyXfj5VsXk2NmE1

---

**Built with ❤️ for the Network State Community**

```
 /$$   /$$  /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$$  /$$$$$$$$  /$$$$$$ 
| $$$ | $$ /$$__  $$| $$$ | $$ /$$__  $$| $$__  $$| $$_____/ /$$__  $$
| $$$$| $$| $$  \__/| $$$$| $$| $$  \ $$| $$  \ $$| $$      | $$  \__/
| $$ $$ $$|  $$$$$$ | $$ $$ $$| $$  | $$| $$  | $$| $$$$$   |  $$$$$$ 
| $$  $$$$ \____  $$| $$  $$$$| $$  | $$| $$  | $$| $$__/    \____  $$
| $$\  $$$ /$$  \ $$| $$\  $$$| $$  | $$| $$  | $$| $$       /$$  \ $$
| $$ \  $$|  $$$$$$/| $$ \  $$|  $$$$$$/| $$$$$$$/| $$$$$$$$|  $$$$$$/
|__/  \__/ \______/ |__/  \__/ \______/ |_______/ |________/ \______/ 
```