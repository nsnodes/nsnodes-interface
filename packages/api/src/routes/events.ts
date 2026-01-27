/**
 * Events API Route Handler
 *
 * GET /api/v1/events - List events with pagination, filtering, and search
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { validateApiKey } from '../middleware/api-key-auth'
import type {
  ApiResponse,
  ApiErrorResponse,
  EventApiResponse,
  EventsQueryParams,
  EventDatabaseRow,
  PaginationMeta,
} from '../types/api-responses'

const MAX_PER_PAGE = 100
const DEFAULT_PER_PAGE = 20

/**
 * Parse and validate query parameters
 */
function parseQueryParams(request: NextRequest): EventsQueryParams {
  const url = new URL(request.url)

  const page = parseInt(url.searchParams.get('page') || '1', 10)
  const per_page = parseInt(url.searchParams.get('per_page') || String(DEFAULT_PER_PAGE), 10)
  const start_after = url.searchParams.get('start_after') || undefined
  const start_before = url.searchParams.get('start_before') || undefined
  const city = url.searchParams.get('city') || undefined
  const country = url.searchParams.get('country') || undefined
  const source = url.searchParams.get('source') as EventsQueryParams['source'] | null
  const status = url.searchParams.get('status') as EventsQueryParams['status'] | null
  const tags = url.searchParams.get('tags') || undefined
  const search = url.searchParams.get('search') || undefined
  const include_past = url.searchParams.get('include_past') === 'true'
  const sort_by = (url.searchParams.get('sort_by') || 'start_at') as EventsQueryParams['sort_by']
  const sort_order = (url.searchParams.get('sort_order') || 'asc') as EventsQueryParams['sort_order']

  return {
    page: Math.max(1, page),
    per_page: Math.min(MAX_PER_PAGE, Math.max(1, per_page)),
    start_after,
    start_before,
    city,
    country,
    source: source || undefined,
    status: status || undefined,
    tags,
    search,
    include_past,
    sort_by,
    sort_order,
  }
}

/**
 * Parse organizers from database format
 */
function parseOrganizers(organizers: Array<{ name: string }> | string | null): Array<{ name: string }> | null {
  if (!organizers) return null

  if (typeof organizers === 'string') {
    try {
      const parsed = JSON.parse(organizers)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      return null
    }
  }

  if (Array.isArray(organizers)) {
    return organizers
  }

  return null
}

/**
 * Transform database row to API response format
 */
function transformToApiResponse(row: EventDatabaseRow): EventApiResponse {
  return {
    // Use source_url as ID if id column doesn't exist
    id: row.id || row.source_url,
    title: row.title,
    description: row.description,
    start_at: row.start_at,
    end_at: row.end_at,
    timezone: row.timezone,
    location: {
      venue_name: row.venue_name,
      address: row.address,
      city: row.city,
      country: row.country,
      lat: row.lat,
      lng: row.lng,
    },
    source: row.source as EventApiResponse['source'],
    source_url: row.source_url,
    organizers: parseOrganizers(row.organizers),
    tags: row.tags,
    image_url: row.image_url,
    status: row.status as EventApiResponse['status'],
    // Use start_at as fallback for updated_at
    updated_at: row.updated_at || row.start_at,
  }
}

/**
 * Handle GET /api/v1/events
 */
export async function handleGetEvents(
  request: NextRequest
): Promise<NextResponse<ApiResponse<EventApiResponse[]> | ApiErrorResponse>> {
  // Validate API key
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const params = parseQueryParams(request)
    const supabase = createServerClient()

    // Build the query
    // Note: The events table may not have id, created_at, updated_at columns
    // We select only the columns that exist in the table
    let query = supabase
      .from('events')
      .select(
        `
        title,
        description,
        start_at,
        end_at,
        timezone,
        venue_name,
        address,
        city,
        country,
        lat,
        lng,
        source,
        source_url,
        organizers,
        tags,
        image_url,
        status
      `,
        { count: 'exact' }
      )
      // Only return events from known sources
      .in('source', ['luma', 'soladay'])

    // Filter by include_past (default: exclude past events)
    if (!params.include_past) {
      query = query.gte('end_at', new Date().toISOString())
    }

    // Apply date range filters
    if (params.start_after) {
      query = query.gte('start_at', params.start_after)
    }

    if (params.start_before) {
      query = query.lte('start_at', params.start_before)
    }

    // Apply location filters
    if (params.city) {
      query = query.ilike('city', `%${params.city}%`)
    }

    if (params.country) {
      query = query.ilike('country', `%${params.country}%`)
    }

    // Apply source filter
    if (params.source) {
      query = query.eq('source', params.source)
    }

    // Apply status filter
    if (params.status) {
      query = query.eq('status', params.status)
    } else {
      // Default: exclude cancelled events
      query = query.in('status', ['scheduled', 'tentative'])
    }

    // Apply tags filter
    if (params.tags) {
      const tagList = params.tags.split(',').map(t => t.trim())
      query = query.overlaps('tags', tagList)
    }

    // Apply search (searches title and description)
    if (params.search) {
      const searchTerm = `%${params.search}%`
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    }

    // Apply sorting
    const sortColumn = params.sort_by || 'start_at'
    const sortAscending = params.sort_order !== 'desc'
    query = query.order(sortColumn, { ascending: sortAscending })

    // Apply pagination
    const page = params.page || 1
    const perPage = params.per_page || DEFAULT_PER_PAGE
    const offset = (page - 1) * perPage
    query = query.range(offset, offset + perPage - 1)

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch events.',
          },
        },
        { status: 500 }
      )
    }

    // Calculate pagination metadata
    const total = count || 0
    const totalPages = Math.ceil(total / perPage)
    const pagination: PaginationMeta = {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_previous: page > 1,
    }

    // Transform data to API response format
    const events = (data as EventDatabaseRow[]).map(transformToApiResponse)

    return NextResponse.json({
      success: true,
      data: events,
      meta: {
        pagination,
      },
    })
  } catch (error) {
    console.error('Unexpected error in events endpoint:', error)
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
