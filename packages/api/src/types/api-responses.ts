/**
 * Standard API response types for the public API
 */

export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    pagination?: PaginationMeta
  }
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

/**
 * Society response type for the public API
 * Transforms internal database format to a cleaner public format
 */
export interface SocietyApiResponse {
  id: string
  name: string
  url: string
  type: 'Physical' | 'Online' | 'Popup' | 'Decentralized'
  tier: number
  mission: string
  location: string | null
  category: string | null
  founded: string | null
  icon_url: string | null
  social: {
    x: string | null
    discord: string | null
    telegram: string | null
  }
  application_url: string | null
  updated_at: string
}

/**
 * Event response type for the public API
 */
export interface EventApiResponse {
  id: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  timezone: string | null
  location: {
    venue_name: string | null
    address: string | null
    city: string | null
    country: string | null
    lat: number | null
    lng: number | null
  }
  source: 'luma' | 'soladay'
  source_url: string
  organizers: Array<{ name: string }> | null
  tags: string[] | null
  image_url: string | null
  status: 'scheduled' | 'tentative' | 'cancelled'
  updated_at: string
}

/**
 * Query parameters for societies endpoint
 */
export interface SocietiesQueryParams {
  page?: number
  per_page?: number
  type?: 'Physical' | 'Online' | 'Popup' | 'Decentralized'
  tier?: number
  category?: string
  search?: string
  sort_by?: 'name' | 'tier' | 'updated_at' | 'founded'
  sort_order?: 'asc' | 'desc'
}

/**
 * Query parameters for events endpoint
 */
export interface EventsQueryParams {
  page?: number
  per_page?: number
  start_after?: string
  start_before?: string
  city?: string
  country?: string
  source?: 'luma' | 'soladay'
  status?: 'scheduled' | 'tentative' | 'cancelled'
  tags?: string
  search?: string
  include_past?: boolean
  sort_by?: 'start_at' | 'end_at' | 'title'
  sort_order?: 'asc' | 'desc'
}

/**
 * Database row type for societies table
 */
export interface SocietyDatabaseRow {
  id: string
  name: string
  url: string
  type: string
  tier: number
  x: string
  discord: string
  telegram: string | null
  mission: string
  application: string
  location: string | null
  icon_url: string | null
  category: string | null
  founded: string | null
  airtable_record_id: string | null
  last_synced_at: string
  created_at: string
  updated_at: string
}

/**
 * Database row type for events table
 * Note: id, created_at, updated_at may not exist in all events tables
 */
export interface EventDatabaseRow {
  id?: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  timezone: string | null
  venue_name: string | null
  address: string | null
  city: string | null
  country: string | null
  lat: number | null
  lng: number | null
  source: string
  source_url: string
  organizers: Array<{ name: string }> | string | null
  tags: string[] | null
  image_url: string | null
  status: string
  created_at?: string
  updated_at?: string
}

/**
 * Sync result type
 */
export interface SyncResult {
  success: boolean
  stats: {
    total: number
    created: number
    updated: number
    unchanged: number
    errors: number
  }
  synced_at: string
}
