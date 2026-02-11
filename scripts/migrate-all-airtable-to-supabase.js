#!/usr/bin/env node

/**
 * Comprehensive Airtable → Supabase Migration Script
 *
 * Migrates all tables:
 * - Societies (sync missing records)
 * - Societies - To add
 * - VC
 * - Grants
 * - Draft
 * - influencers
 *
 * Fully idempotent - uses airtable_record_id for upsert.
 * Safe to run multiple times.
 *
 * Usage:
 *   node scripts/migrate-all-airtable-to-supabase.js
 *   node scripts/migrate-all-airtable-to-supabase.js --dry-run
 *   node scripts/migrate-all-airtable-to-supabase.js --table=societies
 */

const fs = require('fs');
const Airtable = require('airtable');
const { createClient } = require('@supabase/supabase-js');

// Parse args
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const TABLE_FILTER = args.find(a => a.startsWith('--table='))?.split('=')[1];

if (DRY_RUN) console.log('🔍 DRY RUN MODE\n');

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

// Helper: Extract icon URL from Airtable attachment
function getIconUrl(iconField) {
  if (!iconField || !Array.isArray(iconField) || iconField.length === 0) return null;
  const icon = iconField[0];
  return (icon && typeof icon === 'object' && icon.url) ? icon.url : null;
}

// Helper: Safe string
function str(val) {
  return typeof val === 'string' ? val : (val ? String(val) : null);
}

