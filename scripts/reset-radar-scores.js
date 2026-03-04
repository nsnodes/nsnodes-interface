#!/usr/bin/env node

/**
 * One-time script to reset all 6 radar scores to 0.5 (50%) for every society.
 * Run: node scripts/reset-radar-scores.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log('Resetting all radar scores to 0.5 (50%)...');

  const { data, error } = await supabase
    .from('societies')
    .update({
      scalability: 0.5,
      autonomy: 0.5,
      qol: 0.5,
      belonging: 0.5,
      economic: 0.5,
      purpose: 0.5,
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // matches all rows

  if (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  console.log('Done. All societies now have radar scores of 50%.');
}

main();
