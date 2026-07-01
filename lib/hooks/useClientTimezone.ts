import { useMemo } from 'react'
import type { UIEvent } from '@/lib/types/events'
import { extractLocalDate, formatTimeRange } from '@/lib/utils/timezone'

/**
 * Hook to convert event times to user's local timezone on the client side
 * This ensures correct timezone display regardless of server timezone
 */
export function useClientTimezone(events: UIEvent[]): UIEvent[] {
  return useMemo(() => {
    // Convert all event times to event's timezone (if available) or user's local timezone
    return events.map(event => ({
      ...event,
      date: extractLocalDate(event.start_at, event.timezone),
      time: formatTimeRange(event.start_at, event.end_at, event.timezone)
    }))
  }, [events])
}
