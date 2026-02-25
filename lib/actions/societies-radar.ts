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

export async function getProspetaRadarScores(): Promise<RadarScores | null> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('societies')
      .select('scalability, autonomy, qol, belonging, economic, purpose, confidence')
      .eq('name', 'Próspera')
      .single()

    console.log('🔍 Supabase query result for "Próspera":', { data, error })

    if (error || !data) {
      console.error('❌ Error fetching Prospera radar scores:', error)
      return null
    }

    console.log('✅ Raw data from Supabase:', data)

    const result = {
      scalability: Math.round((data.scalability || 0) * 100),
      autonomy: Math.round((data.autonomy || 0) * 100),
      qol: Math.round((data.qol || 0) * 100),
      belonging: Math.round((data.belonging || 0) * 100),
      economic: Math.round((data.economic || 0) * 100),
      purpose: Math.round((data.purpose || 0) * 100)
    }

    console.log('✅ Transformed radar scores:', result)
    return result
  } catch (error) {
    console.error('❌ Error in getProspetaRadarScores:', error)
    return null
  }
}
