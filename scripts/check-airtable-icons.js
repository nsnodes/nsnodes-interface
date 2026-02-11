#!/usr/bin/env node

/**
 * Check which societies in Airtable have icons
 */

const fs = require('fs');
const Airtable = require('airtable');

// Load env
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2];
});

// Clients
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

async function checkIcons() {
  console.log('🔍 Checking Societies in Airtable for icons...\n');

  const records = await base('Societies').select().all();

  const newSocieties = [
    'Invisible Garden',
    'Cyberia',
    'The Mu',
    'Freo Neuhaus',
    'Odisea',
    'ZuCity',
    'Atlantea',
    'ZuBerlin',
    'Agartha',
    'ZuAfrique',
    'Proof of Retreat'
  ];

  console.log('NEW SOCIETIES TO BE ADDED:');
  console.log('=' + '='.repeat(50));

  for (const record of records) {
    const name = record.fields.Name;
    if (newSocieties.includes(name)) {
      const hasIcon = record.fields.Icon && Array.isArray(record.fields.Icon) && record.fields.Icon.length > 0;
      const iconUrl = hasIcon ? record.fields.Icon[0].url : null;

      console.log(`\n📍 ${name}`);
      console.log(`   Icon: ${hasIcon ? '✅ Yes' : '❌ No'}`);
      if (iconUrl) {
        console.log(`   URL: ${iconUrl.substring(0, 80)}...`);
      }
      console.log(`   Type: ${record.fields.Type || 'Not specified'}`);
      console.log(`   Location: ${record.fields.Location || 'Not specified'}`);
      console.log(`   Website: ${record.fields.URL || 'Not specified'}`);
    }
  }

  console.log('\n' + '='.repeat(51));
  console.log('\nSUMMARY:');

  let withIcon = 0;
  let withoutIcon = 0;

  for (const record of records) {
    const name = record.fields.Name;
    if (newSocieties.includes(name)) {
      const hasIcon = record.fields.Icon && Array.isArray(record.fields.Icon) && record.fields.Icon.length > 0;
      if (hasIcon) withIcon++;
      else withoutIcon++;
    }
  }

  console.log(`✅ With icons: ${withIcon}`);
  console.log(`❌ Without icons: ${withoutIcon}`);
  console.log(`📊 Total new societies: ${newSocieties.length}`);
}

checkIcons().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});