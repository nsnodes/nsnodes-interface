'use server'

import { createServerClient } from '@/lib/supabase/server'
import { DatabaseEvent, UIEvent, PopupCity } from '@/lib/types/events'

/**
 * Parse network state from organizers field
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
      // If parsing fails, return the raw string
      return organizers.trim()
    }
  }

  // Now handle the parsed/native array
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return 'Unknown'
    }

    // Network state is the LAST organizer in the array
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
 * Format time in 12-hour format from UTC date
 */
function formatTime(date: Date): string {
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutesStr = minutes.toString().padStart(2, '0')
  return `${hours12}:${minutesStr} ${period}`
}

/**
 * Transform a database event to UI format
 */
function transformEvent(dbEvent: DatabaseEvent): UIEvent {
  const startDate = new Date(dbEvent.start_at)
  const endDate = new Date(dbEvent.end_at)

  // Format date as YYYY-MM-DD (UTC)
  const date = startDate.toISOString().split('T')[0]

  // Format time range (UTC)
  const startTime = formatTime(startDate)
  const endTime = formatTime(endDate)
  const time = `${startTime} – ${endTime}`

  // Format location (prefer venue_name, fallback to city, address)
  const location = dbEvent.venue_name || dbEvent.city || dbEvent.address || 'TBD'

  // Parse network state from organizers field
  const networkState = parseNetworkState(dbEvent.organizers)

  // Infer event type from title and description
  const type = inferEventType(dbEvent.title, dbEvent.description)

  return {
    date,
    time,
    title: dbEvent.title,
    location,
    country: dbEvent.country || 'Unknown',
    networkState,
    type,
    url: dbEvent.source_url
  }
}

/**
 * Fetch events from Supabase
 * Server Action that can be called from Client Components
 */
export async function getEvents(): Promise<UIEvent[]> {
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
      // Filter for luma events only (sola.day is for popup cities)
      .eq('source', 'luma')
      // Filter for upcoming events
      .gte('start_at', new Date().toISOString())
      .order('start_at', { ascending: true })
      .limit(100)

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
  const startDate = new Date(dbEvent.start_at)
  const endDate = new Date(dbEvent.end_at)

  // Format dates as YYYY-MM-DD (UTC)
  const date = startDate.toISOString().split('T')[0]
  const endDateStr = endDate.toISOString().split('T')[0]

  // Format location (prefer city, fallback to venue_name, address)
  const location = dbEvent.city
    ? `${dbEvent.city}${dbEvent.country ? ', ' + dbEvent.country : ''}`
    : dbEvent.venue_name || dbEvent.address || 'TBD'

  // Parse network state from organizers field
  const networkState = parseNetworkState(dbEvent.organizers)

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
      // Show ongoing and upcoming popup cities
      .gte('end_at', new Date().toISOString())
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
