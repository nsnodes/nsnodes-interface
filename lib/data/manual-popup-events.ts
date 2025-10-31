/**
 * Manual Pop-Up Events Database
 *
 * This file contains manually added pop-up events that are not automatically
 * fetched from Luma or Sola.day APIs. These events will be merged with
 * database events and displayed in the [ POP-UP ] section.
 *
 * TEMPLATE FOR ADDING NEW POP-UP EVENTS:
 * Copy the template below and fill in all required fields.
 */

import type { PopupCity } from '@/lib/types/events'

/**
 * Template for a new pop-up event:
 *
 * {
 *   date: 'YYYY-MM-DD',              // Start date in ISO format (e.g., '2025-11-15')
 *   endDate: 'YYYY-MM-DD',           // End date in ISO format (e.g., '2025-12-20')
 *   title: 'Event Name',             // Name of the pop-up event
 *   location: 'City, Country',       // Physical location (e.g., 'El Chaltén, Argentina')
 *   networkState: 'Network Name',    // Network/organization name (e.g., 'Edge Patagonia')
 *   url: 'https://...',              // Link to event page or registration
 *   showInPages: ['argentina'],      // (OPTIONAL) Array of pages where this appears. Omit for all pages.
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
 *   Example: 'Edge Patagonia Season 2' or 'Zuzalu City'
 *
 * - location: The physical location where the event takes place
 *   Format: 'City, Country'
 *   Examples: 'El Chaltén, Argentina', 'Próspera, Honduras', 'Chiang Mai, Thailand'
 *
 * - networkState: The network state or organization hosting the event
 *   Examples: 'Edge Patagonia', 'Zuzalu', 'Network School', 'Próspera'
 *
 * - url: A link to the event page, registration, or more information
 *   Should be a full URL starting with https://
 *   Examples: 'https://edge.org/patagonia', 'https://lu.ma/event-slug'
 *
 * - showInPages: (OPTIONAL) Array of page names where this event should appear
 *   If omitted, the event appears on all pages
 *   Examples: ['argentina'], ['argentina', 'ns'], or omit entirely for all pages
 *   Valid page names: 'argentina', 'ns', 'events', etc.
 */

export const manualPopupEvents: PopupCity[] = [
  // Add your manual pop-up events below this line
  // Example: Event that appears only on Argentina page
  // {
  //   date: '2025-11-01',
  //   endDate: '2025-11-16',
  //   title: 'Argentina-only Event',
  //   location: 'Buenos Aires, Argentina',
  //   networkState: 'Network Name',
  //   url: 'https://example.com',
  //   showInPages: ['argentina'], // Only shows on /argentina page
  // },
  // Example: Event that appears on multiple pages
  // {
  //   date: '2025-11-01',
  //   endDate: '2025-11-16',
  //   title: 'Multi-page Event',
  //   location: 'City, Country',
  //   networkState: 'Network Name',
  //   url: 'https://example.com',
  //   showInPages: ['argentina', 'ns'], // Shows on /argentina and /ns pages
  // },
  // Example: Event that appears on ALL pages (omit showInPages)
  {
    date: '2025-11-01',
    endDate: '2025-11-16',
    title: 'The Oz City',
    location: 'Patagonia, Argentina',
    networkState: 'The Oz City',
    url: 'https://www.theozcity.com/',
    // No showInPages = appears on all pages
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
  
]

/**
 * Helper function to validate a manual popup event
 * This is optional but recommended to catch errors early
 */
function validatePopupEvent(event: PopupCity): boolean {
  // Check all required fields are present
  if (!event.date || !event.endDate || !event.title || !event.location || !event.networkState || !event.url) {
    console.error('Missing required fields in popup event:', event)
    return false
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(event.date) || !dateRegex.test(event.endDate)) {
    console.error('Invalid date format in popup event (must be YYYY-MM-DD):', event)
    return false
  }

  // Validate URL format
  if (!event.url.startsWith('http://') && !event.url.startsWith('https://')) {
    console.error('Invalid URL format in popup event (must start with http:// or https://):', event)
    return false
  }

  // Validate end date is after start date
  if (new Date(event.endDate) < new Date(event.date)) {
    console.error('End date must be after start date in popup event:', event)
    return false
  }

  return true
}

// Validate all manual events on module load (in development only)
if (process.env.NODE_ENV === 'development') {
  manualPopupEvents.forEach((event, index) => {
    if (!validatePopupEvent(event)) {
      console.warn(`Manual popup event at index ${index} failed validation`)
    }
  })
}
