import { Metadata } from "next";
import Link from "next/link";
import { Code, Database, Zap, Lock, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "NSNodes API | Access Network States Data",
  description:
    "Public API for accessing societies and events data from the Network States ecosystem. Build applications with real-time data.",
};

export default function ApiPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono uppercase">
          [ NSNodes API ]
        </h1>
        <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-2xl mx-auto">
          Access the most comprehensive database of Network State societies and
          events. Build applications, integrations, and tools for the
          decentralized future.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <Database className="h-8 w-8 mb-4" />
          <h3 className="font-mono font-bold text-lg mb-2">Societies Data</h3>
          <p className="text-sm text-muted-foreground font-mono">
            Access detailed information about Network State societies, including
            location, mission, and social links.
          </p>
        </div>

        <div className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <Zap className="h-8 w-8 mb-4" />
          <h3 className="font-mono font-bold text-lg mb-2">Events Feed</h3>
          <p className="text-sm text-muted-foreground font-mono">
            Real-time access to events from across the Network States ecosystem.
            Filter by location, date, and tags.
          </p>
        </div>

        <div className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <Code className="h-8 w-8 mb-4" />
          <h3 className="font-mono font-bold text-lg mb-2">RESTful API</h3>
          <p className="text-sm text-muted-foreground font-mono">
            Clean, well-documented REST endpoints with JSON responses.
            Pagination, filtering, and search built-in.
          </p>
        </div>

        <div className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <Lock className="h-8 w-8 mb-4" />
          <h3 className="font-mono font-bold text-lg mb-2">Secure Access</h3>
          <p className="text-sm text-muted-foreground font-mono">
            API key authentication ensures secure access to all endpoints. Your
            data, protected.
          </p>
        </div>
      </section>

      {/* Endpoints Preview */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold font-mono">
          [ AVAILABLE ENDPOINTS ]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green-500/20 text-green-500 font-mono text-xs font-bold rounded">
                GET
              </span>
              <code className="font-mono text-sm">/api/v1/societies</code>
            </div>
            <p className="text-sm text-muted-foreground font-mono mb-4">
              List all Network State societies with filtering by type, tier, and
              category.
            </p>
            <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`{
  "success": true,
  "data": [{
    "name": "Network School",
    "type": "Physical",
    "tier": 1,
    "social": [
      { "key": "x", "value": "..." }
    ]
  }],
  "meta": { "pagination": {...} }
}`}
            </pre>
          </div>

          <div className="border-2 border-border p-6 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green-500/20 text-green-500 font-mono text-xs font-bold rounded">
                GET
              </span>
              <code className="font-mono text-sm">/api/v1/events</code>
            </div>
            <p className="text-sm text-muted-foreground font-mono mb-4">
              List events with filtering by date range, location, source, and
              tags.
            </p>
            <pre className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
{`{
  "success": true,
  "data": [{
    "title": "NS Meetup",
    "start_at": "2025-02-15T18:00:00Z",
    "location": {
      "city": "London",
      "country": "UK"
    }
  }],
  "meta": { "pagination": {...} }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-2 border-border p-8 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-mono">
          [ GET API ACCESS ]
        </h2>
        <p className="text-muted-foreground font-mono max-w-xl mx-auto">
          Want to integrate Network States data into your application? Contact
          us to get your API key and start building.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:nsnodes@gmail.com?subject=API%20Access%20Request"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Mail className="h-4 w-4" />
            Request API Access
          </a>
          <Link
            href="/api/doc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card font-mono font-bold border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Code className="h-4 w-4" />
            View Documentation
          </Link>
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Contact us at{" "}
          <a
            href="mailto:nsnodes@gmail.com"
            className="underline underline-offset-2 hover:text-foreground"
          >
            nsnodes@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
