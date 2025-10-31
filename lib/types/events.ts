// Type definitions for events from Supabase
// Only includes fields we actually need for display

export interface DatabaseEvent {
  // Core event info
  title: string
  description: string | null

  // Date/time
  start_at: string // ISO timestamp
  end_at: string // ISO timestamp
  timezone: string

  // Location
  venue_name: string | null
  address: string | null
  city: string | null
  country: string | null
  lat: number | null
  lng: number | null

  // Source
  source: string // e.g., "luma", "soladay"
  source_url: string

  // Metadata
  organizers: Array<{ name: string }> | string | null // Supabase auto-parses JSON
  tags: string[] | null
  image_url: string | null
  status: string // e.g., "scheduled", "tentative", "cancelled"
}

// Type for the transformed event used in the UI
export interface UIEvent {
  date: string // YYYY-MM-DD format (client-side computed)
  time: string // Human-readable time range (client-side computed)
  title: string
  location: string
  country: string
  networkState: string
  type: string
  url: string
  mapsLink?: string // Optional Google Maps link
  tags: string[] | null // Event tags (e.g., "commons", "arc")
  // Raw timestamps for client-side timezone conversion
  start_at: string // ISO timestamp
  end_at: string // ISO timestamp
  lat: number | null
  lng: number | null
}

// Type for popup cities (long-running events with date ranges)
export interface PopupCity {
  date: string // Start date in YYYY-MM-DD format
  endDate: string // End date in YYYY-MM-DD format
  title: string
  location: string
  networkState: string
  url: string
  showInPages?: string[] // Optional: array of page names where this event should appear (e.g., ['argentina', 'ns']). If omitted, event appears on all pages.
}
