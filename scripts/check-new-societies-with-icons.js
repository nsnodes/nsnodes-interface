#!/usr/bin/env node

/**
 * Dynamically check which NEW societies from Airtable need to be synced
 * and whether they have icons
 */

const fs = require('fs');
const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

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

async function checkNewSocietiesWithIcons() {
  console.log('🔍 Checking for NEW societies in Airtable that need syncing...\n');

  // Get all Airtable records
  const airtableRecords = await base('Societies').select().all();
  console.log(`📥 Found ${airtableRecords.length} records in Airtable`);

  // Get all Supabase records
  const { data: supabaseRecords, error } = await supabase.from('societies').select('*');
  if (error) {
    console.error('❌ Error fetching Supabase records:', error.message);
    process.exit(1);
  }
  console.log(`📥 Found ${supabaseRecords.length} records in Supabase\n`);

  // Create lookup maps for Supabase records
  const supabaseByAirtableId = new Map();
  const supabaseByName = new Map();

  for (const record of supabaseRecords) {
    if (record.airtable_record_id) {
      supabaseByAirtableId.set(record.airtable_record_id, record);
    }
    supabaseByName.set(record.name.toLowerCase(), record);
  }

  // Find NEW societies (in Airtable but not in Supabase)
  const newSocieties = [];
  const updatedSocieties = [];

  for (const record of airtableRecords) {
    const name = record.fields.Name;
    const url = record.fields.URL;

    // Skip if no name or URL
    if (!name || !url) continue;

    // Check if exists in Supabase
    const existsByAirtableId = supabaseByAirtableId.has(record.id);
    const existsByName = supabaseByName.has(name.toLowerCase());

    if (!existsByAirtableId && !existsByName) {
      // This is a NEW society
      const hasIcon = record.fields.Icon && Array.isArray(record.fields.Icon) && record.fields.Icon.length > 0;
      const iconUrl = hasIcon ? record.fields.Icon[0].url : null;

      newSocieties.push({
        name,
        url: record.fields.URL,
        type: record.fields.Type || 'Not specified',
        location: record.fields.Location || 'Not specified',
        hasIcon,
        iconUrl,
        airtableId: record.id
      });
    } else {
      // This society exists but may need updating
      updatedSocieties.push(name);
    }
  }

  // Display results
  console.log('=' + '='.repeat(60));
  console.log('NEW SOCIETIES TO BE ADDED:');
  console.log('=' + '='.repeat(60));

  if (newSocieties.length === 0) {
    console.log('\n✅ No new societies to add - all are already synced!');
  } else {
    for (const society of newSocieties) {
      console.log(`\n📍 ${society.name}`);
      console.log(`   Icon: ${society.hasIcon ? '✅ Yes' : '❌ No'}`);
      if (society.iconUrl) {
        console.log(`   Icon URL: ${society.iconUrl.substring(0, 80)}...`);
      }
      console.log(`   Type: ${society.type}`);
      console.log(`   Location: ${society.location}`);
      console.log(`   Website: ${society.url}`);
      console.log(`   Airtable ID: ${society.airtableId}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(61));
  console.log('SUMMARY:');
  console.log('=' + '='.repeat(60));

  const withIcon = newSocieties.filter(s => s.hasIcon).length;
  const withoutIcon = newSocieties.filter(s => !s.hasIcon).length;

  console.log(`\n📊 NEW societies to be inserted: ${newSocieties.length}`);
  console.log(`   ✅ With icons: ${withIcon}`);
  console.log(`   ❌ Without icons: ${withoutIcon}`);

  console.log(`\n📝 Existing societies to be updated: ${updatedSocieties.length}`);

  console.log(`\n💾 To sync these, run:`);
  console.log(`   node scripts/sync-societies-from-airtable.js`);
  console.log(`\n🎨 To migrate icons to Supabase Storage, run:`);
  console.log(`   node scripts/migrate-society-icons-to-supabase.js`);
}

checkNewSocietiesWithIcons().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});