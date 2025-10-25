const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://qdzjcvbsfmznakbmfwfc.supabase.co'
const supabaseKey = 'sb_secret_EfNFnYSg2tESGb8cmlOSeQ_qO5glw70'

const supabase = createClient(supabaseUrl, supabaseKey)

async function showRawDataExamples() {
  console.log('=== RAW EVENT DATA EXAMPLES FROM DATABASE ===\n\n')

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Error:', error)
    return
  }

  const lumaEvents = data.filter(e => e.source === 'luma')
  const soladayEvents = data.filter(e => e.source === 'soladay')

  // Example 1: Event with coordinates
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 1: LUMA EVENT WITH COORDINATES')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const withCoords = lumaEvents.find(e => e.lat && e.lng)
  if (withCoords) {
    console.log(JSON.stringify({
      title: withCoords.title,
      description: withCoords.description?.substring(0, 100) + '...',
      start_at: withCoords.start_at,
      end_at: withCoords.end_at,
      timezone: withCoords.timezone,
      venue_name: withCoords.venue_name,
      address: withCoords.address,
      city: withCoords.city,
      country: withCoords.country,
      lat: withCoords.lat,
      lng: withCoords.lng,
      source: withCoords.source,
      source_url: withCoords.source_url,
      organizers: withCoords.organizers,
      tags: withCoords.tags,
      status: withCoords.status
    }, null, 2))
  }

  // Example 2: Event with detailed address
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 2: LUMA EVENT WITH DETAILED ADDRESS')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const detailedAddr = lumaEvents.find(e =>
    e.address &&
    !e.address.includes('http') &&
    (e.address.includes(',') || e.address.length > 50)
  )
  if (detailedAddr) {
    console.log(JSON.stringify({
      title: detailedAddr.title,
      description: detailedAddr.description?.substring(0, 100) + '...',
      start_at: detailedAddr.start_at,
      end_at: detailedAddr.end_at,
      timezone: detailedAddr.timezone,
      venue_name: detailedAddr.venue_name,
      address: detailedAddr.address,
      city: detailedAddr.city,
      country: detailedAddr.country,
      lat: detailedAddr.lat,
      lng: detailedAddr.lng,
      source: detailedAddr.source,
      source_url: detailedAddr.source_url,
      organizers: detailedAddr.organizers,
      tags: detailedAddr.tags,
      status: detailedAddr.status
    }, null, 2))
  } else {
    console.log('(No events with detailed addresses without coordinates found)')
  }

  // Example 3: Event with simple venue name
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 3: LUMA EVENT WITH SIMPLE VENUE NAME')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const simpleVenue = lumaEvents.find(e =>
    e.address &&
    !e.address.includes('http') &&
    !e.address.includes(',') &&
    e.address.length < 50 &&
    !e.lat
  )
  if (simpleVenue) {
    console.log(JSON.stringify({
      title: simpleVenue.title,
      description: simpleVenue.description?.substring(0, 100) + '...',
      start_at: simpleVenue.start_at,
      end_at: simpleVenue.end_at,
      timezone: simpleVenue.timezone,
      venue_name: simpleVenue.venue_name,
      address: simpleVenue.address,
      city: simpleVenue.city,
      country: simpleVenue.country,
      lat: simpleVenue.lat,
      lng: simpleVenue.lng,
      source: simpleVenue.source,
      source_url: simpleVenue.source_url,
      organizers: simpleVenue.organizers,
      tags: simpleVenue.tags,
      status: simpleVenue.status
    }, null, 2))
  }

  // Example 4: Event with URL as address (broken)
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 4: LUMA EVENT WITH URL AS ADDRESS (ISSUE)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const urlAddr = lumaEvents.find(e => e.address && e.address.includes('http'))
  if (urlAddr) {
    console.log(JSON.stringify({
      title: urlAddr.title,
      description: urlAddr.description?.substring(0, 100) + '...',
      start_at: urlAddr.start_at,
      end_at: urlAddr.end_at,
      timezone: urlAddr.timezone,
      venue_name: urlAddr.venue_name,
      address: urlAddr.address,
      city: urlAddr.city,
      country: urlAddr.country,
      lat: urlAddr.lat,
      lng: urlAddr.lng,
      source: urlAddr.source,
      source_url: urlAddr.source_url,
      organizers: urlAddr.organizers,
      tags: urlAddr.tags,
      status: urlAddr.status
    }, null, 2))
  }

  // Example 5: Sola.day event
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 5: SOLA.DAY EVENT (USES ORG SLUG)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const soladay = soladayEvents[0]
  if (soladay) {
    console.log(JSON.stringify({
      title: soladay.title,
      description: soladay.description?.substring(0, 100) + '...',
      start_at: soladay.start_at,
      end_at: soladay.end_at,
      timezone: soladay.timezone,
      venue_name: soladay.venue_name,
      address: soladay.address,
      city: soladay.city, // <- This is actually the organization slug!
      country: soladay.country,
      lat: soladay.lat,
      lng: soladay.lng,
      source: soladay.source,
      source_url: soladay.source_url,
      organizers: soladay.organizers,
      tags: soladay.tags,
      status: soladay.status
    }, null, 2))
  }

  // Example 6: Logos event
  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('EXAMPLE 6: LOGOS EVENT')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  const logosEvent = data.find(e => e.title && e.title.toLowerCase().includes('logos'))
  if (logosEvent) {
    console.log(JSON.stringify({
      title: logosEvent.title,
      description: logosEvent.description?.substring(0, 100) + '...',
      start_at: logosEvent.start_at,
      end_at: logosEvent.end_at,
      timezone: logosEvent.timezone,
      venue_name: logosEvent.venue_name,
      address: logosEvent.address,
      city: logosEvent.city,
      country: logosEvent.country,
      lat: logosEvent.lat,
      lng: logosEvent.lng,
      source: logosEvent.source,
      source_url: logosEvent.source_url,
      organizers: logosEvent.organizers,
      tags: logosEvent.tags,
      status: logosEvent.status
    }, null, 2))
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  console.log(`Total Events Analyzed: ${data.length}`)
  console.log(`  - Luma Events: ${lumaEvents.length}`)
  console.log(`  - Sola.day Events: ${soladayEvents.length}`)
  console.log()
  console.log('Key Observations:')
  console.log('  1. Luma events with coordinates (lat/lng) have the most accurate location')
  console.log('  2. Some Luma events have detailed street addresses in the "address" field')
  console.log('  3. Most Luma events have simple venue names that need city/country added')
  console.log('  4. Some Luma events incorrectly have URLs in the "address" field')
  console.log('  5. Sola.day events use organization slugs in "city" field (not real cities)')
  console.log('  6. Sola.day events lack venue_name, address, country, and coordinates')
}

showRawDataExamples()
