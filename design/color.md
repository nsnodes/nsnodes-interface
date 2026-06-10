# Color Palette

NSNodes uses a monochrome-first interface that matches the pixel logo assets:
`logo-light.png` is white for dark surfaces, and `logo-dark.png` is black for
light surfaces. Color is reserved for status, charts, and small editorial
signals rather than the page chrome.

---

## Base Surfaces

| Role | Light | Dark | Notes |
|------|-------|------|-------|
| Background | `#f7f7f2` | `#050505` | Off-white and near-black, not the older sand/teal illustration palette |
| Foreground | `#050505` | `#f7f7f2` | Matches the logo contrast |
| Card | `#ffffff` | `#101010` | Slight lift from the page background |
| Muted | `#ecece7` | `#181818` | Quiet UI fills |
| Border | `#050505` | `#f7f7f2` | Brutalist high-contrast frame |

## Core UI

| Role | Light | Dark |
|------|-------|------|
| Primary | `#050505` | `#f7f7f2` |
| Primary foreground | `#ffffff` | `#050505` |
| Accent | `#e2e2dc` | `#202020` |
| Muted foreground | `#565656` | `#b6b6b0` |
| Ring | `#050505` | `#f7f7f2` |

## Signal Colors

| Role | Light | Dark |
|------|-------|------|
| Blue | `#0057ff` | `#6ea8ff` |
| Orange | `#ff4d00` | `#ff9b5f` |
| Green | `#008a4b` | `#55d98b` |
| Yellow | `#f0b400` | `#f4d35e` |
| Red | `#d92d20` | `#ff5a4f` |

## Theme Rules

- Page chrome should stay monochrome: background, text, cards, borders, and
  navigation should not drift into sand, teal, or copper.
- Accent colors should appear as small signals: charts, labels, status badges,
  and editorial highlights.
- Palette tokens must have dark-mode overrides. A dark theme should not inherit
  light-mode accent values when those values are used for text.
- Avoid pure decorative gradients. Let the black/white pixel brand and the
  content grid carry the page.
