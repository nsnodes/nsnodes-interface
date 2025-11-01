/**
 * Client-side timezone utilities
 * These functions convert times to the event's timezone (if available) or user's local timezone
 */

/**
 * Format time in 12-hour format from ISO timestamp
 * Converts UTC timestamp to event's timezone (if provided) or user's local timezone
 */
export function formatTime(isoTimestamp: string, eventTimezone?: string): string {
  const date = new Date(isoTimestamp)
  
  // If event timezone is provided, format in that timezone
  if (eventTimezone) {
    try {
      // Use Intl.DateTimeFormat to format in the event's timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: eventTimezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      const formatted = formatter.format(date)
      // Parse the formatted string (e.g., "2:30 PM" or "11:45 AM")
      const match = formatted.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      if (match) {
        const hour = match[1]
        const minute = match[2]
        const period = match[3].toUpperCase()
        return `${hour}:${minute} ${period}`
      }
      // Fallback if parsing fails
      const parts = formatter.formatToParts(date)
      const hour = parts.find(p => p.type === 'hour')?.value || '12'
      const minute = parts.find(p => p.type === 'minute')?.value || '00'
      const period = parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || 'AM'
      return `${hour.padStart(2, '0')}:${minute} ${period}`
    } catch (e) {
      // If timezone is invalid, fall back to local timezone
      console.warn(`Invalid timezone: ${eventTimezone}`, e)
    }
  }
  
  // Fallback to user's local timezone
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const paddedMinutes = minutes.toString().padStart(2, '0')
  return `${hours12}:${paddedMinutes} ${period}`
}

/**
 * Extract date in event's timezone (if provided) or user's local timezone from ISO timestamp
 * Returns YYYY-MM-DD
 */
export function extractLocalDate(isoTimestamp: string, eventTimezone?: string): string {
  const date = new Date(isoTimestamp)
  
  // If event timezone is provided, extract date in that timezone
  if (eventTimezone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: eventTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      const parts = formatter.formatToParts(date)
      const year = parts.find(p => p.type === 'year')?.value || ''
      const month = parts.find(p => p.type === 'month')?.value || ''
      const day = parts.find(p => p.type === 'day')?.value || ''
      return `${year}-${month}-${day}`
    } catch (e) {
      // If timezone is invalid, fall back to local timezone
      console.warn(`Invalid timezone: ${eventTimezone}`, e)
    }
  }
  
  // Fallback to user's local timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a time range from start and end ISO timestamps
 * Uses event's timezone if available
 */
export function formatTimeRange(startAt: string, endAt: string, eventTimezone?: string): string {
  const startTime = formatTime(startAt, eventTimezone)
  const endTime = formatTime(endAt, eventTimezone)
  return `${startTime} – ${endTime}`
}
