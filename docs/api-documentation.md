# NSNodes Public API - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Sync Mechanism](#sync-mechanism)
7. [Managing API Keys](#managing-api-keys)
8. [Deployment](#deployment)
9. [Extending the API](#extending-the-api)

---

## Overview

The NSNodes Public API provides read-only access to societies and events data for external stakeholders. The API is built on Next.js 15+ App Router with API routes, using Supabase as the database backend.

### Key Features
- **Read-only access** to societies and events
- **API key authentication** for secure access
- **Pagination, filtering, and search** on all endpoints
- **Automatic daily sync** from Airtable to Supabase
- **Manual sync trigger** via webhook endpoint

### Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Data Source**: Airtable (societies), Luma/Sola.day (events)
- **Hosting**: Vercel
- **Cron Jobs**: Vercel Cron (daily sync)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Data Sources                              │
├─────────────────────────────────────────────────────────────────┤
│  Airtable (Societies)              Luma/Sola.day (Events)       │
│         │                                   │                    │
│         ▼                                   │                    │
│  ┌──────────────┐                          │                    │
│  │ Daily Cron   │                          │                    │
│  │ (6 AM UTC)   │                          │                    │
│  └──────┬───────┘                          │                    │
│         │                                   │                    │
│         ▼                                   ▼                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Supabase Database                     │    │
│  │  ┌─────────────┐              ┌─────────────┐           │    │
│  │  │  societies  │              │   events    │           │    │
│  │  │   table     │              │   table     │           │    │
│  │  └─────────────┘              └─────────────┘           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                          │
├─────────────────────────────────────────────────────────────────┤
│  GET  /api/v1/societies     - List societies                    │
│  GET  /api/v1/events        - List events                       │
│  POST /api/v1/sync/societies - Trigger Airtable sync            │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Stakeholders                         │
│              (Authenticated via API Key)                         │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
packages/api/
├── src/
│   ├── routes/
│   │   ├── societies.ts      # GET /api/v1/societies handler
│   │   ├── events.ts         # GET /api/v1/events handler
│   │   └── sync.ts           # POST /api/v1/sync/societies handler
│   ├── middleware/
│   │   └── api-key-auth.ts   # Authentication middleware
│   ├── services/
│   │   └── airtable-sync.ts  # Airtable to Supabase sync service
│   ├── types/
│   │   └── api-responses.ts  # TypeScript types
│   ├── webhooks/
│   │   └── dispatcher.ts     # Webhook dispatcher (for future use)
│   └── index.ts              # Package exports
├── docs/
│   └── openapi.yaml          # OpenAPI 3.0 specification
└── README.md                 # Quick reference documentation

app/api/v1/
├── societies/route.ts        # Next.js route handler
├── events/route.ts           # Next.js route handler
└── sync/societies/route.ts   # Next.js route handler

supabase/migrations/
├── 20260127_create_societies_table.sql
└── 20260127_create_webhook_tables.sql
```

---

## Authentication

### API Key Authentication

All API endpoints require authentication via API key. Two methods are supported:

**Method 1: Authorization Header (Recommended)**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "https://nsnodes.com/api/v1/societies"
```

**Method 2: X-API-Key Header**
```bash
curl -H "X-API-Key: YOUR_API_KEY" \
  "https://nsnodes.com/api/v1/societies"
```

### How Authentication Works

1. Request comes in with API key in header
2. Middleware extracts the key from `Authorization: Bearer <key>` or `X-API-Key` header
3. Key is validated against the `API_KEYS` environment variable (comma-separated list)
4. If valid, request proceeds; if invalid, returns 401 Unauthorized

**Code Location**: `packages/api/src/middleware/api-key-auth.ts`

```typescript
export function validateApiKey(request: NextRequest): NextResponse | null {
  const apiKey = extractApiKey(request)

  if (!apiKey) {
    return unauthorizedResponse('API key required.')
  }

  const validKeys = process.env.API_KEYS?.split(',').map(k => k.trim())
  if (!validKeys?.includes(apiKey)) {
    return unauthorizedResponse('Invalid API key.')
  }

  return null // Auth successful
}
```

### Sync Endpoint Authentication

The sync endpoint uses a separate `SYNC_SECRET` (or Vercel's `CRON_SECRET` for automated cron jobs):

```bash
curl -X POST -H "Authorization: Bearer YOUR_SYNC_SECRET" \
  "https://nsnodes.com/api/v1/sync/societies"
```

---

## API Endpoints

### GET /api/v1/societies

Returns a paginated list of network state societies.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `type` | string | - | Filter: Physical, Online, Popup, Decentralized |
| `tier` | integer | - | Filter by tier (1-5, where 1 is highest) |
| `category` | string | - | Filter by category |
| `search` | string | - | Search in name and URL |
| `sort_by` | string | name | Sort: name, tier, updated_at, founded |
| `sort_order` | string | asc | Order: asc, desc |

**Example Request:**
```bash
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies?type=Physical&tier=1&per_page=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Example Society",
      "url": "https://example.com",
      "type": "Physical",
      "tier": 1,
      "mission": "Building the future...",
      "location": "San Francisco, CA",
      "category": "Startup City",
      "founded": "2023",
      "icon_url": "https://...",
      "social": {
        "x": "https://x.com/example",
        "discord": "https://discord.gg/xxx",
        "telegram": null
      },
      "application_url": "https://example.com/apply",
      "updated_at": "2026-01-27T12:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 82,
      "total_pages": 9,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

### GET /api/v1/events

Returns a paginated list of events. By default, only returns upcoming events.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `start_after` | ISO datetime | - | Events starting after this time |
| `start_before` | ISO datetime | - | Events starting before this time |
| `city` | string | - | Filter by city (partial match) |
| `country` | string | - | Filter by country (partial match) |
| `source` | string | - | Filter: luma, soladay |
| `status` | string | - | Filter: scheduled, tentative, cancelled |
| `tags` | string | - | Filter by tags (comma-separated) |
| `search` | string | - | Search in title and description |
| `include_past` | boolean | false | Include past events |
| `sort_by` | string | start_at | Sort: start_at, end_at, title |
| `sort_order` | string | asc | Order: asc, desc |

**Example Request:**
```bash
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/events?city=London&include_past=false"
```

### POST /api/v1/sync/societies

Triggers a sync from Airtable to Supabase. Used by:
- Vercel Cron (daily at 6 AM UTC)
- Manual triggers

**Authentication:** Requires `SYNC_SECRET` or `CRON_SECRET`

**Example Request:**
```bash
curl -X POST -H "Authorization: Bearer YOUR_SYNC_SECRET" \
  "https://nsnodes.com/api/v1/sync/societies"
```

**Example Response:**
```json
{
  "success": true,
  "stats": {
    "total": 82,
    "created": 5,
    "updated": 77,
    "unchanged": 0,
    "errors": 0
  },
  "synced_at": "2026-01-27T06:00:00Z"
}
```

---

## Database Schema

### Societies Table

```sql
CREATE TABLE societies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  name TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Physical', 'Online', 'Popup', 'Decentralized')),
  tier INTEGER NOT NULL DEFAULT 3 CHECK (tier >= 1 AND tier <= 5),

  -- Social links
  x TEXT NOT NULL DEFAULT '',
  discord TEXT NOT NULL DEFAULT '',
  telegram TEXT,

  -- Content
  mission TEXT NOT NULL DEFAULT '',
  application TEXT NOT NULL DEFAULT '',

  -- Optional fields
  location TEXT,
  icon_url TEXT,
  category TEXT,
  founded TEXT,

  -- Sync metadata
  airtable_record_id TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_societies_type ON societies(type);
CREATE INDEX idx_societies_tier ON societies(tier);
CREATE INDEX idx_societies_category ON societies(category);
CREATE INDEX idx_societies_name_url_search ON societies
  USING gin(to_tsvector('english', name || ' ' || url));
CREATE INDEX idx_societies_updated ON societies(updated_at DESC);
```

### Events Table

The events table is pre-existing and synced from Luma/Sola.day. Key fields:

- `title`, `description`
- `start_at`, `end_at`, `timezone`
- `venue_name`, `address`, `city`, `country`, `lat`, `lng`
- `source` (luma/soladay), `source_url`
- `organizers` (JSON), `tags` (array)
- `image_url`, `status`

---

## Sync Mechanism

### How Airtable Sync Works

1. **Trigger**: Vercel Cron runs daily at 6 AM UTC (or manual trigger)
2. **Fetch**: Calls `fetchSocietiesFromAirtable()` from `lib/services/airtable.ts`
3. **Transform**: Converts Airtable records to database format
4. **Upsert**: Uses Supabase upsert with `name` as unique key
5. **Result**: Returns stats (created, updated, errors)

**Code Location**: `packages/api/src/services/airtable-sync.ts`

### Cron Configuration

**File**: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/v1/sync/societies",
      "schedule": "0 6 * * *"
    }
  ]
}
```

- `0 6 * * *` = Daily at 6:00 AM UTC
- Vercel Hobby plan: Limited to 1 cron job per day
- Vercel Pro plan: Unlimited frequency

### Manual Sync

```bash
curl -X POST -H "Authorization: Bearer YOUR_SYNC_SECRET" \
  "https://nsnodes.com/api/v1/sync/societies"
```

---

## Managing API Keys

### Generating New API Keys

Use OpenSSL to generate secure random keys:

```bash
# Generate a single key
openssl rand -hex 24

# Generate with prefix (recommended format)
echo "sk_live_$(openssl rand -hex 24)"
```

**Recommended key format**: `sk_live_<random_hex>`
- `sk_` = secret key prefix
- `live_` = production environment
- Length: 48+ hex characters

### Adding Keys to Vercel

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Find `API_KEYS`
3. Add keys as comma-separated values (no spaces):
   ```
   sk_live_key1abc123,sk_live_key2def456,sk_live_key3ghi789
   ```
4. Click **Save**
5. Redeploy: `vercel --prod --yes`

### Revoking Access

To revoke a stakeholder's access:
1. Remove their key from the `API_KEYS` list in Vercel
2. Save and redeploy

### Key Management Best Practices

1. **One key per stakeholder** - Easy to revoke individual access
2. **Use descriptive tracking** - Keep a separate record of which key belongs to whom
3. **Rotate periodically** - Generate new keys and update stakeholders
4. **Never commit keys** - Keys should only be in environment variables

### Example: Multi-Stakeholder Setup

```bash
# Generate keys for 3 partners
Partner_A: sk_live_$(openssl rand -hex 24)
Partner_B: sk_live_$(openssl rand -hex 24)
Partner_C: sk_live_$(openssl rand -hex 24)

# In Vercel API_KEYS:
sk_live_abc123...,sk_live_def456...,sk_live_ghi789...
```

**Tracking spreadsheet example:**

| Partner | API Key | Issued | Status |
|---------|---------|--------|--------|
| Partner A | sk_live_abc123... | 2026-01-27 | Active |
| Partner B | sk_live_def456... | 2026-01-27 | Active |
| Partner C | sk_live_ghi789... | 2026-01-27 | Revoked |

---

## Deployment

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEYS` | Comma-separated API keys for stakeholders | Yes |
| `SYNC_SECRET` | Secret for manual sync triggers | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `AIRTABLE_API_KEY` | Airtable personal access token | Yes |
| `AIRTABLE_BASE_ID` | Airtable base ID | Yes |
| `AIRTABLE_TABLE_NAME` | Airtable table name (default: Societies) | No |

### Deploy Commands

```bash
# Deploy to production
vercel --prod --yes

# Deploy preview
vercel --yes

# Check deployment logs
vercel logs https://your-deployment-url.vercel.app
```

### Applying Database Migrations

Run in Supabase SQL Editor:

1. `supabase/migrations/20260127_create_societies_table.sql`
2. `supabase/migrations/20260127_create_webhook_tables.sql`

---

## Extending the API

### Adding a New Endpoint

1. **Create route handler** in `packages/api/src/routes/`:
   ```typescript
   // packages/api/src/routes/new-resource.ts
   export async function handleGetNewResource(request: NextRequest) {
     const authError = validateApiKey(request)
     if (authError) return authError

     // Your logic here
   }
   ```

2. **Create Next.js route** in `app/api/v1/`:
   ```typescript
   // app/api/v1/new-resource/route.ts
   import { handleGetNewResource } from '@/packages/api/src/routes/new-resource'

   export async function GET(request: NextRequest) {
     return handleGetNewResource(request)
   }
   ```

3. **Update OpenAPI spec** in `packages/api/docs/openapi.yaml`

### Adding New Filters

In the route handler, add to `parseQueryParams()` and the query builder:

```typescript
// Add to parseQueryParams
const new_filter = url.searchParams.get('new_filter') || undefined

// Add to query builder
if (params.new_filter) {
  query = query.eq('column_name', params.new_filter)
}
```

### Adding Webhook Notifications

The webhook dispatcher is ready for use in `packages/api/src/webhooks/dispatcher.ts`. To enable:

1. Apply the webhook tables migration
2. Create subscription management endpoints
3. Call `dispatchWebhook()` after sync operations

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `DATABASE_ERROR` | 500 | Database query failed |
| `SERVER_ERROR` | 500 | Unexpected server error |
| `SYNC_ERROR` | 500 | Airtable sync failed |

---

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Test societies (use dev key from .env.local)
curl -H "Authorization: Bearer sk_test_dev_key_12345" \
  "http://localhost:3000/api/v1/societies?per_page=3"

# Test sync
curl -X POST -H "Authorization: Bearer sync_secret_dev_12345" \
  "http://localhost:3000/api/v1/sync/societies"
```

### Production Testing

```bash
# Test with production key
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies?per_page=3"
```

---

## Support

- **API Issues**: Check Vercel deployment logs
- **Sync Issues**: Verify Airtable credentials and table structure
- **Database Issues**: Check Supabase dashboard for errors

For code changes, all API logic is in `packages/api/src/`.
