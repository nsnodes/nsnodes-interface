// Simple script to check for Arc and Commons events
// Run with: node scripts/check-arc-events.js

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkArcEvents() {
  console.log('🔍 Checking for Arc events in database...\n')

  // Check for events with 'arc' in organizers
  const { data: arcOrganizers, error: error1 } = await supabase
    .from('events')
    .select('title, organizers, tags, source, start_at')
    .ilike('organizers', '%arc%')
    .limit(10)

  console.log('📊 Events with "arc" in organizers:')
  if (error1) {
    console.error('Error:', error1)
  } else {
    console.log(`Found ${arcOrganizers?.length || 0} events`)
    arcOrganizers?.forEach(event => {
      console.log('  -', event.title)
      console.log('    Organizers:', event.organizers)
      console.log('    Tags:', event.tags)
      console.log('')
    })
  }

  // Check for events with 'commons' tag
  const { data: commonsEvents, error: error3 } = await supabase
    .from('events')
    .select('title, organizers, tags, source, start_at')
    .contains('tags', ['commons'])
    .limit(10)

  console.log('\n📊 Events with "commons" tag:')
  if (error3) {
    console.error('Error:', error3)
  } else {
    console.log(`Found ${commonsEvents?.length || 0} events`)
    commonsEvents?.forEach(event => {
      console.log('  -', event.title)
      console.log('    Organizers:', event.organizers)
      console.log('    Tags:', event.tags)
      console.log('')
    })
  }

  // Get sample of all tags
  const { data: allEvents, error: error4 } = await supabase
    .from('events')
    .select('tags')
    .not('tags', 'is', null)
    .limit(500)

  console.log('\n📊 Unique tags in database:')
  if (error4) {
    console.error('Error:', error4)
  } else {
    const allTags = new Set()
    allEvents?.forEach(event => {
      if (Array.isArray(event.tags)) {
        event.tags.forEach(tag => allTags.add(tag))
      }
    })
    console.log(Array.from(allTags).sort())
  }
}

checkArcEvents()
