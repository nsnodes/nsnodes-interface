// Final accurate count of Network School events
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function getFinalNSStats() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, count } = await supabase
    .from('events')
    .select('title, start_at, organizers, city, country, status', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}')
    .order('start_at', { ascending: false });

  if (!data) {
    console.error('No data returned');
    return;
  }

  // Filter for Network School events (check if organizers contains Network School)
  const nsEvents = data.filter(e => {
    const orgString = JSON.stringify(e.organizers || '').toLowerCase();
    return orgString.includes('network') && orgString.includes('school');
  });

  console.log('\n=== NETWORK SCHOOL EVENTS - ACCURATE COUNT ===\n');
  console.log(`Total events in database: ${count}`);
  console.log(`Network School events: ${nsEvents.length}`);
  
  // Split by date
  const today = new Date();
  const past = nsEvents.filter(e => new Date(e.start_at) < today);
  const upcoming = nsEvents.filter(e => new Date(e.start_at) >= today);
  
  console.log(`  - Past events: ${past.length}`);
  console.log(`  - Upcoming events: ${upcoming.length}`);
  
  // Geographic stats
  const countries = new Set(nsEvents.map(e => e.country).filter(Boolean));
  const cities = new Set(nsEvents.map(e => e.city).filter(c => c && !c.includes('http') && !c.includes('networkschool')));
  
  console.log(`\nUnique countries: ${countries.size}`);
  console.log(`Countries: ${Array.from(countries).join(', ')}`);
  
  console.log(`\nUnique cities: ${cities.size}`);
  
  // Date range
  if (nsEvents.length > 0) {
    const oldest = new Date(nsEvents[nsEvents.length - 1].start_at);
    const newest = new Date(nsEvents[0].start_at);
    console.log(`\nDate range: ${oldest.toISOString().split('T')[0]} to ${newest.toISOString().split('T')[0]}`);
  }
  
  console.log('\n===================================\n');
}

getFinalNSStats();

