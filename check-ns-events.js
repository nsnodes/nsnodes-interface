// Detailed check of Network School events
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkNSEvents() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error, count } = await supabase
    .from('events')
    .select('title, start_at, organizers, source', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}')
    .in('status', ['scheduled', 'tentative'])
    .order('start_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`\n=== CHECKING ${count} TOTAL EVENTS ===\n`);

  // Check all the different ways organizers might contain Network School
  const nsVariations = [
    'Network School',
    'network school',
    'NetworkSchool',
    'networkschool'
  ];

  const organizerPatterns = new Map();
  let nsEventsCount = 0;
  const nsEvents = [];

  data.forEach(event => {
    let organizers = event.organizers;
    let hasNS = false;
    
    // Convert string to object if needed
    if (typeof organizers === 'string') {
      try {
        organizers = JSON.parse(organizers);
      } catch {
        // Keep as string
      }
    }

    // Convert to string for searching
    const orgString = JSON.stringify(organizers || '').toLowerCase();
    
    // Check if contains any variation of Network School
    if (orgString.includes('network') && orgString.includes('school')) {
      hasNS = true;
      nsEventsCount++;
      nsEvents.push({
        title: event.title,
        start: event.start_at.split('T')[0],
        organizers: organizers,
        source: event.source
      });
    }

    // Track organizer patterns
    if (Array.isArray(organizers)) {
      organizers.forEach(org => {
        const name = typeof org === 'object' ? org.name : org;
        if (name) {
          organizerPatterns.set(name, (organizerPatterns.get(name) || 0) + 1);
        }
      });
    }
  });

  console.log(`Network School events found: ${nsEventsCount}`);
  console.log(`\nTop organizer names in database:`);
  
  const sorted = Array.from(organizerPatterns.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);
  
  sorted.forEach(([name, count]) => {
    console.log(`  ${count.toString().padStart(4)} - ${name}`);
  });

  // Show sample NS events
  console.log(`\n=== Sample Network School Events ===`);
  nsEvents.slice(0, 5).forEach(e => {
    console.log(`\n${e.start} - ${e.title}`);
    console.log(`  Source: ${e.source}`);
    console.log(`  Organizers: ${JSON.stringify(e.organizers)}`);
  });

  console.log(`\n===================================\n`);
  console.log(`FINAL COUNT: ${nsEventsCount} Network School events out of ${count} total`);
}

checkNSEvents();

