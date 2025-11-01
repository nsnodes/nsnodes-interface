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

async function fixHalloweenEventsTimezone() {
  // Update timezone for Edge Patagonia Halloween events
  // These events are in Argentina, so we'll set timezone to America/Argentina/Buenos_Aires
  const { data, error } = await supabase
    .from('events')
    .update({ timezone: 'America/Argentina/Buenos_Aires' })
    .or('title.ilike.%Agartha Halloween%,title.ilike.%Edge City Halloween%')
    .eq('city', 'edgepatagonia')
    .select();

  if (error) {
    console.error('Error updating events:', error);
    return;
  }

  console.log(`Updated ${data.length} events with Argentina timezone`);
  data.forEach(event => {
    console.log(`- ${event.title}: ${event.timezone}`);
  });
}

fixHalloweenEventsTimezone();
