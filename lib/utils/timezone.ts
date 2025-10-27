/**
 * Client-side timezone utilities
 * These functions run in the browser and use the user's local timezone
 */

/**
 * Format time in 12-hour format from ISO timestamp
 * Converts UTC timestamp to user's local timezone
 */
export function formatTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const paddedMinutes = minutes.toString().padStart(2, '0')
  return `${hours12}:${paddedMinutes} ${period}`
}

/**
 * Extract date in user's local timezone from ISO timestamp
 * Converts the UTC timestamp to the user's timezone and returns YYYY-MM-DD
 */
export function extractLocalDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a time range from start and end ISO timestamps
 */
export function formatTimeRange(startAt: string, endAt: string): string {
  const startTime = formatTime(startAt)
  const endTime = formatTime(endAt)
  return `${startTime} – ${endTime}`
}
