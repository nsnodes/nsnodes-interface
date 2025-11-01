/**
 * Script to fetch raw event data from Supabase
 * Usage: node scripts/fetch-raw-event.js
 */

import { createClient } from '@supabase/supabase-js'

async function fetchRawEvent() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  console.log('Fetching raw event data from Supabase...\n')

  // Fetch events from sola.day, Edge Patagonia (city: edgepatagonia)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('source', 'soladay')
    .eq('city', 'edgepatagonia')
    .limit(5)
    .order('start_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.log('No events found matching the criteria.')
    console.log('\nLet me try fetching any sola.day events...\n')

    // Try fetching any sola.day events
    const { data: anyData, error: anyError } = await supabase
      .from('events')
      .select('*')
      .eq('source', 'soladay')
      .limit(5)
      .order('start_at', { ascending: false })

    if (anyError) {
      console.error('Error fetching any sola.day events:', anyError)
      process.exit(1)
    }

    if (!anyData || anyData.length === 0) {
      console.log('No sola.day events found at all.')
      process.exit(0)
    }

    console.log(`Found ${anyData.length} sola.day events (any organization):\n`)
    anyData.forEach((event, index) => {
      console.log(`\n=== Event ${index + 1} ===`)
      console.log(JSON.stringify(event, null, 2))
      console.log('\n' + '='.repeat(80))
    })

    return
  }

  console.log(`Found ${data.length} events from sola.day (Edge Patagonia):\n`)

  data.forEach((event, index) => {
    console.log(`\n=== Event ${index + 1} ===`)
    console.log(JSON.stringify(event, null, 2))
    console.log('\n' + '='.repeat(80))
  })
}

// Run the script
fetchRawEvent().catch(console.error)
