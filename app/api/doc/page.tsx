import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "nsnodes.com | API Documentation",
  description:
    "Complete API documentation for nsnodes.com. Learn how to authenticate, query Network State societies and events data, and integrate with your applications.",
};

export default function ApiDocPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/api"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to API Overview
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold font-mono uppercase">
          [ NSNodes API ]
        </h1>
        <p className="text-muted-foreground font-mono">
          Public read-only API for accessing societies and events data.
        </p>
      </div>

      {/* Authentication */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono border-b-2 border-border pb-2">
          Authentication
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          All API endpoints require authentication. Provide your API key using
          one of:
        </p>
        <ul className="list-disc list-inside space-y-1 font-mono text-sm">
          <li>
            <code className="bg-muted px-2 py-0.5 rounded">
              Authorization: Bearer &lt;your-api-key&gt;
            </code>{" "}
            header
          </li>
          <li>
            <code className="bg-muted px-2 py-0.5 rounded">
              X-API-Key: &lt;your-api-key&gt;
            </code>{" "}
            header
          </li>
        </ul>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`# Using Authorization header
curl -H "Authorization: Bearer sk_live_xxx" \\
  "https://nsnodes.com/api/v1/societies"

# Using X-API-Key header
curl -H "X-API-Key: sk_live_xxx" \\
  "https://nsnodes.com/api/v1/societies"`}
        </pre>
      </section>

      {/* Societies Endpoint */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono border-b-2 border-border pb-2">
          GET /api/v1/societies
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          List network state societies with pagination, filtering, and search.
        </p>

        <h3 className="font-mono font-bold text-sm mt-6">Query Parameters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 pr-4">Parameter</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Default</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>limit</code>
                </td>
                <td className="py-2 pr-4">integer</td>
                <td className="py-2 pr-4">20</td>
                <td className="py-2">Number of items to return (max: 100)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>offset</code>
                </td>
                <td className="py-2 pr-4">integer</td>
                <td className="py-2 pr-4">0</td>
                <td className="py-2">Number of items to skip</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>type</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">
                  Filter by type: Physical, Online, Popup, Decentralized
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>tier</code>
                </td>
                <td className="py-2 pr-4">integer</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by tier (1-5, where 1 is highest)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>category</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by category</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>search</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Search in name and URL</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>sort_by</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">name</td>
                <td className="py-2">
                  Sort field: name, tier, updated_at, founded
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>sort_order</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">asc</td>
                <td className="py-2">Sort order: asc, desc</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-mono font-bold text-sm mt-6">Example Request</h3>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer sk_live_xxx" \\
  "https://nsnodes.com/api/v1/societies?type=Physical&tier=1&limit=10"`}
        </pre>

        <h3 className="font-mono font-bold text-sm mt-6">Example Response</h3>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`{
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
}`}
        </pre>
      </section>

      {/* Events Endpoint */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono border-b-2 border-border pb-2">
          GET /api/v1/events
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          List events with pagination, filtering, and search.
        </p>

        <h3 className="font-mono font-bold text-sm mt-6">Query Parameters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 pr-4">Parameter</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2 pr-4">Default</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>limit</code>
                </td>
                <td className="py-2 pr-4">integer</td>
                <td className="py-2 pr-4">20</td>
                <td className="py-2">Number of items to return (max: 100)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>offset</code>
                </td>
                <td className="py-2 pr-4">integer</td>
                <td className="py-2 pr-4">0</td>
                <td className="py-2">Number of items to skip</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>start_after</code>
                </td>
                <td className="py-2 pr-4">ISO datetime</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter events starting after this time</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>start_before</code>
                </td>
                <td className="py-2 pr-4">ISO datetime</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter events starting before this time</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>city</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by city (partial match)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>country</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by country (partial match)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>source</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by source: luma, soladay</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>status</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">
                  Filter by status: scheduled, tentative, cancelled
                </td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>tags</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Filter by tags (comma-separated)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>search</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Search in title and description</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>sort_by</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">start_at</td>
                <td className="py-2">Sort field: start_at, end_at, title</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>sort_order</code>
                </td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2 pr-4">asc</td>
                <td className="py-2">Sort order: asc, desc</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-mono font-bold text-sm mt-6">Example Request</h3>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`curl -H "Authorization: Bearer sk_live_xxx" \\
  "https://nsnodes.com/api/v1/events?city=London&start_after=2025-02-01T00:00:00Z"`}
        </pre>

        <h3 className="font-mono font-bold text-sm mt-6">Example Response</h3>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`{
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
}`}
        </pre>
      </section>

      {/* Error Responses */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-mono border-b-2 border-border pb-2">
          Error Responses
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          All error responses follow the same format:
        </p>
        <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}`}
        </pre>

        <h3 className="font-mono font-bold text-sm mt-6">Error Codes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-2 pr-4">Code</th>
                <th className="text-left py-2 pr-4">HTTP Status</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>UNAUTHORIZED</code>
                </td>
                <td className="py-2 pr-4">401</td>
                <td className="py-2">Invalid or missing API key</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>DATABASE_ERROR</code>
                </td>
                <td className="py-2 pr-4">500</td>
                <td className="py-2">Database query failed</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">
                  <code>SERVER_ERROR</code>
                </td>
                <td className="py-2 pr-4">500</td>
                <td className="py-2">Unexpected server error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-mono font-bold">Need API Access?</h3>
            <p className="text-sm text-muted-foreground font-mono">
              Contact us to get your API key.
            </p>
          </div>
          <a
            href="mailto:nsnodes@gmail.com?subject=API%20Access%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
          >
            <Mail className="h-4 w-4" />
            nsnodes@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
