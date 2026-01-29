/**
 * API Key Authentication Middleware
 *
 * Validates requests using either:
 * - Authorization: Bearer <key>
 * - X-API-Key: <key>
 *
 * API keys are stored in the API_KEYS environment variable as comma-separated values.
 */

import { NextRequest, NextResponse } from 'next/server'
import type { ApiErrorResponse } from '../types/api-responses'

/**
 * Extract API key from request headers
 */
function extractApiKey(request: NextRequest): string | null {
  // Check Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  // Fallback to X-API-Key header
  const apiKeyHeader = request.headers.get('x-api-key')
  if (apiKeyHeader) {
    return apiKeyHeader
  }

  return null
}

/**
 * Validate API key against stored keys
 */
function isValidApiKey(key: string): boolean {
  const apiKeys = process.env.API_KEYS
  if (!apiKeys) {
    console.error('API_KEYS environment variable not configured')
    return false
  }

  const validKeys = apiKeys.split(',').map(k => k.trim())
  return validKeys.includes(key)
}

/**
 * Create unauthorized error response
 */
function unauthorizedResponse(message: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message,
      },
    },
    { status: 401 }
  )
}

/**
 * Middleware to validate API key authentication
 *
 * Usage in route handler:
 * ```ts
 * import { validateApiKey } from '@/packages/api/src/middleware/api-key-auth'
 *
 * export async function GET(request: NextRequest) {
 *   const authError = validateApiKey(request)
 *   if (authError) return authError
 *   // ... handle request
 * }
 * ```
 */
export function validateApiKey(request: NextRequest): NextResponse<ApiErrorResponse> | null {
  const apiKey = extractApiKey(request)

  if (!apiKey) {
    return unauthorizedResponse('API key required. Provide via Authorization: Bearer <key> or X-API-Key header.')
  }

  if (!isValidApiKey(apiKey)) {
    return unauthorizedResponse('Invalid API key.')
  }

  return null
}

