/**
 * Argentina Pop-Up Events Database
 *
 * This file contains pop-up events that should appear on the /argentina page.
 * All events listed here will automatically appear in the [ POP-UP ] section
 * on the Argentina page.
 *
 * TEMPLATE FOR ADDING NEW ARGENTINA POP-UP EVENTS:
 * Copy the template below and fill in all required fields.
 */

import type { PopupCity } from '@/lib/types/events'

/**
 * Template for a new Argentina pop-up event:
 *
 * {
 *   date: 'YYYY-MM-DD',              // Start date in ISO format (e.g., '2025-11-15')
 *   endDate: 'YYYY-MM-DD',           // End date in ISO format (e.g., '2025-12-20')
 *   title: 'Event Name',             // Name of the pop-up event
 *   location: 'City, Argentina',    // Physical location (e.g., 'Buenos Aires, Argentina')
 *   networkState: 'Network Name',    // Network/organization name (e.g., 'The Oz City')
 *   url: 'https://...',              // Link to event page or registration
 * }
 *
 * FIELD DESCRIPTIONS:
 *
 * - date: Start date of the pop-up event in YYYY-MM-DD format
 *   Example: '2025-11-15'
 *
 * - endDate: End date of the pop-up event in YYYY-MM-DD format
 *   Example: '2025-12-20'
 *
 * - title: The name/title of the pop-up event
 *   Example: 'The Oz City' or 'Aleph Festival'
 *
 * - location: The physical location where the event takes place
 *   Format: 'City, Argentina'
 *   Examples: 'Buenos Aires, Argentina', 'El Chaltén, Argentina'
 *
 * - networkState: The network state or organization hosting the event
 *   Examples: 'The Oz City', 'Crecimiento', 'Funding The Commons'
 *
 * - url: A link to the event page, registration, or more information
 *   Should be a full URL starting with https://
 *   Examples: 'https://www.theozcity.com/', 'https://aleph.crecimiento.build/'
 */

export const argentinaPopupEvents: PopupCity[] = [
  // Add your Argentina pop-up events below this line
  {
    date: '2025-11-01',
    endDate: '2025-11-16',
    title: 'The Oz City',
    location: 'Patagonia, Argentina',
    networkState: 'The Oz City',
    url: 'https://www.theozcity.com/',
  },
  {
    date: '2025-09-25',
    endDate: '2025-11-22',
    title: 'Aleph Festival',
    location: 'Buenos Aires, Argentina',
    networkState: 'Crecimiento',
    url: 'https://aleph.crecimiento.build/',
  },
  {
    date: '2025-10-24',
    endDate: '2025-11-14',
    title: 'Builder Residency',
    location: 'Buenos Aires, Argentina',
    networkState: 'Funding The Commons',
    url: 'https://www.fundingthecommons.io/builderresidency2025',
  },
  {
    date: '2025-11-17',
    endDate: '2025-11-22',
    title: 'Devconnect',
    location: 'Buenos Aires, Argentina',
    networkState: 'Devconnect Buenos Aires',
    url: 'https://devconnect.org/',
  },
  {
    date: '2025-10-18',
    endDate: '2025-11-15',
    title: 'Edge Patagonia',
    location: 'Patagonia, Argentina',
    networkState: 'Edge City',
    url: 'https://www.edgecity.live/patagonia',
  },
  {
    date: '2025-10-27',
    endDate: '2025-11-16',
    title: 'Invisible Garden',
    location: 'Buenos Aires, Argentina',
    networkState: 'Invisible Garden',
    url: 'https://invisible.garden/',
  },

]

/**
 * Helper function to validate an Argentina popup event
 * This is optional but recommended to catch errors early
 */
function validateArgentinaPopupEvent(event: PopupCity): boolean {
  // Check all required fields are present
  if (!event.date || !event.endDate || !event.title || !event.location || !event.networkState || !event.url) {
    console.error('Missing required fields in Argentina popup event:', event)
    return false
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(event.date) || !dateRegex.test(event.endDate)) {
    console.error('Invalid date format in Argentina popup event (must be YYYY-MM-DD):', event)
    return false
  }

  // Validate URL format
  if (!event.url.startsWith('http://') && !event.url.startsWith('https://')) {
    console.error('Invalid URL format in Argentina popup event (must start with http:// or https://):', event)
    return false
  }

  // Validate end date is after start date
  if (new Date(event.endDate) < new Date(event.date)) {
    console.error('End date must be after start date in Argentina popup event:', event)
    return false
  }

  return true
}

// Validate all Argentina events on module load (in development only)
if (process.env.NODE_ENV === 'development') {
  argentinaPopupEvents.forEach((event, index) => {
    if (!validateArgentinaPopupEvent(event)) {
      console.warn(`Argentina popup event at index ${index} failed validation`)
    }
  })
}

