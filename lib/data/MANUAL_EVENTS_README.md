# Manual Pop-Up Events Guide

This guide explains how to manually add pop-up events to the `[ POP-UP ]` section on NSNodes.

## Quick Start

1. Open [lib/data/manual-popup-events.ts](manual-popup-events.ts)
2. Copy the template below
3. Fill in all fields
4. Add it to the `manualPopupEvents` array
5. Save the file - changes will appear automatically!

## Template

```typescript
{
  date: 'YYYY-MM-DD',              // Start date (e.g., '2025-11-15')
  endDate: 'YYYY-MM-DD',           // End date (e.g., '2025-12-20')
  title: 'Event Name',             // Name of the pop-up
  location: 'City, Country',       // Location (e.g., 'El Chaltén, Argentina')
  networkState: 'Network Name',    // Network/org (e.g., 'Edge Patagonia')
  url: 'https://...',              // Event page or registration link
}
```

## Example

```typescript
export const manualPopupEvents: PopupCity[] = [
  {
    date: '2025-11-15',
    endDate: '2025-12-20',
    title: 'Edge Patagonia Season 2',
    location: 'El Chaltén, Argentina',
    networkState: 'Edge Patagonia',
    url: 'https://edge.org/patagonia',
  },
  {
    date: '2026-01-10',
    endDate: '2026-02-28',
    title: 'Zuzalu City',
    location: 'Kotor, Montenegro',
    networkState: 'Zuzalu',
    url: 'https://zuzalu.city',
  },
]
```

## Field Descriptions

### `date` (required)
- **Format**: `YYYY-MM-DD`
- **Description**: Start date of the pop-up event
- **Example**: `'2025-11-15'`

### `endDate` (required)
- **Format**: `YYYY-MM-DD`
- **Description**: End date of the pop-up event
- **Example**: `'2025-12-20'`
- **Note**: Must be on or after the start date

### `title` (required)
- **Format**: String
- **Description**: Name/title of the pop-up event
- **Examples**:
  - `'Edge Patagonia Season 2'`
  - `'Zuzalu City'`
  - `'Network School Bangkok'`

### `location` (required)
- **Format**: `'City, Country'`
- **Description**: Physical location of the event
- **Examples**:
  - `'El Chaltén, Argentina'`
  - `'Próspera, Honduras'`
  - `'Chiang Mai, Thailand'`
  - `'Kotor, Montenegro'`

### `networkState` (required)
- **Format**: String
- **Description**: The network state or organization hosting the event
- **Examples**:
  - `'Edge Patagonia'`
  - `'Zuzalu'`
  - `'Network School'`
  - `'Próspera'`
  - `'4seas'`

### `url` (required)
- **Format**: Full URL starting with `https://` or `http://`
- **Description**: Link to event page, registration, or more information
- **Examples**:
  - `'https://edge.org/patagonia'`
  - `'https://lu.ma/event-slug'`
  - `'https://zuzalu.city'`

## How It Works

1. **Manual events** are defined in [manual-popup-events.ts](manual-popup-events.ts)
2. **Database events** are fetched from Supabase (events tagged with `popup-city`)
3. Both sources are **merged together** in the `getPopupCities()` function
4. **Duplicates are removed** based on matching title and date
5. Events are **sorted by start date** (earliest first)
6. They appear in the `[ POP-UP ]` section on the homepage and events page

## Validation

The file includes automatic validation that checks:
- ✅ All required fields are present
- ✅ Dates are in `YYYY-MM-DD` format
- ✅ URLs start with `http://` or `https://`
- ✅ End date is after start date

Validation runs automatically in development mode and will show warnings in the console if there are issues.

## Tips

- **Keep it simple**: Use clear, concise titles
- **Be consistent**: Follow the same format as existing events
- **Test it**: After adding an event, visit the homepage to see it in the timeline
- **Check dates**: Make sure your dates are correct - typos will cause validation errors
- **Use full URLs**: Always include `https://` in the URL

## Where Events Appear

Manual pop-up events will appear in:
- **Homepage**: `[ POP-UP ]` section (shows first 4, sorted by date)
- **Events page**: `/events` (shows all pop-up events)
- **Timeline view**: Visual timeline showing event duration
- **Table view**: Sortable table with all event details

## Need Help?

If you encounter any issues:
1. Check the browser console for validation errors
2. Verify all fields match the template format
3. Make sure dates are in `YYYY-MM-DD` format
4. Ensure the URL starts with `https://` or `http://`

## File Location

📁 **Location**: [/lib/data/manual-popup-events.ts](manual-popup-events.ts)
