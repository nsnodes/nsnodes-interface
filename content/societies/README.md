# Society content

One JSON file per society, keyed by slug (e.g. `network-school.json`). Loaded at build time via `loadSocietyContent()` in `lib/data/society-content.ts` and rendered by `components/society/society-content.tsx`.

## Source of truth

These files are auto-generated weekly by [github.com/nsnodes/society-scraper](https://github.com/nsnodes/society-scraper) via PR. Hand edits will be overwritten on the next scrape. For one-off tweaks, edit the JSON here; for systemic changes, adjust the scraper prompt or the per-society override config.

## Schema

See `SocietyContentData` in `lib/data/society-content.ts`. Required: `overview`, `location`, `duration`, `pricing`, `amenities`, `howToEnter`, `faqs`, `history`. Optional: `fellowship`/`fellowshipUrl`, `longtermer`, `kidFriendly`, `discount`.

Follower counts (`x_followers`, `discord_members`, `telegram_members`, `youtube_subscribers`) are **not** in these files — they live in the Supabase `societies` table and are refreshed directly by the scraper.
