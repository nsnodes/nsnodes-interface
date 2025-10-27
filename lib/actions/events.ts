'use server'

import { createServerClient } from '@/lib/supabase/server'
import { DatabaseEvent, UIEvent, PopupCity } from '@/lib/types/events'

/**
 * Parse network state from organizers field
 * Checks if any organizer contains specific network names
 * Supabase auto-parses JSON columns, so it can be:
 * - Already an array: [{"name": "Network School"}]
 * - A JSON string: '[{"name": "Network School"}]'
 * - null or empty array
 */
function parseNetworkState(organizers: Array<{ name: string }> | string | null): string {
  // Handle null/undefined/empty
  if (!organizers) {
    return 'Unknown'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any = organizers

  // If it's a string, try to parse it
  if (typeof organizers === 'string') {
    if (organizers === '[]' || organizers === '""' || organizers.trim() === '') {
      return 'Unknown'
    }
    try {
      parsed = JSON.parse(organizers)
    } catch {
      // If parsing fails, check if string contains Network School
      const orgLower = organizers.toLowerCase()
      if (orgLower.includes('network') && orgLower.includes('school')) {
        return 'Network School'
      }
      return organizers.trim()
    }
  }

  // Now handle the parsed/native array
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return 'Unknown'
    }

    // Check ALL organizers for Network School (not just the last one)
    for (const org of parsed) {
      const name = typeof org === 'object' && org !== null && 'name' in org ? org.name : org
      if (typeof name === 'string') {
        const nameLower = name.toLowerCase()
        if (nameLower.includes('network') && nameLower.includes('school')) {
          return 'Network School'
        }
      }
    }

    // If no Network School found, return the LAST organizer in the array
    const lastOrg = parsed[parsed.length - 1]

    // If last item is an object with a 'name' property
    if (typeof lastOrg === 'object' && lastOrg !== null && 'name' in lastOrg) {
      const name = lastOrg.name
      return (typeof name === 'string' && name.trim()) ? name.trim() : 'Unknown'
    }

    // If last item is just a string
    if (typeof lastOrg === 'string' && lastOrg.trim()) {
      return lastOrg.trim()
    }
  }

  // If it's already a string value
  if (typeof parsed === 'string' && parsed.trim().length > 0) {
    return parsed.trim()
  }

  return 'Unknown'
}

/**
 * Infer event type from title and description
 */
function inferEventType(title: string, description: string | null): string {
  const text = `${title} ${description || ''}`.toLowerCase()

  // Event types - ordered by specificity
  if (/workshop/i.test(text)) return 'Workshop'
  if (/meetup|meet\s*up/i.test(text)) return 'Meetup'
  if (/conference|summit/i.test(text)) return 'Conference'
  if (/meditation|yoga/i.test(text)) return 'Meditation'
  if (/ceremony/i.test(text)) return 'Ceremony'
  if (/discussion|debate|panel|talk/i.test(text)) return 'Discussion'
  if (/demo\s*day/i.test(text)) return 'Demo Day'
  if (/screening/i.test(text)) return 'Screening'
  if (/deepwork|deep\s*work|pomodoro/i.test(text)) return 'Deepwork'
  if (/sport|volleyball|badminton|run\s*club/i.test(text)) return 'Sports'
  if (/social|mixer|gathering/i.test(text)) return 'Social'
  if (/forum/i.test(text)) return 'Forum'
  if (/pop[-\s]*up/i.test(text)) return 'Pop-Up'

  return 'Event'
}

/**
 * Format time in 12-hour format from date
 * Converts UTC timestamp to user's local timezone
 */
function formatTime(isoTimestamp: string, date?: Date): string {
  // Use Date object to convert UTC timestamp to local timezone
  const dateObj = date || new Date(isoTimestamp)

  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const paddedMinutes = minutes.toString().padStart(2, '0')

  return `${hours12}:${paddedMinutes} ${period}`
}

/**
 * Extract date in user's local timezone from ISO timestamp
 * Converts the UTC timestamp to the user's timezone and returns YYYY-MM-DD
 */
function extractLocalDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Detect if event is from Ipê City based on title or location
 */
function isIpeCityEvent(title: string, city: string | null, address: string | null): boolean {
  const searchText = `${title} ${city || ''} ${address || ''}`.toLowerCase()
  return /ip[eê]\s*city|ip[eê]\s*village|ip[eê]\s*breakfast/i.test(searchText)
}

/**
 * Detect if event is from Logos based on title or organizers
 */
