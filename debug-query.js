// Debug the query discrepancy
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function debugQuery() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Query WITHOUT status filter
  const { data: data1, count: count1 } = await supabase
    .from('events')
    .select('organizers, status', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}');

  console.log(`Query 1 (no status filter): ${count1} events`);

  // Query WITH status filter
  const { data: data2, count: count2 } = await supabase
    .from('events')
    .select('organizers, status', { count: 'exact' })
    .in('source', ['luma', 'soladay'])
    .not('tags', 'cs', '{popup-city}')
    .in('status', ['scheduled', 'tentative']);

  console.log(`Query 2 (with status filter): ${count2} events`);

  // Count NS events in each
  const ns1 = data1?.filter(e => {
    const orgString = JSON.stringify(e.organizers || '').toLowerCase();
    return orgString.includes('network') && orgString.includes('school');
  }).length || 0;

  const ns2 = data2?.filter(e => {
    const orgString = JSON.stringify(e.organizers || '').toLowerCase();
    return orgString.includes('network') && orgString.includes('school');
  }).length || 0;

  console.log(`\nNS events in query 1: ${ns1}`);
  console.log(`NS events in query 2: ${ns2}`);

  // Check status distribution of all events
  const statusCounts = {};
  data1?.forEach(e => {
    statusCounts[e.status || 'null'] = (statusCounts[e.status || 'null'] || 0) + 1;
  });

  console.log(`\nAll events status distribution:`);
  Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });

  // Check status distribution of NS events
  const nsStatusCounts = {};
  data1?.filter(e => {
    const orgString = JSON.stringify(e.organizers || '').toLowerCase();
    return orgString.includes('network') && orgString.includes('school');
  }).forEach(e => {
    nsStatusCounts[e.status || 'null'] = (nsStatusCounts[e.status || 'null'] || 0) + 1;
  });

  console.log(`\nNS events status distribution:`);
  Object.entries(nsStatusCounts).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
}

debugQuery();

