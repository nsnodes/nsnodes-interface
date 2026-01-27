/**
 * Societies Sync Webhook Endpoint
 *
 * POST /api/v1/sync/societies - Receives webhook from Airtable and triggers sync
 */

import { NextRequest } from 'next/server'
import { handleSyncSocieties } from '@/packages/api/src/routes/sync'

export async function POST(request: NextRequest) {
  return handleSyncSocieties(request)
}
