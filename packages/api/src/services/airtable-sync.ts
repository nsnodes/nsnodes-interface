/**
 * Airtable Sync Service
 *
 * Syncs societies data from Airtable to Supabase.
 * Uses the existing fetchSocietiesFromAirtable() function and upserts to the societies table.
 */

import { createServerClient } from '@/lib/supabase/server'
import { fetchSocietiesFromAirtable } from '@/lib/services/airtable'
import type { SocietyDatabase } from '@/lib/data/societies-database'
import type { SyncResult, SocietyDatabaseRow } from '../types/api-responses'

/**
 * Transform a SocietyDatabase record to the database row format
 */
function transformToDbRow(society: SocietyDatabase): Omit<SocietyDatabaseRow, 'id' | 'airtable_record_id' | 'last_synced_at' | 'created_at' | 'updated_at'> {
  return {
    name: society.name,
    url: society.url,
    type: society.type,
    tier: society.tier,
    x: society.x,
    discord: society.discord,
    telegram: society.telegram || null,
    mission: society.mission,
    application: society.application,
    location: society.location || null,
    icon_url: society.icon || null,
    category: society.category || null,
    founded: society.founded || null,
  }
}

/**
 * Sync all societies from Airtable to Supabase
 *
 * This function:
 * 1. Fetches all societies from Airtable
 * 2. Upserts them to Supabase (using name as unique key)
 * 3. Returns sync statistics
 */
export async function syncSocietiesFromAirtable(): Promise<SyncResult> {
  const startTime = new Date()
  const stats = {
    total: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    errors: 0,
  }

  try {
    // Fetch societies from Airtable
    const societies = await fetchSocietiesFromAirtable()
    stats.total = societies.length

    if (societies.length === 0) {
      console.log('No societies fetched from Airtable')
      return {
        success: true,
        stats,
        synced_at: startTime.toISOString(),
      }
    }

    const supabase = createServerClient()

    // Get existing societies to determine created vs updated
    const { data: existingSocieties, error: fetchError } = await supabase
      .from('societies')
      .select('name, updated_at')

    if (fetchError) {
      console.error('Error fetching existing societies:', fetchError)
      throw fetchError
    }

    const existingNames = new Set(existingSocieties?.map(s => s.name) || [])

    // Transform societies to database format
    const dbRows = societies.map(society => ({
      ...transformToDbRow(society),
      last_synced_at: startTime.toISOString(),
    }))

    // Upsert all societies (using name as unique key)
    const { error: upsertError } = await supabase
      .from('societies')
      .upsert(dbRows, {
        onConflict: 'name',
        ignoreDuplicates: false,
      })

    if (upsertError) {
      console.error('Error upserting societies:', upsertError)
      throw upsertError
    }

    // Calculate stats
    for (const society of societies) {
      if (existingNames.has(society.name)) {
        stats.updated++
      } else {
        stats.created++
      }
    }

    console.log(`Airtable sync completed: ${stats.created} created, ${stats.updated} updated`)

    return {
      success: true,
      stats,
      synced_at: startTime.toISOString(),
    }
  } catch (error) {
    console.error('Error syncing societies from Airtable:', error)
    stats.errors = stats.total || 1

    return {
      success: false,
      stats,
      synced_at: startTime.toISOString(),
    }
  }
}
