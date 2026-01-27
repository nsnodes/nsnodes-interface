# Network States Nodes API

Public read-only API for accessing societies and events data.

## Authentication

All API endpoints require authentication. Provide your API key using one of:

- `Authorization: Bearer <your-api-key>` header
- `X-API-Key: <your-api-key>` header

```bash
# Using Authorization header
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies"

# Using X-API-Key header
curl -H "X-API-Key: sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies"
```

## Endpoints

### GET /api/v1/societies

List network state societies with pagination, filtering, and search.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `type` | string | - | Filter by type: Physical, Online, Popup, Decentralized |
| `tier` | integer | - | Filter by tier (1-5, where 1 is highest) |
| `category` | string | - | Filter by category |
| `search` | string | - | Search in name and URL |
| `sort_by` | string | name | Sort field: name, tier, updated_at, founded |
| `sort_order` | string | asc | Sort order: asc, desc |

**Example:**

```bash
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies?type=Physical&tier=1&per_page=10"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
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
      "updated_at": "2025-01-27T12:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 50,
      "total_pages": 5,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

### GET /api/v1/events

List events with pagination, filtering, and search. By default, only returns upcoming events.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `per_page` | integer | 20 | Items per page (max: 100) |
| `start_after` | ISO datetime | - | Filter events starting after this time |
| `start_before` | ISO datetime | - | Filter events starting before this time |
| `city` | string | - | Filter by city (partial match) |
| `country` | string | - | Filter by country (partial match) |
| `source` | string | - | Filter by source: luma, soladay |
| `status` | string | - | Filter by status: scheduled, tentative, cancelled |
| `tags` | string | - | Filter by tags (comma-separated) |
| `search` | string | - | Search in title and description |
| `include_past` | boolean | false | Include past events |
| `sort_by` | string | start_at | Sort field: start_at, end_at, title |
| `sort_order` | string | asc | Sort order: asc, desc |

**Example:**

```bash
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/events?city=London&start_after=2025-02-01T00:00:00Z"
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Network States Meetup",
      "description": "Join us for...",
      "start_at": "2025-02-15T18:00:00Z",
      "end_at": "2025-02-15T21:00:00Z",
      "timezone": "Europe/London",
      "location": {
        "venue_name": "The Example Venue",
        "address": "123 Example St",
        "city": "London",
        "country": "United Kingdom",
        "lat": 51.5074,
        "lng": -0.1278
      },
      "source": "luma",
      "source_url": "https://lu.ma/xxx",
      "organizers": [{ "name": "Network School" }],
      "tags": ["meetup", "networking"],
      "image_url": "https://...",
      "status": "scheduled",
      "updated_at": "2025-01-27T12:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 100,
      "total_pages": 5,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

### POST /api/v1/sync/societies

Webhook endpoint for triggering a sync from Airtable. This endpoint uses a separate sync secret (not regular API keys).

**Example:**

```bash
curl -X POST -H "Authorization: Bearer your-sync-secret" \
  "https://nsnodes.com/api/v1/sync/societies"
```

**Response:**

```json
{
  "success": true,
  "stats": {
    "total": 50,
    "created": 5,
    "updated": 10,
    "unchanged": 35,
    "errors": 0
  },
  "synced_at": "2025-01-27T12:00:00Z"
}
```

## Error Responses

All error responses follow the same format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `DATABASE_ERROR` | 500 | Database query failed |
| `SERVER_ERROR` | 500 | Unexpected server error |
| `SYNC_ERROR` | 500 | Airtable sync failed |

## OpenAPI Specification

The full OpenAPI 3.0 specification is available at [docs/openapi.yaml](docs/openapi.yaml).

## Setting Up Airtable Webhook

To enable automatic sync when Airtable data changes:

1. Go to Airtable → Automations
2. Create a new automation
3. Set trigger: "When a record is created or updated" (or deleted)
4. Add action: "Run a script" or "Send webhook"
5. Configure webhook:
   - URL: `https://nsnodes.com/api/v1/sync/societies`
   - Method: POST
   - Header: `Authorization: Bearer YOUR_SYNC_SECRET`
6. Test and enable the automation

## Environment Variables

Required environment variables:

```bash
# API Keys for stakeholders (comma-separated)
API_KEYS=sk_live_stakeholder1_abc123,sk_live_stakeholder2_def456

# Secret for Airtable webhook authentication
SYNC_SECRET=your-secure-random-secret

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Airtable (already configured)
AIRTABLE_API_KEY=...
AIRTABLE_BASE_ID=...
```
