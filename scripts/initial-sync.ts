/**
 * One-time script to sync societies from Airtable to Supabase
 *
 * Run with: npx tsx scripts/initial-sync.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

import { syncSocietiesFromAirtable } from '../packages/api/src/services/airtable-sync'

async function main() {
  console.log('Starting initial sync from Airtable to Supabase...')
  console.log('')

  try {
    const result = await syncSocietiesFromAirtable()

    console.log('Sync completed!')
    console.log('================')
    console.log(`Success: ${result.success}`)
    console.log(`Total societies: ${result.stats.total}`)
    console.log(`Created: ${result.stats.created}`)
    console.log(`Updated: ${result.stats.updated}`)
    console.log(`Errors: ${result.stats.errors}`)
    console.log(`Synced at: ${result.synced_at}`)
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

main()
