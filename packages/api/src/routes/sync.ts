/**
 * Sync API Route Handler
 *
 * POST /api/v1/sync/societies - Webhook receiver for Airtable sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateSyncSecret } from '../middleware/api-key-auth'
import { syncSocietiesFromAirtable } from '../services/airtable-sync'
import type { ApiErrorResponse, SyncResult } from '../types/api-responses'

/**
 * Handle POST /api/v1/sync/societies
 *
 * This endpoint is called by Airtable automation when records change.
 * It triggers a full sync of all societies from Airtable to Supabase.
 */
export async function handleSyncSocieties(
  request: NextRequest
): Promise<NextResponse<SyncResult | ApiErrorResponse>> {
  // Validate sync secret
  const authError = validateSyncSecret(request)
  if (authError) return authError

  try {
    console.log('Starting Airtable societies sync...')
    const result = await syncSocietiesFromAirtable()

    if (result.success) {
      console.log('Airtable sync completed successfully:', result.stats)
      return NextResponse.json(result)
    } else {
      console.error('Airtable sync failed:', result.stats)
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    console.error('Unexpected error in sync endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: 'Failed to sync societies from Airtable.',
        },
      },
      { status: 500 }
    )
  }
}