function isLogosEvent(title: string, organizers: Array<{ name: string }> | string | null): boolean {
  // Check title for Logos Circle or Logos-related keywords (including Spanish "Círculo Logos")
  if (/logos\s*circle|c[íi]rculo\s*logos|parallel\s*society\s*festival/i.test(title)) {
    return true
  }

  // Check if any organizer contains "Logos" or is a known Logos organizer
  if (organizers) {
    let parsed = organizers
    if (typeof organizers === 'string') {
      try {
        parsed = JSON.parse(organizers)
      } catch {
        return false
      }
    }

    if (Array.isArray(parsed)) {
      return parsed.some(org => {
        const name = typeof org === 'object' && org.name ? org.name : org
        if (typeof name === 'string') {
          const nameLower = name.toLowerCase()
          // Check for "Logos" in name or known Logos organizers
          return nameLower.includes('logos') || nameLower.includes('isaac warburton')
        }
        return false
      })
    }
  }

  return false
}

/**
 * Organization slug to location mapping for Sola.day events
 */
const ORGANIZATION_LOCATIONS: Record<string, { city: string; country: string }> = {
  'edgepatagonia': { city: 'El Chaltén', country: 'Argentina' },
  '4seas': { city: 'Chiang Mai', country: 'Thailand' },
  'prospera': { city: 'Próspera', country: 'Honduras' },
  'Prospera-events': { city: 'Próspera', country: 'Honduras' },
  'infinitacity': { city: 'INFINITA City', country: 'Argentina' },
  'zuzalucity': { city: 'Zuzalu City', country: 'Montenegro' },
  'invisiblegardenar': { city: 'Invisible Garden', country: 'Argentina' }
}

/**
 * Generate Google Maps link from location data
 */
function generateMapsLink(dbEvent: DatabaseEvent): string | null {
  // Priority 1: Use lat/lng if available (most accurate)
  if (dbEvent.lat && dbEvent.lng) {
    return `https://www.google.com/maps?q=${dbEvent.lat},${dbEvent.lng}`
  }

  // Priority 2: Use exact address for Luma events
  if (dbEvent.source === 'luma' && dbEvent.address && !dbEvent.address.includes('http')) {
    let query = ''

    // Check if address already contains full details (has comma or is long)
    const isDetailedAddress = dbEvent.address.includes(',') || dbEvent.address.length > 50

    if (isDetailedAddress) {
      // Address already has full details, use it as-is
      query = dbEvent.address
    } else {
      // Address is just venue/building name, combine with city and country
      // Don't duplicate venue_name if it's the same as address
      const parts = []

      if (dbEvent.address && dbEvent.address !== dbEvent.venue_name) {
        parts.push(dbEvent.address)
      } else if (dbEvent.venue_name) {
        parts.push(dbEvent.venue_name)
      }

      // Add city and country if address doesn't already contain them
      if (dbEvent.city && !dbEvent.address.toLowerCase().includes(dbEvent.city.toLowerCase())) {
        parts.push(dbEvent.city)
      }
      if (dbEvent.country && !dbEvent.address.toLowerCase().includes(dbEvent.country.toLowerCase())) {
        parts.push(dbEvent.country)
      }

      query = parts.join(', ')
    }

    if (query) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    }
  }

  // Priority 3: Use organization location for Sola.day events
  if (dbEvent.source === 'soladay' && dbEvent.city) {
    const orgLocation = ORGANIZATION_LOCATIONS[dbEvent.city]
    if (orgLocation) {
      const query = encodeURIComponent(`${orgLocation.city}, ${orgLocation.country}`)
      return `https://www.google.com/maps/search/?api=1&query=${query}`
    }
  }

  return null
}

/**
 * Organization slugs/keywords that Luma uses in city field (not real cities)
 * These indicate the event is associated with an organization, not a physical location
 */
const LUMA_ORG_KEYWORDS = ['ipecity', 'logos', 'networkschool', 'prospera']

/**
 * Check if a city value is actually an organization slug or contains org keywords
 */
function isOrgSlug(city: string | null): boolean {
  if (!city) return false
  const cityLower = city.toLowerCase()
  
  // Check if city exactly matches or contains any org keyword
  return LUMA_ORG_KEYWORDS.some(keyword => 
    cityLower === keyword || cityLower.includes(keyword)
  )
}

/**
 * Check if an event has any real physical location data
 */
