'use server'

import { createServerClient } from '@/lib/supabase/server'

export interface RadarScores {
  scalability: number
  autonomy: number
  qol: number
  belonging: number
  economic: number
  purpose: number
}

export async function getSocietyRadarScores(societyName: string): Promise<RadarScores | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('societies')
      .select('scalability, autonomy, qol, belonging, economic, purpose, confidence')
      .eq('name', societyName)
      .single()

    if (error || !data) {
      return null
    }

    return {
      scalability: Math.round((data.scalability || 0) * 100),
      autonomy: Math.round((data.autonomy || 0) * 100),
      qol: Math.round((data.qol || 0) * 100),
      belonging: Math.round((data.belonging || 0) * 100),
      economic: Math.round((data.economic || 0) * 100),
      purpose: Math.round((data.purpose || 0) * 100)
    }
  } catch (error) {
    return null
  }
}

export async function getAllCommunityScores(): Promise<Record<string, number>> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('societies')
      .select('name, scalability, autonomy, qol, belonging, economic, purpose')

    if (error || !data) {
      return {}
    }

    const scores: Record<string, number> = {}
    for (const row of data) {
      const average = Math.round(
        ((row.scalability || 0) + (row.autonomy || 0) + (row.qol || 0) +
         (row.belonging || 0) + (row.economic || 0) + (row.purpose || 0)) / 6 * 100
      )
      scores[row.name] = average
    }

    return scores
  } catch (error) {
    return {}
  }
}
