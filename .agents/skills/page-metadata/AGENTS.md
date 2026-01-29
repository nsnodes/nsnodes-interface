# Page Metadata Guidelines for nsnodes.com

**Version 1.0.0**
nsnodes.com
January 2026

> Guidelines for creating consistent page titles and meta descriptions across the nsnodes.com website.

---

## Title Format

### Homepage
The homepage is the only page that starts with `nsnodes.com`:
```
nsnodes.com | Network State Hub for Network Societies Builders
```

### All Other Pages
All other pages should end with `| nsnodes.com`:
```
[Page Title] | nsnodes.com
```

### Examples

| Page | Title |
|------|-------|
| Homepage `/` | `nsnodes.com \| Network State Hub for Network Societies Builders` |
| Events `/events` | `Network State Events \| nsnodes.com` |
| Societies `/societies` | `Network State Societies \| nsnodes.com` |
| Jobs `/jobs` | `Network State Jobs \| nsnodes.com` |
| API `/api` | `nsnodes.com API \| nsnodes.com` |
| API Docs `/api/doc` | `API Documentation for nsnodes.com API \| nsnodes.com` |
| Contact `/contact` | `Contact Us \| nsnodes.com` |

---

## Meta Description Guidelines

1. **Length**: Keep between 150-160 characters for optimal display in search results
2. **Content**: Clearly describe what the page offers
3. **Keywords**: Include relevant keywords naturally (Network State, societies, events, etc.)
4. **Action-oriented**: When appropriate, hint at what users can do on the page

### Examples

| Page | Description |
|------|-------------|
| Homepage | `Hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.` |
| Events | `Discover upcoming Network State events, meetups, and conferences worldwide. Find events in your city.` |
| API | `Access the most comprehensive database of Network State societies and events. Build applications, integrations, and tools for the decentralized future.` |

---

## Implementation in Next.js

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title | nsnodes.com",
  description: "Your meta description here (150-160 characters).",
};
```

---

## Checklist for New Pages

- [ ] Title ends with `| nsnodes.com` (except homepage)
- [ ] Title is descriptive and concise (under 60 characters total)
- [ ] Meta description is 150-160 characters
- [ ] Description accurately reflects page content
- [ ] Keywords are included naturally
