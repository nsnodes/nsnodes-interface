# NSNodes - Network State Hub

![NSNodes](https://img.shields.io/badge/Status-Live-green) ![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black) ![License](https://img.shields.io/badge/License-MIT-blue)

> The ultimate hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.

## 🚀 Features

- **Event Dashboard** - Track Network State events, conferences, and meetups
- **Jobs Board** - Find opportunities in the Network State ecosystem
- **Content Creators** - Follow the best thinkers and builders in the space
- **VC Directory** - Connect with crypto-native venture capital firms
- **Open Source Tooling** - Discover GitHub repos building the future
- **Community Hub** - Join the Discord and connect with builders

## 🎨 Design

NSNodes features a unique ASCII/retro aesthetic inspired by:
- 80s/90s BBS systems
- Hacker culture
- Crypto punk ethos
- Balaji's vision for Network States

Key design elements:
- ASCII art and typography
- 3D shadow effects (brutalist style)
- Dark/light mode toggle
- Fully responsive (mobile & desktop)
- Monospace fonts throughout
- Custom scrollbars and selection colors

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **React:** 19.1.0
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (New York style)
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono
- **Bundler:** Turbopack

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
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage - Event Dashboard
│   ├── jobs/              # Jobs page
│   ├── content/           # Content creators page
│   ├── vc/                # Venture capital page
│   ├── tooling/           # GitHub tooling page
│   ├── contact/           # Contact/community page
│   ├── layout.tsx         # Root layout with nav
│   └── globals.css        # Global styles + ASCII effects
├── components/            # React components
│   ├── ascii-logo.tsx     # NSNodes ASCII logo
│   ├── ascii-nav.tsx      # Navigation with dark mode
│   └── theme-provider.tsx # Theme context
├── lib/                   # Utilities
│   └── utils.ts          # cn() helper for Tailwind
└── public/               # Static assets
```

## 🎯 Pages

1. **Homepage (/)** - Event dashboard with top Network States and upcoming events
2. **/jobs** - Network State job listings with CTA to post jobs
3. **/content** - Content creators, influencers, and essential reading
4. **/vc** - Venture capital firms funding the Network State movement
5. **/tooling** - Open-source GitHub repos and tools
6. **/contact** - Discord link and mission statement

## 🌙 Dark Mode

Toggle between light and dark themes using the button in the navigation. Theme preference is saved to localStorage.

## 🎨 Custom Styling

The site includes custom CSS utilities for ASCII effects:

- `.ascii-3d` - 3D text shadow effect
- `.glitch:hover` - Glitch animation on hover
- `.crt-effect` - Retro CRT screen flicker
- Custom scrollbars with borders
- ASCII box-shadow effects on cards

## 🤝 Contributing

We're building in public! Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

## 📜 License

MIT License - Fork it, improve it, ship it.

## 🌐 Community

Join the NSNodes Discord: [discord.gg/nsnodes](https://discord.gg/nsnodes)

---

**Built with ❤️ for the Network State Community**

*"The future is decentralized" - Balaji Srinivasan*

[ gm ] [ wagmi ] [ lfg ] [ iykyk ]
