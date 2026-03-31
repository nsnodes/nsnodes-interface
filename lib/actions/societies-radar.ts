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

export interface AllRadarData {
  average: number
  scores: number[]
}

export async function getAllCommunityScores(): Promise<Record<string, AllRadarData>> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('societies')
      .select('name, scalability, autonomy, qol, belonging, economic, purpose')

    if (error || !data) {
      return {}
    }

    const result: Record<string, AllRadarData> = {}
    for (const row of data) {
      const scores = [
        Math.round((row.scalability || 0) * 100),
        Math.round((row.autonomy || 0) * 100),
        Math.round((row.qol || 0) * 100),
        Math.round((row.belonging || 0) * 100),
        Math.round((row.purpose || 0) * 100),
        Math.round((row.economic || 0) * 100),
      ]
      const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      result[row.name] = { average, scores }
    }

    return result
  } catch (error) {
    return {}
  }
}
