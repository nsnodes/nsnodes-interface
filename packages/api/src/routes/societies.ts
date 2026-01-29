/**
 * Societies API Route Handler
 *
 * GET /api/v1/societies - List societies with pagination, filtering, and search
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { validateApiKey } from '../middleware/api-key-auth'
import type {
  ApiResponse,
  ApiErrorResponse,
  SocietyApiResponse,
  SocietiesQueryParams,
  SocietyDatabaseRow,
  PaginationMeta,
} from '../types/api-responses'

const MAX_LIMIT = 100
const DEFAULT_LIMIT = 20

/**
 * Parse and validate query parameters
 */
function parseQueryParams(request: NextRequest): SocietiesQueryParams {
  const url = new URL(request.url)

  const limit = parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10)
  const offset = parseInt(url.searchParams.get('offset') || '0', 10)
  const type = url.searchParams.get('type') as SocietiesQueryParams['type'] | null
  const tier = url.searchParams.get('tier') ? parseInt(url.searchParams.get('tier')!, 10) : undefined
  const category = url.searchParams.get('category') || undefined
  const search = url.searchParams.get('search') || undefined
  const sort_by = (url.searchParams.get('sort_by') || 'name') as SocietiesQueryParams['sort_by']
  const sort_order = (url.searchParams.get('sort_order') || 'asc') as SocietiesQueryParams['sort_order']

  return {
    limit: Math.min(MAX_LIMIT, Math.max(1, limit)),
    offset: Math.max(0, offset),
    type: type || undefined,
    tier: tier && tier >= 1 && tier <= 5 ? tier : undefined,
    category,
    search,
    sort_by,
    sort_order,
  }
}

/**
 * Transform database row to API response format
 */
function transformToApiResponse(row: SocietyDatabaseRow): SocietyApiResponse {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    type: row.type as SocietyApiResponse['type'],
    tier: row.tier,
    mission: row.mission,
    location: row.location,
    category: row.category,
    founded: row.founded,
    icon_url: row.icon_url,
    social: [
      row.x ? { key: 'x', value: row.x } : null,
      row.discord ? { key: 'discord', value: row.discord } : null,
      row.telegram ? { key: 'telegram', value: row.telegram } : null,
    ].filter((s): s is { key: string; value: string } => s !== null),
    application_url: row.application || null,
    updated_at: row.updated_at,
  }
}

/**
 * Handle GET /api/v1/societies
 */
export async function handleGetSocieties(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SocietyApiResponse[]> | ApiErrorResponse>> {
  // Validate API key
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const params = parseQueryParams(request)
    const supabase = createServerClient()

    // Build the query
    let query = supabase.from('societies').select('*', { count: 'exact' })

    // Apply filters
    if (params.type) {
      query = query.eq('type', params.type)
    }

    if (params.tier) {
      query = query.eq('tier', params.tier)
    }

    if (params.category) {
      query = query.eq('category', params.category)
    }

    // Apply search (searches name and URL)
    if (params.search) {
      const searchTerm = `%${params.search}%`
      query = query.or(`name.ilike.${searchTerm},url.ilike.${searchTerm}`)
    }

    // Apply sorting
    const sortColumn = params.sort_by || 'name'
    const sortAscending = params.sort_order !== 'desc'
    query = query.order(sortColumn, { ascending: sortAscending })

    // Apply pagination
    const limit = params.limit || DEFAULT_LIMIT
    const offset = params.offset || 0
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching societies:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch societies.',
          },
        },
        { status: 500 }
      )
    }

    // Calculate pagination metadata
    const total = count || 0
    const pagination: PaginationMeta = {
      limit,
      offset,
      total,
      has_more: offset + limit < total,
    }

    // Transform data to API response format
    const societies = (data as SocietyDatabaseRow[]).map(transformToApiResponse)

    return NextResponse.json({
      success: true,
      data: societies,
      meta: {
        pagination,
      },
    })
  } catch (error) {
    console.error('Unexpected error in societies endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred.',
        },
      },
      { status: 500 }
    )
  }
}
