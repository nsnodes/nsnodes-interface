# How to Edit Page Metadata (SEO)

This guide explains how to edit metadata (title, description, Open Graph, Twitter cards) for pages on nsnodes.com.

## Overview

All pages now have proper SEO metadata for Google indexing. Metadata includes:
- **Page title** - Shows in browser tabs and search results
- **Description** - Shows in search result snippets
- **Open Graph tags** - For social media sharing (Facebook, LinkedIn, etc.)
- **Twitter cards** - For Twitter/X sharing

## How Metadata Works

We use a helper function `generatePageMetadata()` located in [lib/utils/metadata.ts](lib/utils/metadata.ts) that automatically formats metadata consistently across all pages.

## Editing Metadata for a Page

### For Server Component Pages (Recommended Pattern)

Most pages follow this pattern where the page exports metadata and renders a client component:

**File: `app/events/page.tsx`**
```tsx
import { generatePageMetadata } from '@/lib/utils/metadata';
import EventsClient from './events-client';

export const metadata = generatePageMetadata(
  "Network State Events",  // ← EDIT THIS: Page title
  "Discover upcoming events across the Network State ecosystem..."  // ← EDIT THIS: Description
);

export default function EventsPage() {
  return <EventsClient />;
}
```

**To edit:**
1. Open the page file (e.g., `app/events/page.tsx`)
2. Find the `generatePageMetadata()` call
3. Edit the two string parameters:
   - **First parameter**: Page title (will become "Your Title | nsnodes.com")
   - **Second parameter**: Description for search results and social sharing

### For Pages Without Separate Client Components

Some simpler pages don't need a separate client component:

**File: `app/investment-dao/page.tsx`**
```tsx
import { generatePageMetadata } from '@/lib/utils/metadata';
import { Rocket } from "lucide-react";

export const metadata = generatePageMetadata(
  "Investment DAO",  // ← EDIT THIS: Page title
  "Coming soon: A decentralized investment DAO..."  // ← EDIT THIS: Description
);

export default function InvestmentDAO() {
  return (
    <div>
      {/* Page content here */}
    </div>
  );
}
```

## Examples of Current Pages

| Page | Title | Description |
|------|-------|-------------|
| `/events` | Network State Events | Discover upcoming events across the Network State ecosystem... |
| `/jobs` | Network State Jobs | Find job opportunities in the emerging Network State ecosystem... |
| `/societies` | Network State Dashboard | Hub for tracking Network State societies and communities... |
| `/vc` | Venture Capital | The VCs funding the Network State revolution... |
| `/funding/grants` | Grants | Discover grant programs supporting Network State and Web3 projects... |

## What Gets Generated

When you use `generatePageMetadata("My Page", "My description")`, it automatically creates:

```tsx
{
  title: "My Page | nsnodes.com",
  description: "My description",
  openGraph: {
    title: "My Page | nsnodes.com",
    description: "My description",
    url: "https://nsnodes.com",
    siteName: "NSNodes",
    images: [{ url: "/featured-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Page | nsnodes.com",
    description: "My description",
    images: ["/featured-image.png"],
  },
}
```

## Best Practices

### Title Guidelines
- Keep it under 60 characters (will have "| nsnodes.com" appended)
- Be descriptive and include relevant keywords
- Match or complement the H1 heading on the page
- Examples: "Network State Events", "Jobs", "Venture Capital"

### Description Guidelines
- Keep it between 120-160 characters
- Accurately describe the page content
- Include relevant keywords naturally
- Make it compelling for search results
- End with a clear value proposition

### Good Examples
```tsx
// Good - Clear, descriptive, keyword-rich
generatePageMetadata(
  "Network State Jobs",
  "Find remote and on-site job opportunities in Network States, crypto, and decentralized communities."
)

// Good - Compelling and specific
generatePageMetadata(
  "Venture Capital Directory",
  "Connect with VCs investing in Network States, crypto infrastructure, and decentralized governance."
)
```