function hasPhysicalLocation(dbEvent: DatabaseEvent): boolean {
  // Check if venue name exists and is not a URL
  const hasValidVenue = !!(dbEvent.venue_name && 
                        !dbEvent.venue_name.includes('http') && 
                        dbEvent.venue_name.trim().length > 0)
  
  // Check if address exists and is not a URL
  const hasValidAddress = !!(dbEvent.address && 
                          !dbEvent.address.includes('http') && 
                          dbEvent.address.trim().length > 0)
  
  // Check if city exists, is not a URL, and is not an org slug
  const hasValidCity = !!(dbEvent.city && 
                       !dbEvent.city.includes('http') && 
                       dbEvent.city.trim().length > 0 &&
                       !isOrgSlug(dbEvent.city))
  
  return hasValidVenue || hasValidAddress || hasValidCity
}

/**
 * Format location string for display, with truncation
 */
function formatLocation(dbEvent: DatabaseEvent, maxLength: number = 40): string {
  let location = ''

  // For Luma events with venue name
  if (dbEvent.venue_name && !dbEvent.venue_name.includes('http')) {
    location = dbEvent.venue_name
  }
  // For Luma events with address
  else if (dbEvent.address && !dbEvent.address.includes('http')) {
    location = dbEvent.address
  }
  // For Sola.day events, use mapped location
  else if (dbEvent.source === 'soladay' && dbEvent.city) {
    const orgLocation = ORGANIZATION_LOCATIONS[dbEvent.city]
    if (orgLocation) {
      location = orgLocation.city
    } else {
      location = dbEvent.city
    }
  }
  // Fallback to city (but skip organization slugs)
  else if (dbEvent.city && !dbEvent.city.includes('http') && !isOrgSlug(dbEvent.city)) {
    location = dbEvent.city
  }
  // For Luma (and other sources), if no physical location data exists, mark as Virtual
  else if (!hasPhysicalLocation(dbEvent)) {
    location = 'Virtual'
  }
  // Final fallback
  else {
    location = 'TBD'
  }

  // Truncate if too long
  if (location.length > maxLength) {
    location = location.substring(0, maxLength) + '...'
  }

  return location
}

/**
 * Get country for event (with Sola.day organization mapping)
 */
function getCountry(dbEvent: DatabaseEvent): string {
  // Luma events usually have country
  if (dbEvent.country) {
    return dbEvent.country
  }

  // For Sola.day events, map from organization slug
  if (dbEvent.source === 'soladay' && dbEvent.city) {
    const orgLocation = ORGANIZATION_LOCATIONS[dbEvent.city]
    if (orgLocation) {
      return orgLocation.country
    }
  }

  return 'Unknown'
}

/**
 * Transform a database event to UI format
 * Date and time are formatted on client-side to ensure correct timezone
 */
function transformEvent(dbEvent: DatabaseEvent): UIEvent {
  const startDate = new Date(dbEvent.start_at)
  const endDate = new Date(dbEvent.end_at)

  // Temporary server-side date/time formatting (will be replaced client-side)
  // These are just placeholders that will be overridden on the client
  const date = extractLocalDate(dbEvent.start_at)
  const startTime = formatTime(dbEvent.start_at, startDate)
  const endTime = formatTime(dbEvent.end_at, endDate)
  const time = `${startTime} – ${endTime}`

  // Format location with truncation
  const location = formatLocation(dbEvent)

  // Generate Google Maps link
  const mapsLink = generateMapsLink(dbEvent)

  // Get country (with Sola.day organization mapping)
  const country = getCountry(dbEvent)

  // Parse network state from organizers field
  // Override with specific network states for special cases
  let networkState = parseNetworkState(dbEvent.organizers)
  if (isIpeCityEvent(dbEvent.title, dbEvent.city, dbEvent.address)) {
    networkState = 'Ipê City'
  } else if (isLogosEvent(dbEvent.title, dbEvent.organizers)) {
    networkState = 'Logos'
  }

  // Infer event type from title and description
  const type = inferEventType(dbEvent.title, dbEvent.description)

  return {
    date,
    time,
    title: dbEvent.title,
    location,
    country,
    networkState,
    type,
    url: dbEvent.source_url,
    mapsLink: mapsLink || undefined,
    // Include raw timestamps for client-side timezone conversion
    start_at: dbEvent.start_at,
    end_at: dbEvent.end_at
  }
}

/**
 * Fetch all events (past and future) for stats
 * Server Action that can be called from Client Components
 */
export async function getAllEvents(): Promise<UIEvent[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('events')
      .select(`
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url,
        status
      `)
      .in('source', ['luma', 'soladay'])
      .not('tags', 'cs', '{popup-city}')
      .in('status', ['scheduled', 'tentative'])
      .order('start_at', { ascending: false })
      .limit(2000)

    if (error) {
      console.error('Error fetching all events from Supabase:', error)
      return []
    }

    // Transform all events
    return (data as DatabaseEvent[]).map(transformEvent)
  } catch (error) {
    console.error('Error in getAllEvents:', error)
    return []
  }
}

