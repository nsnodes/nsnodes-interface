// Script to check which events are currently live
// Run with: node scripts/check-live-events.js

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Manually load environment variables from .env.local
const envFile = readFileSync('.env.local', 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    envVars[match[1].trim()] = match[2].trim()
  }
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkLiveEvents() {
  const now = new Date()
  console.log('🕐 Current time (UTC):', now.toISOString())
  console.log('🕐 Current time (Local):', now.toString())
  console.log('')

  const { data: events, error } = await supabase
    .from('events')
    .select('title, start_at, end_at, timezone, city, country, source')
    .order('start_at', { ascending: true })

  if (error) {
    console.error('❌ Error:', error)
    return
  }

  console.log('📊 Total events in database:', events.length)
  console.log('')

  // Check which events are live
  const liveEvents = events.filter(event => {
    const start = new Date(event.start_at)
    const end = new Date(event.end_at)
    return now >= start && now <= end
  })

  console.log('🔴 Live events:', liveEvents.length)
  console.log('')

  if (liveEvents.length > 0) {
    liveEvents.forEach((event, index) => {
      const start = new Date(event.start_at)
      const end = new Date(event.end_at)
      const duration = (end - start) / (1000 * 60 * 60) // hours
      const elapsed = (now - start) / (1000 * 60 * 60) // hours
      const remaining = (end - now) / (1000 * 60 * 60) // hours

      console.log(`--- Live Event ${index + 1} ---`)
      console.log('Title:', event.title)
      console.log('Start (UTC):', event.start_at)
      console.log('End (UTC):', event.end_at)
      console.log('Timezone:', event.timezone)
      console.log('Location:', event.city || 'N/A', event.country || '')
      console.log('Source:', event.source)
      console.log('Duration:', duration.toFixed(1), 'hours')
      console.log('Elapsed:', elapsed.toFixed(1), 'hours')
      console.log('Remaining:', remaining.toFixed(1), 'hours')
      console.log('')
    })
  } else {
    console.log('ℹ️  No live events found')
    console.log('')

    // Show upcoming events
    const upcomingEvents = events
      .filter(event => new Date(event.start_at) > now)
      .slice(0, 5)

    if (upcomingEvents.length > 0) {
      console.log('📅 Next upcoming events:')
      upcomingEvents.forEach((event, index) => {
        const start = new Date(event.start_at)
        const hoursUntil = (start - now) / (1000 * 60 * 60)
        console.log(`${index + 1}. ${event.title}`)
        console.log(`   Starts in: ${hoursUntil.toFixed(1)} hours (${start.toISOString()})`)
      })
    }
  }
}

checkLiveEvents().catch(console.error)
