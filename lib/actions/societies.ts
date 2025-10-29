'use server';

import { fetchSocietiesFromAirtable } from '@/lib/services/airtable';
import { societiesDatabase, type SocietyDatabase } from '@/lib/data/societies-database';

// Cache the fetched data
let cachedSocieties: SocietyDatabase[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

/**
 * Fetch societies with ISR (Incremental Static Regeneration)
 * Falls back to hardcoded data if Airtable fails or is not configured
 */
export async function getSocieties(): Promise<SocietyDatabase[]> {
  // Check if we have valid cached data
  const now = Date.now();
  if (cachedSocieties && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSocieties;
  }

  // Try to fetch from Airtable
  try {
    const airtableSocieties = await fetchSocietiesFromAirtable();
    
    // Cache the successful result
    cachedSocieties = airtableSocieties;
    cacheTimestamp = now;
    
    return airtableSocieties;
  } catch (error) {
    // Log the error but don't throw - use fallback instead
    console.warn('Failed to fetch societies from Airtable, using fallback data:', error);
    
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