/**
 * Fetch all Network School events (past and future) for stats
 * Server Action that can be called from Client Components
 */
export async function getAllNetworkSchoolEvents(): Promise<UIEvent[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('events')
      .select(`
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url,
        status
      `)
      .in('source', ['luma', 'soladay'])
      .not('tags', 'cs', '{popup-city}')
      .in('status', ['scheduled', 'tentative'])
      .order('start_at', { ascending: false })
      .limit(2000)

    if (error) {
      console.error('Error fetching all NS events from Supabase:', error)
      return []
    }

    // Transform all events - parseNetworkState will now correctly identify NS events
    const allEvents = (data as DatabaseEvent[]).map(transformEvent)
    // Filter for Network School events only
    return allEvents.filter(event => event.networkState === 'Network School')
  } catch (error) {
    console.error('Error in getAllNetworkSchoolEvents:', error)
    return []
  }
}

/**
 * Fetch events from Supabase
 * Server Action that can be called from Client Components
 */
export async function getEvents(): Promise<UIEvent[]> {
  try {
    const supabase = createServerClient()

    // Calculate the cutoff date (2 days ago)
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

    const { data, error } = await supabase
      .from('events')
      .select(`
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url,
        status
      `)
      // Filter for upcoming events from both Luma and Sola.day
      // Exclude popup cities (they have their own section)
      .in('source', ['luma', 'soladay'])
      .not('tags', 'cs', '{popup-city}')
      // Include both scheduled and tentative events
      .in('status', ['scheduled', 'tentative'])
      // Include events that haven't ended yet (includes both upcoming and currently live events)
      .gte('end_at', new Date().toISOString())
      // Exclude events that started more than 2 days ago
      .gte('start_at', twoDaysAgo.toISOString())
      .order('start_at', { ascending: true })
      .limit(500)

    if (error) {
      console.error('Error fetching events from Supabase:', error)
      return []
    }

    // Transform database events to UI format
    return (data as DatabaseEvent[]).map(transformEvent)
  } catch (error) {
    console.error('Error in getEvents:', error)
    return []
  }
}

/**
 * Fetch events for a specific organizer/network state
 */
export async function getEventsByOrganizer(organizerSlug: string): Promise<UIEvent[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('events')
      .select(`
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url
      `)
      .gte('start_at', new Date().toISOString())
      // Filter by organizer - adjust this based on your data structure
      .or(`source_url.ilike.%${organizerSlug}%,organizers.cs.{${organizerSlug}}`)
      .order('start_at', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Error fetching events by organizer:', error)
      return []
    }

    return (data as DatabaseEvent[]).map(transformEvent)
  } catch (error) {
    console.error('Error in getEventsByOrganizer:', error)
    return []
  }
}

/**
 * Transform a database event to popup city format
 */
function transformPopupCity(dbEvent: DatabaseEvent): PopupCity {
  // Extract dates in local timezone (preserves original dates without UTC shift)
  const date = extractLocalDate(dbEvent.start_at)
  const endDateStr = extractLocalDate(dbEvent.end_at)

  // Format location (prefer city, fallback to venue_name, address)
  const location = dbEvent.city
    ? `${dbEvent.city}${dbEvent.country ? ', ' + dbEvent.country : ''}`
    : dbEvent.venue_name || dbEvent.address || 'TBD'

  // Use same logic as location for network state
  const networkState = location

  return {
    date,
    endDate: endDateStr,
    title: dbEvent.title,
    location,
    networkState,
    url: dbEvent.source_url
  }
}

/**
 * Fetch popup cities from Supabase
 * Filters by the "popup-city" tag
 */
export async function getPopupCities(): Promise<PopupCity[]> {
  try {
    const supabase = createServerClient()

    // Calculate date range: events starting within next 365 days
    const today = new Date()
    const maxStartDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('events')
      .select(`
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url
      `)
      // Filter for events with "popup-city" tag
      .contains('tags', ['popup-city'])
      // Show popup cities that haven't ended yet
      .gte('end_at', today.toISOString())
      // Only show popup cities starting within the next 365 days
      .lte('start_at', maxStartDate.toISOString())
      .order('start_at', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Error fetching popup cities from Supabase:', error)
      return []
    }

    // Transform database events to popup city format
    return (data as DatabaseEvent[]).map(transformPopupCity)
  } catch (error) {
    console.error('Error in getPopupCities:', error)
    return []
  }
}