### Bad Examples
```tsx
// Bad - Too generic, no keywords
generatePageMetadata(
  "Page",
  "This is a page."
)

// Bad - Too long, will get cut off
generatePageMetadata(
  "The Complete Comprehensive Directory of All Network State Venture Capital Firms",
  "This page contains an extremely detailed and comprehensive list of every single venture capital firm that has ever invested in or shown interest in Network State projects, crypto infrastructure, decentralized governance systems, and related blockchain technologies across the globe."
)
```

## Changing the Root/Homepage Metadata

The homepage uses different metadata defined in [app/layout.tsx](app/layout.tsx):

```tsx
export const metadata: Metadata = {
  title: "nsnodes.com | Network State Hub for Network Societies Builders",
  description: "Hub for Network State events, jobs, content creators, VCs, and tooling.",
  // ... more config
};
```

To edit the homepage metadata, edit the `metadata` export in [app/layout.tsx](app/layout.tsx).

## Adding Metadata to New Pages

When creating a new page:

1. Create the page as a **server component** (don't add `"use client"`)
2. Import and use `generatePageMetadata()`:

```tsx
import { generatePageMetadata } from '@/lib/utils/metadata';

export const metadata = generatePageMetadata(
  "Your Page Title",
  "Your page description"
);

export default function YourPage() {
  return <div>Content</div>;
}
```

3. If you need client-side features (useState, useEffect, etc.):
   - Create a separate client component file (e.g., `your-page-client.tsx`)
   - Import and render it from your server component page

**Example:**

```tsx
// app/my-page/page.tsx (Server Component - exports metadata)
import { generatePageMetadata } from '@/lib/utils/metadata';
import MyPageClient from './my-page-client';

export const metadata = generatePageMetadata(
  "My Page",
  "Description of my page"
);

export default function MyPage() {
  return <MyPageClient />;
}
```

```tsx
// app/my-page/my-page-client.tsx (Client Component - interactive features)
"use client";

import { useState } from 'react';

export default function MyPageClient() {
  const [count, setCount] = useState(0);
  // ... interactive features
  return <div>Interactive content</div>;
}
```

## Sitemap Updates

When adding new pages, update the sitemap in [app/sitemap.xml/route.ts](app/sitemap.xml/route.ts):

```tsx
const routes = [
  "/",
  "/events",
  "/jobs",
  "/your-new-page",  // ← Add your new page here
  // ... other routes
];
```

## Testing Metadata

After making changes:

1. **Run the dev server**: `npm run dev`
2. **Visit your page** in a browser
3. **View page source** (right-click → "View Page Source")
4. **Check the `<head>` section** for:
   - `<title>Your Title | nsnodes.com</title>`
   - `<meta name="description" content="Your description">`
   - `<meta property="og:title" content="...">` (Open Graph)
   - `<meta name="twitter:card" content="summary_large_image">`

### Testing with SEO Tools

- **Google Search Console**: Check how Google sees your pages
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## Related Files

- [lib/utils/metadata.ts](lib/utils/metadata.ts) - Metadata generation helper
- [app/layout.tsx](app/layout.tsx) - Root layout with homepage metadata
- [app/sitemap.xml/route.ts](app/sitemap.xml/route.ts) - Sitemap configuration
- [middleware.ts](middleware.ts) - Adds pathname to headers for canonical URLs

## Troubleshooting

**Q: My metadata isn't showing up in search results**
- It can take days/weeks for Google to re-crawl and update
- Use Google Search Console to request re-indexing
- Make sure the page is in the sitemap

**Q: I see "use client" error about metadata**
- Client components can't export metadata
- Move metadata to a parent server component
- See "Adding Metadata to New Pages" section above

**Q: Canonical URLs are wrong**
- Check that [middleware.ts](middleware.ts) is adding the `x-pathname` header
- Check that [app/layout.tsx](app/layout.tsx) is reading it correctly

**Q: My page isn't in the sitemap**
- Add it to the `routes` array in [app/sitemap.xml/route.ts](app/sitemap.xml/route.ts)
- Rebuild the site: `npm run build`
- Check https://nsnodes.com/sitemap.xml
