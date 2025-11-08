const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY; // Need service role for updates

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Mapping of organization/city names to their timezones
 * Based on ORGANIZATION_LOCATIONS in lib/actions/events.ts
 */
const ORGANIZATION_TIMEZONES = {
  'edgepatagonia': 'America/Argentina/Buenos_Aires',  // El Chaltén, Argentina
  '4seas': 'Asia/Bangkok',                            // Chiang Mai, Thailand
  'prospera': 'America/Tegucigalpa',                  // Próspera, Honduras
  'infinitacity': 'America/Argentina/Buenos_Aires',   // INFINITA City, Argentina
  'zuzalucity': 'Europe/Podgorica',                   // Zuzalu City, Montenegro
  'invisiblegardenar': 'America/Argentina/Buenos_Aires', // Invisible Garden, Argentina
};

async function fixSolaDayTimezones() {
  console.log('Fixing timezone for all sola.day events...\n');

  let totalUpdated = 0;

  for (const [org, timezone] of Object.entries(ORGANIZATION_TIMEZONES)) {
    console.log(`Updating ${org} events to ${timezone}...`);

    const { data, error } = await supabase
      .from('events')
      .update({ timezone })
      .eq('source', 'soladay')
      .eq('city', org)
      .is('timezone', null)
      .select('uid, title, start_at, timezone');

    if (error) {
      console.error(`Error updating ${org} events:`, error);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`  ✓ Updated ${data.length} events`);
      totalUpdated += data.length;

      // Show first 3 examples
      data.slice(0, 3).forEach(event => {
        console.log(`    - ${event.title} (${event.start_at})`);
      });
      if (data.length > 3) {
        console.log(`    ... and ${data.length - 3} more`);
      }
    } else {
      console.log(`  No events to update`);
    }

    console.log('');
  }

  console.log(`\n✓ Total events updated: ${totalUpdated}`);
}

fixSolaDayTimezones();
