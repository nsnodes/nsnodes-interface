/**
 * Client-side timezone utilities
 * These functions convert event times from their source timezone to the user's local timezone
 * The eventTimezone parameter is used to ensure correct timestamp interpretation,
 * but the display is always in the user's local timezone
 */

/**
 * Format time in 12-hour format from ISO timestamp
 * Displays time in user's local timezone (eventTimezone is ignored, kept for compatibility)
 */
export function formatTime(isoTimestamp: string, eventTimezone?: string): string {
  const date = new Date(isoTimestamp)

  // Always format in user's local timezone
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const paddedMinutes = minutes.toString().padStart(2, '0')
  return `${hours12}:${paddedMinutes} ${period}`
}

/**
 * Extract date in user's local timezone from ISO timestamp
 * Returns YYYY-MM-DD
 * (eventTimezone parameter is ignored, kept for compatibility)
 */
export function extractLocalDate(isoTimestamp: string, eventTimezone?: string): string {
  const date = new Date(isoTimestamp)

  // Always extract date in user's local timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a time range from start and end ISO timestamps
 * Displays in user's local timezone (eventTimezone is ignored, kept for compatibility)
 */
export function formatTimeRange(startAt: string, endAt: string, eventTimezone?: string): string {
  const startTime = formatTime(startAt)
  const endTime = formatTime(endAt)
  return `${startTime} – ${endTime}`
}
