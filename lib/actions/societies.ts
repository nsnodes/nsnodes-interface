'use server';

import { unstable_cache, revalidateTag } from 'next/cache';
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
 * Fetch societies from Supabase (cached for 5 minutes)
 * Falls back to empty array if Supabase fails or is not configured
 */
const getCachedSocieties = unstable_cache(
  async (): Promise<SocietyDatabase[]> => {
    try {
      const supabase = createServerClient();

      const { data, error } = await supabase
        .from('societies')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      return (data as SupabaseSociety[]).map(transformToSocietyDatabase);
    } catch (error) {
      console.warn('Failed to fetch societies from Supabase, using empty fallback:', error);
      return [];
    }
  },
  ['societies'],
  { revalidate: 300, tags: ['societies'] }
)

export async function getSocieties(): Promise<SocietyDatabase[]> {
  return getCachedSocieties();
}

/**
 * Force refresh the cache (useful for manual updates)
 */
export async function refreshSocietiesCache(): Promise<SocietyDatabase[]> {
  revalidateTag('societies');
  return getSocieties();
}
