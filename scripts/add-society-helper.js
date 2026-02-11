#!/usr/bin/env node

/**
 * Helper script to add a single society to Supabase
 * Can be used programmatically or from command line
 *
 * Usage:
 *   node scripts/add-society-helper.js --name="Society Name" --url="https://example.com" --type="Physical" --location="USA"
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

// Load env
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2];
  });
}

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Download image from URL
 */
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Upload image to Supabase Storage
 */
async function uploadToStorage(buffer, filename) {
  const { data, error } = await supabase.storage
    .from('society-icons')
    .upload(filename, buffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('society-icons')
    .getPublicUrl(filename);

  return publicUrl;
}

/**
 * Add a society to the database
 */
async function addSociety(societyData) {
  const {
    name,
    url,
    type = 'Online',
    location = 'Global',
    logoUrl = null,
    logoPath = null,
    mission = '',
    x = '',
    discord = '',
    telegram = null,
    application = '',
    category = null,
    founded = null
  } = societyData;

  // Validate required fields
  if (!name || !url) {
    throw new Error('Name and URL are required');
  }

  // Handle logo
  let iconUrl = null;
  if (logoUrl) {
    try {
      console.log(`📥 Downloading logo for ${name}...`);
      const imageBuffer = await downloadImage(logoUrl);
      const filename = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      iconUrl = await uploadToStorage(imageBuffer, filename);
      console.log(`   ✅ Logo uploaded`);
    } catch (err) {
      console.log(`   ⚠️  Failed to download/upload logo: ${err.message}`);
    }
  } else if (logoPath && fs.existsSync(logoPath)) {
    try {
      console.log(`📤 Uploading local logo for ${name}...`);
      const imageBuffer = fs.readFileSync(logoPath);
      const filename = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      iconUrl = await uploadToStorage(imageBuffer, filename);
      console.log(`   ✅ Logo uploaded`);
    } catch (err) {
      console.log(`   ⚠️  Failed to upload logo: ${err.message}`);
    }
  }

  // Prepare society record
  const society = {
    name,
    url,
    type,
    location: location === 'Global' ? null : location,
    icon_url: iconUrl,
    mission: mission || '',
    x: x || '',
    discord: discord || '',
    telegram: telegram || null,
    application: application || '',
    category,
    founded: founded ? String(founded) : null,
    tier: 3, // Default tier
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_synced_at: new Date().toISOString()
  };

  // Insert into database
  console.log(`💾 Adding ${name} to database...`);
  const { data, error } = await supabase
    .from('societies')
    .insert(society)
    .select();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  console.log(`   ✅ Successfully added ${name}!`);
  return data[0];
}

/**
 * Parse societies from markdown content
 */
function parseSocietiesFromMarkdown(content) {
  const societies = [];
  const sections = content.split(/^## /m).slice(1); // Split by ## headers

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const name = lines[0].trim();

    const society = { name };

    for (const line of lines.slice(1)) {
      const match = line.match(/^\s*-\s*\*\*([^*]+)\*\*:\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        const keyLower = key.toLowerCase();

        switch (keyLower) {
          case 'url':
          case 'website':
            society.url = value.trim();
            break;
          case 'type':
            society.type = value.trim();
            break;
          case 'location':
            society.location = value.trim();
            break;
          case 'logo':
          case 'icon':
            if (value.startsWith('http')) {
              society.logoUrl = value.trim();
            } else {
              society.logoPath = value.trim();
            }
            break;
          case 'mission':
          case 'description':
            society.mission = value.trim();
            break;
          case 'x':
          case 'twitter':
          case 'x/twitter':
            society.x = value.trim().replace('@', '');
            break;
          case 'discord':
            society.discord = value.trim();
            break;
          case 'telegram':
            society.telegram = value.trim();
            break;
          case 'founded':
          case 'year':
            society.founded = value.trim();
            break;
        }
      }
    }

    if (society.name && society.url) {
      societies.push(society);
    }
  }

  return societies;
}

/**
 * Main function for CLI usage
 */
async function main() {
  const args = process.argv.slice(2);

  // Check if markdown file is provided
  const mdFile = args.find(arg => arg.endsWith('.md'));

  if (mdFile && fs.existsSync(mdFile)) {
    // Parse from markdown file
    console.log(`📖 Reading societies from ${mdFile}...`);
    const content = fs.readFileSync(mdFile, 'utf8');
    const societies = parseSocietiesFromMarkdown(content);

    console.log(`Found ${societies.length} societies to add\n`);

    for (const society of societies) {
      try {
        await addSociety(society);
      } catch (err) {
        console.error(`❌ Failed to add ${society.name}: ${err.message}`);
      }
    }
  } else {
    // Parse from command line arguments
    const society = {};

    for (const arg of args) {
      const match = arg.match(/^--([^=]+)=(.+)$/);
      if (match) {
        const [, key, value] = match;

        switch (key) {
          case 'name': society.name = value; break;
          case 'url': society.url = value; break;
          case 'type': society.type = value; break;
          case 'location': society.location = value; break;
          case 'logo-url': society.logoUrl = value; break;
          case 'logo-path': society.logoPath = value; break;
          case 'mission': society.mission = value; break;
          case 'x': society.x = value; break;
          case 'discord': society.discord = value; break;
          case 'founded': society.founded = value; break;
        }
      }
    }

    if (!society.name || !society.url) {
      console.log('Usage:');
      console.log('  node scripts/add-society-helper.js new-societies.md');
      console.log('  node scripts/add-society-helper.js --name="Name" --url="https://..." --type="Physical" --location="USA"');
      console.log('\nOptions:');
      console.log('  --name        Society name (required)');
      console.log('  --url         Website URL (required)');
      console.log('  --type        Physical/Online/Popup/Decentralized (default: Online)');
      console.log('  --location    Location or "Global" (default: Global)');
      console.log('  --logo-url    Logo image URL');
      console.log('  --logo-path   Path to local logo file');
      console.log('  --mission     Mission statement');
      console.log('  --x           X/Twitter handle');
      console.log('  --discord     Discord invite link');
      console.log('  --founded     Year founded');
      process.exit(1);
    }

    try {
      await addSociety(society);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ Done!');
}

// Export for use in other scripts
module.exports = { addSociety, parseSocietiesFromMarkdown };

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}