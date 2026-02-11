#!/usr/bin/env node

/**
 * Idempotent Airtable → Supabase Sync Script for Societies
 *
 * This script safely syncs societies data from Airtable to Supabase.
 * It is fully idempotent - safe to run multiple times without data loss.
 *
 * Behavior:
 * - Uses airtable_record_id to identify records
 * - Updates existing records if they exist (by airtable_record_id)
 * - Inserts new records if they don't exist
 * - Does NOT delete records missing from Airtable (preserves manually added Supabase records)
 * - Updates last_synced_at timestamp on each synced record
 *
 * Environment variables required:
 * - AIRTABLE_API_KEY
 * - AIRTABLE_BASE_ID
 * - AIRTABLE_TABLE_NAME (optional, defaults to "Societies")
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   node scripts/sync-societies-from-airtable.js
 *   node scripts/sync-societies-from-airtable.js --dry-run
 */

const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made to Supabase\n');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Validate environment variables
function validateEnv() {
  const required = [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('\nPlease add them to .env.local:');
    missing.forEach((key) => console.error(`  ${key}=your_value`));
    process.exit(1);
  }
}

// Initialize clients
function getAirtableBase() {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
}

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Fetch all records from Airtable
async function fetchAirtableRecords() {
  const base = getAirtableBase();
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Societies';

  console.log(`📥 Fetching records from Airtable table: ${tableName}`);

  const records = await base(tableName)
    .select({ view: 'Grid view' })
    .all();

  console.log(`   Found ${records.length} records in Airtable`);

  // Transform to Supabase format
  return records
    .filter((record) => {
      const name = record.fields.Name;
      const url = record.fields.URL;
      return name && url && typeof name === 'string' && typeof url === 'string';
    })
    .map((record) => {
      const fields = record.fields;

      // Extract icon URL from Airtable attachment field
      let iconUrl = null;
      if (fields.Icon && Array.isArray(fields.Icon) && fields.Icon.length > 0) {
        const icon = fields.Icon[0];
        if (icon && typeof icon === 'object' && icon.url) {
          iconUrl = icon.url;
        }
      }

      // Handle Founded field
      let founded = null;
      if (fields.Founded !== undefined && fields.Founded !== null) {
        founded =
          typeof fields.Founded === 'number'
            ? fields.Founded.toString()
            : fields.Founded;
      }

      return {
        airtable_record_id: record.id,
        name: typeof fields.Name === 'string' ? fields.Name : '',
        url: typeof fields.URL === 'string' ? fields.URL : '',
        type: typeof fields.Type === 'string' ? fields.Type : 'Online',
        tier: typeof fields.Tier === 'number' ? fields.Tier : 3,
        x: typeof fields.X === 'string' ? fields.X : null,
        discord: typeof fields.Discord === 'string' ? fields.Discord : null,
        telegram: typeof fields.Telegram === 'string' ? fields.Telegram : null,
        mission: typeof fields.Mission === 'string' ? fields.Mission : null,
        application:
          typeof fields.Application === 'string' ? fields.Application : null,
        location: typeof fields.Location === 'string' ? fields.Location : null,
        icon_url: iconUrl,
        category: typeof fields.Category === 'string' ? fields.Category : null,
        founded: founded,
        last_synced_at: new Date().toISOString(),
      };
    });
}

// Fetch existing records from Supabase (keyed by airtable_record_id)
async function fetchExistingSupabaseRecords(supabase) {
  console.log('📥 Fetching existing records from Supabase...');

  const { data, error } = await supabase.from('societies').select('*');

  if (error) {
    throw new Error(`Failed to fetch Supabase records: ${error.message}`);
  }

  console.log(`   Found ${data.length} records in Supabase`);

  // Create lookup maps
  const byAirtableId = new Map();
  const byName = new Map();

  for (const record of data) {
    if (record.airtable_record_id) {
      byAirtableId.set(record.airtable_record_id, record);
    }
    // Also index by name for matching records that don't have airtable_record_id
    byName.set(record.name.toLowerCase(), record);
  }

  return { byAirtableId, byName, all: data };
}

// Sync records
async function syncRecords(supabase, airtableRecords, existingRecords) {
  const { byAirtableId, byName } = existingRecords;

  const toInsert = [];
  const toUpdate = [];

  for (const record of airtableRecords) {
    // First, check if we have an exact match by airtable_record_id
    let existing = byAirtableId.get(record.airtable_record_id);

    // If not found by airtable_record_id, try matching by name
    // (for records that were migrated before we tracked airtable_record_id)
    if (!existing) {
      existing = byName.get(record.name.toLowerCase());
    }

    if (existing) {
      // Update existing record
      toUpdate.push({
        id: existing.id,
        ...record,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Insert new record
      toInsert.push(record);
    }
  }

  console.log(`\n📊 Sync Summary:`);
  console.log(`   - Records to update: ${toUpdate.length}`);
  console.log(`   - Records to insert: ${toInsert.length}`);
  console.log(
    `   - Records in Supabase not in Airtable: ${existingRecords.all.length - toUpdate.length} (preserved)`
  );

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - Would perform the following operations:');
    if (toInsert.length > 0) {
      console.log('\n   INSERT:');
      toInsert.forEach((r) => console.log(`     - ${r.name}`));
    }
    if (toUpdate.length > 0) {
      console.log('\n   UPDATE:');
      toUpdate.slice(0, 10).forEach((r) => console.log(`     - ${r.name}`));
      if (toUpdate.length > 10) {
        console.log(`     ... and ${toUpdate.length - 10} more`);
      }
    }
    return { inserted: 0, updated: 0 };
  }

  let inserted = 0;
  let updated = 0;

  // Perform inserts
  if (toInsert.length > 0) {
    console.log(`\n📝 Inserting ${toInsert.length} new records...`);
    const { error } = await supabase.from('societies').insert(toInsert);
    if (error) {
      console.error('❌ Insert error:', error.message);
    } else {
      inserted = toInsert.length;
      console.log(`   ✅ Inserted ${inserted} records`);
    }
  }

  // Perform updates (one by one to handle errors gracefully)
  if (toUpdate.length > 0) {
    console.log(`\n📝 Updating ${toUpdate.length} existing records...`);
    for (const record of toUpdate) {
      const { id, ...updateData } = record;
      const { error } = await supabase
        .from('societies')
        .update(updateData)
        .eq('id', id);
      if (error) {
        console.error(`   ❌ Failed to update "${record.name}": ${error.message}`);
      } else {
        updated++;
      }
    }
    console.log(`   ✅ Updated ${updated} records`);
  }

  return { inserted, updated };
}

// Main function
async function main() {
  console.log('🚀 Societies Airtable → Supabase Sync Script\n');
  console.log('='.repeat(50));

  try {
    validateEnv();

    const supabase = getSupabaseClient();

    // Fetch data from both sources
    const airtableRecords = await fetchAirtableRecords();
    const existingRecords = await fetchExistingSupabaseRecords(supabase);

    // Perform sync
    const result = await syncRecords(supabase, airtableRecords, existingRecords);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Sync completed successfully!');
    if (!DRY_RUN) {
      console.log(`   Inserted: ${result.inserted}`);
      console.log(`   Updated: ${result.updated}`);
    }
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

main();
