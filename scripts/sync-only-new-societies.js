#!/usr/bin/env node

/**
 * Sync ONLY NEW societies from Airtable to Supabase
 * This script will NOT update existing records, only insert new ones
 */

const fs = require('fs');
const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

// Parse args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

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

async function syncOnlyNewSocieties() {
  console.log('🚀 Syncing ONLY NEW Societies from Airtable to Supabase\n');
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

  // Create lookup maps for existing records
  const existingByAirtableId = new Map();
  const existingByName = new Map();

  for (const record of supabaseRecords) {
    if (record.airtable_record_id) {
      existingByAirtableId.set(record.airtable_record_id, record);
    }
    existingByName.set(record.name.toLowerCase(), record);
  }

  // Find NEW societies only
  const newSocieties = [];

  for (const record of airtableRecords) {
    const name = record.fields.Name;
    const url = record.fields.URL;

    // Skip if no name or URL
    if (!name || !url) continue;

    // Check if already exists
    const existsByAirtableId = existingByAirtableId.has(record.id);
    const existsByName = existingByName.has(name.toLowerCase());

    if (!existsByAirtableId && !existsByName) {
      // This is genuinely NEW
      const iconUrl = getIconUrl(record.fields.Icon);

      newSocieties.push({
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
        icon_url: iconUrl,
        category: Array.isArray(record.fields.Category) ? record.fields.Category[0] : (record.fields.Category || null),
        founded: record.fields.Founded ? String(record.fields.Founded) : null,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  // Display what will be added
  console.log('\n' + '='.repeat(61));
  console.log('NEW SOCIETIES TO ADD:');
  console.log('=' + '='.repeat(60));

  if (newSocieties.length === 0) {
    console.log('\n✅ No new societies to add - all are already in Supabase!');
    return;
  }

  for (const society of newSocieties) {
    console.log(`\n📍 ${society.name}`);
    console.log(`   Icon: ${society.icon_url ? '✅ Yes' : '❌ No'}`);
    console.log(`   Type: ${society.type}`);
    console.log(`   Location: ${society.location || 'Not specified'}`);
    console.log(`   Website: ${society.url}`);
  }

  // Summary
  console.log('\n' + '='.repeat(61));
  console.log('SUMMARY:');
  const withIcon = newSocieties.filter(s => s.icon_url).length;
  const withoutIcon = newSocieties.filter(s => !s.icon_url).length;

  console.log(`\n📊 NEW societies to insert: ${newSocieties.length}`);
  console.log(`   ✅ With icons: ${withIcon}`);
  console.log(`   ❌ Without icons: ${withoutIcon}`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - No changes made');
    return;
  }

  // Insert new societies
  if (newSocieties.length > 0) {
    console.log(`\n📝 Inserting ${newSocieties.length} new societies...`);

    const { error: insertError } = await supabase
      .from('societies')
      .insert(newSocieties);

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      process.exit(1);
    }

    console.log(`✅ Successfully inserted ${newSocieties.length} new societies!`);

    // If icons exist, remind to migrate them
    if (withIcon > 0) {
      console.log('\n💡 TIP: Run this to migrate icons to Supabase Storage:');
      console.log('   node scripts/migrate-society-icons-to-supabase.js');
    }
  }
}

syncOnlyNewSocieties().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});