// Helper: Safe number
function num(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

// Helper: Array from multiple select
function arr(val) {
  if (Array.isArray(val)) return val;
  return null;
}

// ============================================================
// Table: Societies
// ============================================================
async function migrateSocieties() {
  console.log('\n📁 Migrating: Societies');

  const records = await base('Societies').select().all();
  console.log(`   Airtable records: ${records.length}`);

  // Get existing societies from Supabase
  const { data: existing } = await supabase.from('societies').select('id, name, airtable_record_id');
  const existingByName = new Map(existing.map(s => [s.name.toLowerCase(), s]));
  const existingById = new Map(existing.filter(s => s.airtable_record_id).map(s => [s.airtable_record_id, s]));

  const transformed = records
    .filter(r => r.fields.Name && r.fields.URL)
    .map(r => ({
      airtable_record_id: r.id,
      name: str(r.fields.Name),
      url: str(r.fields.URL),
      type: str(r.fields.Type) || 'Online',
      tier: 3, // Default
      x: str(r.fields.X) || '', // NOT NULL in Supabase
      discord: str(r.fields.Discord) || '', // NOT NULL in Supabase
      telegram: null,
      mission: str(r.fields.Mission) || '', // NOT NULL in Supabase
      application: str(r.fields.Application) || '', // NOT NULL in Supabase
      location: str(r.fields.Location),
      icon_url: getIconUrl(r.fields.Icon),
      category: Array.isArray(r.fields.Category) ? r.fields.Category[0] : str(r.fields.Category),
      founded: str(r.fields.Founded),
      last_synced_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

  if (DRY_RUN) {
    console.log(`   Would sync ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  let updated = 0;
  let inserted = 0;

  for (const record of transformed) {
    // Find existing by airtable_record_id or name
    const existingRecord = existingById.get(record.airtable_record_id)
      || existingByName.get(record.name.toLowerCase());

    if (existingRecord) {
      // Update existing
      const { error } = await supabase
        .from('societies')
        .update(record)
        .eq('id', existingRecord.id);

      if (error) {
        console.log(`   ⚠️  Failed to update ${record.name}: ${error.message}`);
      } else {
        updated++;
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('societies')
        .insert(record);

      if (error) {
        console.log(`   ⚠️  Failed to insert ${record.name}: ${error.message}`);
      } else {
        inserted++;
      }
    }
  }

  console.log(`   ✅ Updated ${updated}, Inserted ${inserted} records`);
  return { inserted, updated };
}

// ============================================================
// Table: Societies - To add
// ============================================================
async function migrateSocietiesToAdd() {
  console.log('\n📁 Migrating: Societies - To add');

  const records = await base('Societies - To add').select().all();
  console.log(`   Airtable records: ${records.length}`);

  const transformed = records.map(r => ({
    airtable_record_id: r.id,
    name: str(r.fields.Name) || 'Unnamed',
    url: str(r.fields.URL),
    type: str(r.fields.Type),
    category: arr(r.fields.Category),
    location: str(r.fields.Location) || (arr(r.fields.Location) ? arr(r.fields.Location)[0] : null),
    mission: str(r.fields.Mission),
    founded: str(r.fields.Founded),
    x: str(r.fields.X),
    x_followers: str(r.fields.xFollowers),
    discord: str(r.fields.Discord),
    discord_members: str(r.fields.discordMembers),
    application: str(r.fields.Application),
    events: str(r.fields.Events),
    icon_url: getIconUrl(r.fields.Icon),
    comment_before_adding: str(r.fields['Comment before adding']),
    updated_at: new Date().toISOString(),
  }));

  if (DRY_RUN) {
    console.log(`   Would upsert ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  const { error } = await supabase
    .from('societies_to_add')
    .upsert(transformed, { onConflict: 'airtable_record_id' });

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { inserted: 0, updated: 0 };
  }

  console.log(`   ✅ Upserted ${transformed.length} records`);
  return { inserted: 0, updated: transformed.length };
}

// ============================================================
// Table: VC
// ============================================================
async function migrateVC() {
  console.log('\n📁 Migrating: VC');

  const records = await base('VC').select().all();
  console.log(`   Airtable records: ${records.length}`);

  const transformed = records.map(r => ({
    airtable_record_id: r.id,
    airtable_id: num(r.fields.ID),
    name: str(r.fields.Name) || 'Unnamed',
    url: str(r.fields.URL),
    contact_person: str(r.fields['Contact Person']),
    x: str(r.fields.X),
    description: str(r.fields.Description),
    investments: str(r.fields.Investments),
    size: str(r.fields.Size),
    portfolio_type_comments: str(r.fields['Portfolio, type, comments']),
    updated_at: new Date().toISOString(),
  }));

  if (DRY_RUN) {
    console.log(`   Would upsert ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  const { error } = await supabase
    .from('vc')
    .upsert(transformed, { onConflict: 'airtable_record_id' });

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { inserted: 0, updated: 0 };
  }

  console.log(`   ✅ Upserted ${transformed.length} records`);
  return { inserted: 0, updated: transformed.length };
}

// ============================================================
// Table: Grants
// ============================================================
async function migrateGrants() {
  console.log('\n📁 Migrating: Grants');

  const records = await base('Grants').select().all();
  console.log(`   Airtable records: ${records.length}`);

  const transformed = records.map(r => ({
    airtable_record_id: r.id,
    airtable_id: num(r.fields.ID),
    name: str(r.fields.Name) || 'Unnamed',
    url: str(r.fields.URL),
    amount: str(r.fields.Amount),
    type: arr(r.fields.Type),
    institution: str(r.fields.Institution),
    note: str(r.fields.Note),
    updated_at: new Date().toISOString(),
  }));

  if (DRY_RUN) {
    console.log(`   Would upsert ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  const { error } = await supabase
    .from('grants')
    .upsert(transformed, { onConflict: 'airtable_record_id' });

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { inserted: 0, updated: 0 };
  }

  console.log(`   ✅ Upserted ${transformed.length} records`);
  return { inserted: 0, updated: transformed.length };
}

// ============================================================
// Table: Draft
// ============================================================
async function migrateDraft() {
  console.log('\n📁 Migrating: Draft');

  const records = await base('Draft').select().all();
  console.log(`   Airtable records: ${records.length}`);

  const transformed = records.map(r => {
    // Handle attachments
    let attachments = null;
    if (r.fields.Attachments && Array.isArray(r.fields.Attachments)) {
      attachments = r.fields.Attachments.map(a => ({
        url: a.url,
        filename: a.filename,
        type: a.type,
      }));
    }

    // Handle collaborator
    let assignee = null;
    if (r.fields.Assignee && typeof r.fields.Assignee === 'object') {
      assignee = r.fields.Assignee.email || r.fields.Assignee.name || null;
    }

    return {
      airtable_record_id: r.id,
      name: str(r.fields.Name) || 'Unnamed',
      notes: str(r.fields.Notes),
      assignee: assignee,
      status: str(r.fields.Status),
      attachments: attachments,
      attachment_summary: str(r.fields['Attachment Summary']),
      substack: str(r.fields.Substack),
      updated_at: new Date().toISOString(),
    };
  });

  if (DRY_RUN) {
    console.log(`   Would upsert ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  const { error } = await supabase
    .from('draft')
    .upsert(transformed, { onConflict: 'airtable_record_id' });

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { inserted: 0, updated: 0 };
  }

  console.log(`   ✅ Upserted ${transformed.length} records`);
  return { inserted: 0, updated: transformed.length };
}

// ============================================================
// Table: influencers
// ============================================================
async function migrateInfluencers() {
  console.log('\n📁 Migrating: influencers');

  const records = await base('influencers').select().all();
  console.log(`   Airtable records: ${records.length}`);

  const transformed = records.map(r => ({
    airtable_record_id: r.id,
    name: str(r.fields.Name) || 'Unnamed',
    x: str(r.fields.X),
    category: str(r.fields.Category),
    priority: num(r.fields.Priority),
    updated_at: new Date().toISOString(),
  }));

  if (DRY_RUN) {
    console.log(`   Would upsert ${transformed.length} records`);
    return { inserted: 0, updated: transformed.length };
  }

  const { error } = await supabase
    .from('influencers')
    .upsert(transformed, { onConflict: 'airtable_record_id' });

  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { inserted: 0, updated: 0 };
  }

  console.log(`   ✅ Upserted ${transformed.length} records`);
  return { inserted: 0, updated: transformed.length };
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('🚀 Airtable → Supabase Full Migration\n');
  console.log('='.repeat(60));

  const migrations = {
    societies: migrateSocieties,
    'societies-to-add': migrateSocietiesToAdd,
    vc: migrateVC,
    grants: migrateGrants,
    draft: migrateDraft,
    influencers: migrateInfluencers,
  };

  const results = {};

  for (const [name, fn] of Object.entries(migrations)) {
    if (TABLE_FILTER && name !== TABLE_FILTER) continue;

    try {
      results[name] = await fn();
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      results[name] = { error: err.message };
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary\n');

  for (const [name, result] of Object.entries(results)) {
    if (result.error) {
      console.log(`   ${name}: ❌ Failed - ${result.error}`);
    } else {
      console.log(`   ${name}: ✅ ${result.updated} records`);
    }
  }

  console.log('\n✅ Migration complete!');
}

main().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
