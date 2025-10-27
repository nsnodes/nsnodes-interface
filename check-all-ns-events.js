// Check ALL Network School events without status filter
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkAllNSEvents() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('\n=== Checking different filter combinations ===\n');

  // Check 1: All events from luma/soladay (no status filter)
  const { data: allData, count: allCount } = await supabase
    .from('events')
    .select('title, start_at, organizers, status', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}');

  let nsCountAll = 0;
  if (allData) {
    nsCountAll = allData.filter(e => {
      const orgString = JSON.stringify(e.organizers || '').toLowerCase();
      return orgString.includes('network') && orgString.includes('school');
    }).length;
  }

  console.log(`1. With NO status filter:`);
  console.log(`   Total events: ${allCount}`);
  console.log(`   NS events: ${nsCountAll}\n`);

  // Check 2: Only scheduled/tentative (current filter)
  const { data: currentData, count: currentCount } = await supabase
    .from('events')
    .select('title, start_at, organizers, status', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}')
    .in('status', ['scheduled', 'tentative']);

  let nsCountCurrent = 0;
  if (currentData) {
    nsCountCurrent = currentData.filter(e => {
      const orgString = JSON.stringify(e.organizers || '').toLowerCase();
      return orgString.includes('network') && orgString.includes('school');
    }).length;
  }

  console.log(`2. With status filter (scheduled, tentative):`);
  console.log(`   Total events: ${currentCount}`);
  console.log(`   NS events: ${nsCountCurrent}\n`);

  // Check 3: Look at status distribution
  if (allData) {
    const statusCounts = {};
    allData.forEach(e => {
      const orgString = JSON.stringify(e.organizers || '').toLowerCase();
      if (orgString.includes('network') && orgString.includes('school')) {
        statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
      }
    });

    console.log(`3. NS Events by status:`);
    Object.entries(statusCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
  }

  console.log(`\n===================================`);
  console.log(`\nCONCLUSION:`);
  console.log(`Total Network School events (all statuses): ${nsCountAll}`);
  console.log(`With current filter (scheduled/tentative): ${nsCountCurrent}`);
}

checkAllNSEvents();

