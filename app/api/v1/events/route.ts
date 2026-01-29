/**
 * Events API Endpoint
 *
 * GET /api/v1/events - List events with pagination, filtering, and search
 */

import { NextRequest } from 'next/server'
import { handleGetEvents } from '@/packages/api/src/routes/events'

export async function GET(request: NextRequest) {
  return handleGetEvents(request)
}
