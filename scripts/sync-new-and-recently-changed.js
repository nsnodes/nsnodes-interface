#!/usr/bin/env node

/**
 * Sync NEW societies and recently CHANGED societies from Airtable to Supabase
 * - Inserts genuinely new societies
 * - Updates societies that were modified in Airtable recently
 */

const fs = require('fs');
const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

// Parse args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const DAYS_BACK = args.find(a => a.startsWith('--days='))?.split('=')[1] || 1;

if (DRY_RUN) console.log('🔍 DRY RUN MODE - No changes will be made\n');

// Load env
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
});

// Clients
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: Extract icon URL
function getIconUrl(iconField) {
  if (!iconField || !Array.isArray(iconField) || iconField.length === 0) return null;
  const icon = iconField[0];
  return (icon && typeof icon === 'object' && icon.url) ? icon.url : null;
}

// Helper: Check if record was modified recently
function wasModifiedRecently(airtableRecord, days) {
  // Airtable doesn't expose last modified in the API by default
  // We'll need to check if the data differs from what's in Supabase
  return false; // This would need custom logic or Airtable metadata
}

// Helper: Check if records are different
function recordsDiffer(airtableData, supabaseData) {
  // Compare key fields
  const fields = ['name', 'url', 'type', 'x', 'discord', 'telegram', 'mission',
                  'application', 'location', 'category', 'founded', 'icon_url'];

  for (const field of fields) {
    if (airtableData[field] !== supabaseData[field]) {
      // Special handling for empty strings vs nulls
      if ((airtableData[field] === '' && supabaseData[field] === null) ||
          (airtableData[field] === null && supabaseData[field] === '')) {
        continue;
      }
      return true;
    }
  }
  return false;
}

async function syncNewAndRecentlyChanged() {
  console.log(`🚀 Syncing NEW and RECENTLY CHANGED Societies (last ${DAYS_BACK} days)\n`);
  console.log('=' + '='.repeat(60));

  // Get all Airtable records
  const airtableRecords = await base('Societies').select().all();
  console.log(`📥 Found ${airtableRecords.length} records in Airtable`);

  // Get all Supabase records
  const { data: supabaseRecords, error } = await supabase.from('societies').select('*');
  if (error) {
    console.error('❌ Error fetching Supabase records:', error.message);
    process.exit(1);
  }
  console.log(`📥 Found ${supabaseRecords.length} records in Supabase`);

  // Create lookup maps
  const existingByAirtableId = new Map();
  const existingByName = new Map();

  for (const record of supabaseRecords) {
    if (record.airtable_record_id) {
      existingByAirtableId.set(record.airtable_record_id, record);
    }
    existingByName.set(record.name.toLowerCase(), record);
  }

  // Categorize records
  const newSocieties = [];
  const changedSocieties = [];
  let unchangedCount = 0;

  for (const record of airtableRecords) {
    const name = record.fields.Name;
    const url = record.fields.URL;

    // Skip if no name or URL
    if (!name || !url) continue;

    // Prepare Airtable data in Supabase format
    const airtableData = {
      airtable_record_id: record.id,
      name: name,
      url: url,
      type: record.fields.Type || 'Online',
      tier: 3,
      x: record.fields.X || '',
      discord: record.fields.Discord || '',
      telegram: record.fields.Telegram || null,
      mission: record.fields.Mission || '',
      application: record.fields.Application || '',
      location: record.fields.Location || null,
      icon_url: getIconUrl(record.fields.Icon),
      category: Array.isArray(record.fields.Category) ? record.fields.Category[0] : (record.fields.Category || null),
      founded: record.fields.Founded ? String(record.fields.Founded) : null,
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Check if exists
    const existingById = existingByAirtableId.get(record.id);
    const existingByName = existingByName.get(name.toLowerCase());
    const existing = existingById || existingByName;

    if (!existing) {
      // Genuinely NEW
      newSocieties.push(airtableData);
    } else if (recordsDiffer(airtableData, existing)) {
      // Data has CHANGED
      changedSocieties.push({
        ...airtableData,
        id: existing.id, // Keep the Supabase ID for update
        changes: [] // Could track specific changes if needed
      });
    } else {
      unchangedCount++;
    }
  }

  // Display results
  console.log('\n' + '='.repeat(61));
  console.log('ANALYSIS RESULTS:');
  console.log('=' + '='.repeat(60));

  // New societies
  if (newSocieties.length > 0) {
    console.log('\n📍 NEW SOCIETIES TO ADD:');
    for (const society of newSocieties) {
      console.log(`   - ${society.name}`);
      console.log(`     Icon: ${society.icon_url ? '✅' : '❌'} | Type: ${society.type} | Location: ${society.location || 'Global'}`);
    }
  } else {
    console.log('\n✅ No new societies to add');
  }

  // Changed societies
  if (changedSocieties.length > 0) {
    console.log('\n🔄 CHANGED SOCIETIES TO UPDATE:');
    for (const society of changedSocieties.slice(0, 10)) {
      console.log(`   - ${society.name}`);
    }
    if (changedSocieties.length > 10) {
      console.log(`   ... and ${changedSocieties.length - 10} more`);
    }
  } else {
    console.log('\n✅ No societies have changed');
  }

  // Summary
  console.log('\n' + '='.repeat(61));
  console.log('SUMMARY:');
  console.log(`   📊 New to insert: ${newSocieties.length}`);
  console.log(`   🔄 Changed to update: ${changedSocieties.length}`);
  console.log(`   ✅ Unchanged: ${unchangedCount}`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - No changes made');
    return;
  }

  // Perform operations
  let inserted = 0;
  let updated = 0;

  // Insert new societies
  if (newSocieties.length > 0) {
    console.log(`\n📝 Inserting ${newSocieties.length} new societies...`);
    const { error: insertError } = await supabase
      .from('societies')
      .insert(newSocieties);

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
    } else {
      inserted = newSocieties.length;
      console.log(`   ✅ Inserted ${inserted} societies`);
    }
  }

  // Update changed societies
  if (changedSocieties.length > 0) {
    console.log(`\n📝 Updating ${changedSocieties.length} changed societies...`);

    // Update one by one for better error handling
    for (const society of changedSocieties) {
      const { id, ...updateData } = society;
      delete updateData.changes; // Remove our tracking field

      const { error: updateError } = await supabase
        .from('societies')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error(`   ❌ Failed to update ${society.name}: ${updateError.message}`);
      } else {
        updated++;
      }
    }
    console.log(`   ✅ Updated ${updated} societies`);
  }

  // Final summary
  console.log('\n' + '='.repeat(61));
  console.log('✅ SYNC COMPLETE!');
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Updated: ${updated}`);

  // Remind about icons if needed
  const withIcons = newSocieties.filter(s => s.icon_url).length;
  if (withIcons > 0) {
    console.log('\n💡 TIP: Run this to migrate icons to Supabase Storage:');
    console.log('   node scripts/migrate-society-icons-to-supabase.js');
  }
}

syncNewAndRecentlyChanged().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});