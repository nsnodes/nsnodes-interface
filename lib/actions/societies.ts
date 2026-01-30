'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { SocietyDatabase } from '@/lib/data/societies-database';

// Supabase row type (matches database schema)
interface SupabaseSociety {
  id: string;
  name: string;
  url: string;
  type: string | null;
  tier: number | null;
  x: string | null;
  discord: string | null;
  telegram: string | null;
  mission: string | null;
  application: string | null;
  location: string | null;
  icon_url: string | null;
  category: string | null;
  founded: string | null;
  airtable_record_id: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

// Cache the fetched data
let cachedSocieties: SocietyDatabase[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

/**
 * Transform Supabase row to SocietyDatabase format
 */
function transformToSocietyDatabase(row: SupabaseSociety): SocietyDatabase {
  return {
    name: row.name,
    url: row.url,
    type: row.type || 'Online',
    tier: row.tier ?? 3,
    x: row.x || '',
    discord: row.discord || '',
    mission: row.mission || '',
    application: row.application || '',
    location: row.location || undefined,
    icon: row.icon_url || undefined,
    category: row.category || undefined,
    telegram: row.telegram || undefined,
    founded: row.founded || undefined,
  };
}

/**
 * Fetch societies from Supabase
 * Falls back to empty array if Supabase fails or is not configured
 */
export async function getSocieties(): Promise<SocietyDatabase[]> {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedSocieties && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSocieties;
  }

  // Try to fetch from Supabase
  try {
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('societies')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    const societies = (data as SupabaseSociety[]).map(transformToSocietyDatabase);

    // Cache the successful result
    cachedSocieties = societies;
    cacheTimestamp = now;

    return societies;
  } catch (error) {
    // Log the error but don't throw - use fallback instead
    console.warn('Failed to fetch societies from Supabase, using empty fallback:', error);

    // Return empty array as fallback
    return [];
  }
}

/**
 * Force refresh the cache (useful for manual updates)
 */
export async function refreshSocietiesCache(): Promise<SocietyDatabase[]> {
  cachedSocieties = null;
  cacheTimestamp = 0;
  return getSocieties();
}
