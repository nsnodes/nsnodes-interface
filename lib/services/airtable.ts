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

// Map Airtable field names to our application structure
// Adjust these field names to match your actual Airtable column names
interface AirtableRecord {
  id: string;
  fields: {
    Name?: string;
    URL?: string;
    Icon?: Array<{ url: string }>; // Airtable attachment field
    Type?: string;
    Category?: string;
    Location?: string;
    Mission?: string;
    Founded?: string | number;
    Tier?: number;
    X?: string;
    Discord?: string;
    Application?: string;
    Telegram?: string;
  };
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
        return record.fields.Name && record.fields.URL;
      })
      .map((record) => {
        const fields = record.fields;

        // Extract icon URL from Airtable attachment field
        let iconUrl: string | undefined;
        if (fields.Icon && Array.isArray(fields.Icon) && fields.Icon.length > 0) {
          iconUrl = fields.Icon[0].url;
        }

        // Handle Founded field - can be string or number
        let founded: string | undefined;
        if (fields.Founded !== undefined && fields.Founded !== null) {
          founded = typeof fields.Founded === 'number' 
            ? fields.Founded.toString() 
            : fields.Founded.toString();
        }

        // Handle Tier - default to 3 if not provided
        const tier = fields.Tier && typeof fields.Tier === 'number' ? fields.Tier : 3;

        return {
          name: fields.Name || '',
          url: fields.URL || '',
          type: fields.Type || 'Online',
          tier,
          x: fields.X || '',
          discord: fields.Discord || '',
          mission: fields.Mission || '',
          application: fields.Application || '',
          location: fields.Location || undefined,
          icon: iconUrl,
          category: fields.Category || undefined,
          telegram: fields.Telegram || undefined,
          founded: founded || undefined,
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

