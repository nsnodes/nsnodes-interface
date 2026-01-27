/**
 * Societies API Endpoint
 *
 * GET /api/v1/societies - List societies with pagination, filtering, and search
 */

import { NextRequest } from 'next/server'
import { handleGetSocieties } from '@/packages/api/src/routes/societies'

export async function GET(request: NextRequest) {
  return handleGetSocieties(request)
}
