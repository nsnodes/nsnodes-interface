import Airtable from 'airtable';
import type { SocietyDatabase } from '@/lib/data/societies-database';

// Initialize Airtable client
function getAirtableClient() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Airtable credentials are not configured. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in your environment variables.');
  }

  const base = new Airtable({ apiKey }).base(baseId);
  return base;
}

/**
 * Fetch all societies from Airtable
 */
export async function fetchSocietiesFromAirtable(): Promise<SocietyDatabase[]> {
  try {
    const base = getAirtableClient();
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Societies';

    const records = await base(tableName)
      .select({
        // Fetch all records
        view: 'Grid view', // You can customize this to use a specific view
      })
      .all();

    // Transform Airtable records to SocietyDatabase format
    const societies: SocietyDatabase[] = records
      .filter((record) => {
        // Filter out records without required fields
        const name = record.fields.Name;
        const url = record.fields.URL;
        return name && url && typeof name === 'string' && typeof url === 'string';
      })
      .map((record) => {
        const fields = record.fields;

        // Safely extract and type-check fields
        const name = typeof fields.Name === 'string' ? fields.Name : '';
        const url = typeof fields.URL === 'string' ? fields.URL : '';
        const type = typeof fields.Type === 'string' ? fields.Type : 'Online';
        const mission = typeof fields.Mission === 'string' ? fields.Mission : '';
        const x = typeof fields.X === 'string' ? fields.X : '';
        const discord = typeof fields.Discord === 'string' ? fields.Discord : '';
        const application = typeof fields.Application === 'string' ? fields.Application : '';
        const location = typeof fields.Location === 'string' ? fields.Location : undefined;
        const category = typeof fields.Category === 'string' ? fields.Category : undefined;
        const telegram = typeof fields.Telegram === 'string' ? fields.Telegram : undefined;

        // Extract icon URL from Airtable attachment field
        let iconUrl: string | undefined;
        if (fields.Icon && Array.isArray(fields.Icon) && fields.Icon.length > 0) {
          const icon = fields.Icon[0];
          if (icon && typeof icon === 'object' && 'url' in icon && typeof icon.url === 'string') {
            iconUrl = icon.url;
          }
        }

        // Handle Founded field - can be string or number
        let founded: string | undefined;
        if (fields.Founded !== undefined && fields.Founded !== null) {
          if (typeof fields.Founded === 'number') {
            founded = fields.Founded.toString();
          } else if (typeof fields.Founded === 'string') {
            founded = fields.Founded;
          }
        }

        // Handle Tier - default to 3 if not provided
        const tier = typeof fields.Tier === 'number' ? fields.Tier : 3;

        return {
          name,
          url,
          type,
          tier,
          x,
          discord,
          mission,
          application,
          location,
          icon: iconUrl,
          category,
          telegram,
          founded,
        };
      });

    return societies;
  } catch (error) {
    console.error('Error fetching societies from Airtable:', error);
    throw error;
  }
}

/**
 * Test Airtable connection
 */
export async function testAirtableConnection(): Promise<boolean> {
  try {
    const base = getAirtableClient();
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Societies';
    
    // Try to fetch one record to test the connection
    await base(tableName)
      .select({
        maxRecords: 1,
      })
      .firstPage();

    return true;
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    return false;
  }
}

