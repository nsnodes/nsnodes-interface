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
  source: string // e.g., "luma"
  source_url: string

  // Metadata
  organizers: Array<{ name: string }> | string | null // Supabase auto-parses JSON
  tags: string[] | null
  image_url: string | null
}

// Type for the transformed event used in the UI
export interface UIEvent {
  date: string // YYYY-MM-DD format
  time: string // Human-readable time range
  title: string
  location: string
  country: string
  networkState: string
  type: string
  url: string
}
