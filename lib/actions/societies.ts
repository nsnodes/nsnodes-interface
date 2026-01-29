'use server';

import { createServerClient } from '@/lib/supabase/server';
import { societiesDatabase, type SocietyDatabase } from '@/lib/data/societies-database';

// Cache the fetched data
let cachedSocieties: SocietyDatabase[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

/**
 * Fetch societies from Supabase
 * Falls back to hardcoded data if Supabase fails or returns empty
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

    if (data && data.length > 0) {
      // Transform Supabase data to SocietyDatabase format
      const societies: SocietyDatabase[] = data.map((row) => ({
        name: row.name,
        url: row.url,
        type: row.type as SocietyDatabase['type'],
        tier: row.tier,
        x: row.x || '',
        discord: row.discord || '',
        telegram: row.telegram || '',
        mission: row.mission,
        application: row.application || '',
        location: row.location || '',
        icon: row.icon_url || '',
        category: row.category || '',
        founded: row.founded || '',
      }));

      // Cache the successful result
      cachedSocieties = societies;
      cacheTimestamp = now;

      return societies;
    }

    // If no data from Supabase, use fallback
    return societiesDatabase;
  } catch (error) {
    // Log the error but don't throw - use fallback instead
    console.warn('Failed to fetch societies from Supabase, using fallback data:', error);

    // Return hardcoded fallback data
    return societiesDatabase;
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
