# Event Routes

Interactive Sankey diagram showing how people flow between Network State events.

## Pages

- **`/routes`** - Public interactive diagram
- **`/routes/admin`** - Admin interface (password protected, not indexed)

## Admin Access

The admin page is password-protected and not indexed by search engines.

### Setup

Add to your `.env.local` file:

```bash
ROUTES_ADMIN_PASSWORD=your_secure_password_here
```

If not set, it defaults to `admin123` (change this in production!)

### Admin Features

1. **Event Management**
   - Add new events manually
   - Import events from the existing events database
   - Delete events
   - Configure event duration and timeline position (lane)

2. **Connection Management**
   - Create flow connections between events
   - Assign colors to each flow
   - Delete connections

3. **Data Persistence**
   - Currently stores data in `lib/data/event-routes.ts`
   - Click "SAVE CHANGES" to view JSON output
   - Copy JSON and paste into `lib/data/event-routes.ts` to persist changes
   - Future: Can be upgraded to store in Supabase

## Data Structure

### Event
```typescript
{
  id: string;           // Unique identifier (slug)
  name: string;         // Display name
  startDate: string;    // YYYY-MM-DD format
  duration: number;     // Duration in days
  lane: number;         // Vertical position (0, 1, 2, ...)
  sourceEventId?: string; // Optional: links to real event from database
}
```

### Connection
```typescript
{
  from: string;    // Event id
  to: string;      // Event id
  color: string;   // Hex color code
}
```

## Future Enhancements

- [ ] Save directly to Supabase instead of JSON file
- [ ] Track actual user clicks/interactions
- [ ] Export data as CSV/JSON
- [ ] Bulk import from spreadsheet
- [ ] Visual drag-and-drop timeline editor
- [ ] Animation of flows
- [ ] Filter by network state or event type
