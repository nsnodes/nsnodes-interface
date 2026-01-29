# NSNodes API

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
| `limit` | integer | 20 | Number of items to return (max: 100) |
| `offset` | integer | 0 | Number of items to skip |
| `type` | string | - | Filter by type: Physical, Online, Popup, Decentralized |
| `tier` | integer | - | Filter by tier (1-5, where 1 is highest) |
| `category` | string | - | Filter by category |
| `search` | string | - | Search in name and URL |
| `sort_by` | string | name | Sort field: name, tier, updated_at, founded |
| `sort_order` | string | asc | Sort order: asc, desc |

**Example:**

```bash
curl -H "Authorization: Bearer sk_live_xxx" \
  "https://nsnodes.com/api/v1/societies?type=Physical&tier=1&limit=10"
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
      "social": [
        { "key": "x", "value": "https://x.com/example" },
        { "key": "discord", "value": "https://discord.gg/xxx" }
      ],
      "application_url": "https://example.com/apply",
      "updated_at": "2025-01-27T12:00:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 50,
      "has_more": true
    }
  }
}
```

### GET /api/v1/events

List events with pagination, filtering, and search.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Number of items to return (max: 100) |
| `offset` | integer | 0 | Number of items to skip |
| `start_after` | ISO datetime | - | Filter events starting after this time |
| `start_before` | ISO datetime | - | Filter events starting before this time |
| `city` | string | - | Filter by city (partial match) |
| `country` | string | - | Filter by country (partial match) |
| `source` | string | - | Filter by source: luma, soladay |
| `status` | string | - | Filter by status: scheduled, tentative, cancelled |
| `tags` | string | - | Filter by tags (comma-separated) |
| `search` | string | - | Search in title and description |
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
      "limit": 20,
      "offset": 0,
      "total": 100,
      "has_more": true
    }
  }
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

## OpenAPI Specification

The full OpenAPI 3.0 specification is available at [docs/openapi.yaml](docs/openapi.yaml).

## Environment Variables

Required environment variables:

```bash
# API Keys for stakeholders (comma-separated)
API_KEYS=sk_live_stakeholder1_abc123,sk_live_stakeholder2_def456
```
