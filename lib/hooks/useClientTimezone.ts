import { useEffect, useState } from 'react'
import type { UIEvent } from '@/lib/types/events'
import { extractLocalDate, formatTimeRange } from '@/lib/utils/timezone'

/**
 * Hook to convert event times to user's local timezone on the client side
 * This ensures correct timezone display regardless of server timezone
 */
export function useClientTimezone(events: UIEvent[]): UIEvent[] {
  const [clientEvents, setClientEvents] = useState<UIEvent[]>(events)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true)

    // Convert all event times to user's local timezone
    const convertedEvents = events.map(event => ({
      ...event,
      date: extractLocalDate(event.start_at),
      time: formatTimeRange(event.start_at, event.end_at)
    }))

    setClientEvents(convertedEvents)
  }, [events])

  // During SSR, return original events
  // After hydration, return timezone-converted events
  return isClient ? clientEvents : events
}
