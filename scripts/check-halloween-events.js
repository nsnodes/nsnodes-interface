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
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHalloweenEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .or('title.ilike.%Agartha Halloween%,title.ilike.%Edge City Halloween%')
    .order('start_at', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No Halloween events found');
    return;
  }

  console.log(`\nFound ${data.length} Halloween events:\n`);

  data.forEach((event, index) => {
    console.log(`\n--- Event ${index + 1} ---`);
    console.log(`Title: ${event.title}`);
    console.log(`Start: ${event.start_at}`);
    console.log(`End: ${event.end_at}`);
    console.log(`Timezone: ${event.timezone}`);
    console.log(`City: ${event.city}`);
    console.log(`Country: ${event.country}`);
    console.log(`Source: ${event.source}`);
    console.log(`Source URL: ${event.source_url}`);

    // Convert to different timezones for debugging
    const startDate = new Date(event.start_at);
    const endDate = new Date(event.end_at);

    console.log(`\nParsed times:`);
    console.log(`Start (UTC): ${startDate.toISOString()}`);
    console.log(`Start (Local): ${startDate.toString()}`);

    if (event.timezone) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: event.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        console.log(`Start (Event TZ ${event.timezone}): ${formatter.format(startDate)}`);
        console.log(`End (Event TZ ${event.timezone}): ${formatter.format(endDate)}`);
      } catch (e) {
        console.log(`Invalid timezone: ${event.timezone}`);
      }
    }
  });
}

checkHalloweenEvents();
