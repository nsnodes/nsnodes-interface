#!/usr/bin/env node

/**
 * Migrate Society Icons from Airtable URLs to Supabase Storage
 *
 * This script:
 * 1. Fetches all societies from Supabase that have Airtable icon URLs
 * 2. Downloads each image
 * 3. Uploads to Supabase Storage (society-icons bucket)
 * 4. Updates the icon_url in the database
 *
 * Idempotent: Safe to run multiple times. Skips societies that already have
 * Supabase Storage URLs.
 *
 * Usage:
 *   node scripts/migrate-society-icons-to-supabase.js
 *   node scripts/migrate-society-icons-to-supabase.js --dry-run
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');

if (DRY_RUN) {
  console.log('🔍 DRY RUN MODE - No changes will be made\n');
}

// Load environment variables from .env.local
const fs = require('fs');
const envPath = '.env.local';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2];
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'society-icons';

// Initialize Supabase client
function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Check if URL is an Airtable URL that needs migration
function isAirtableUrl(url) {
  if (!url) return false;
  return url.includes('airtableusercontent.com') || url.includes('airtable.com');
}

// Check if URL is already a Supabase Storage URL
function isSupabaseStorageUrl(url) {
  if (!url) return false;
  return url.includes('supabase.co/storage');
}

// Download image from URL
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadImage(response.headers.location).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP ${response.statusCode}`));
        return;
      }

      const contentType = response.headers['content-type'] || 'image/png';
      const chunks = [];

      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType,
        });
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Get file extension from content type
function getExtension(contentType) {
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
  };
  return map[contentType] || 'png';
}

// Sanitize name for use as filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Upload image to Supabase Storage
async function uploadToStorage(supabase, societyName, imageData) {
  const filename = `${sanitizeFilename(societyName)}.${getExtension(imageData.contentType)}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, imageData.buffer, {
      contentType: imageData.contentType,
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

// Update society icon_url in database
async function updateSocietyIconUrl(supabase, societyId, newUrl) {
  const { error } = await supabase
    .from('societies')
    .update({
      icon_url: newUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', societyId);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }
}

// Main migration function
async function migrate() {
  console.log('🚀 Society Icons Migration: Airtable → Supabase Storage\n');
  console.log('='.repeat(60));

  const supabase = getSupabase();

  // Fetch all societies
  console.log('\n📥 Fetching societies from Supabase...');
  const { data: societies, error } = await supabase
    .from('societies')
    .select('id, name, icon_url');

  if (error) {
    console.error('❌ Failed to fetch societies:', error.message);
    process.exit(1);
  }

  console.log(`   Found ${societies.length} societies total`);

  // Filter societies that need migration
  const needsMigration = societies.filter(
    (s) => isAirtableUrl(s.icon_url) && !isSupabaseStorageUrl(s.icon_url)
  );
  const alreadyMigrated = societies.filter((s) => isSupabaseStorageUrl(s.icon_url));
  const noIcon = societies.filter((s) => !s.icon_url);

  console.log(`   - Need migration: ${needsMigration.length}`);
  console.log(`   - Already migrated: ${alreadyMigrated.length}`);
  console.log(`   - No icon: ${noIcon.length}`);

  if (needsMigration.length === 0) {
    console.log('\n✅ All societies with icons are already migrated!');
    return;
  }

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN - Would migrate these societies:');
    needsMigration.forEach((s) => console.log(`   - ${s.name}`));
    return;
  }

  // Migrate each society
  console.log('\n📤 Migrating icons...\n');

  let success = 0;
  let failed = 0;

  for (const society of needsMigration) {
    process.stdout.write(`   ${society.name}... `);

    try {
      // Download image
      const imageData = await downloadImage(society.icon_url);

      // Upload to Supabase Storage
      const newUrl = await uploadToStorage(supabase, society.name, imageData);

      // Update database
      await updateSocietyIconUrl(supabase, society.id, newUrl);

      console.log('✅');
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ Migration complete!');
  console.log(`   Success: ${success}`);
  console.log(`   Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n⚠️  Some migrations failed. You can re-run the script to retry.');
  }
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
