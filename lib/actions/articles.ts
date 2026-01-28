'use server'

import { createServerClient } from '@/lib/supabase/server'
import { DatabaseArticle, UIArticle } from '@/lib/types/articles'

// Base columns to select for article queries
const ARTICLE_COLUMNS = `
  id,
  slug,
  title,
  subtitle,
  author,
  post_date,
  canonical_url,
  preview_text,
  is_paid
`

/**
 * Detect source platform from URL
 */
function detectSource(url: string): 'substack' | 'paragraph' {
  if (url.includes('paragraph.xyz') || url.includes('paragraph.com')) {
    return 'paragraph'
  }
  return 'substack'
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Truncate preview text to a reasonable length
 */
function truncatePreview(text: string | null, maxLength: number = 200): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Transform a database article to UI format
 */
function transformArticle(dbArticle: DatabaseArticle): UIArticle {
  return {
    id: dbArticle.id,
    slug: dbArticle.slug,
    title: dbArticle.title,
    subtitle: dbArticle.subtitle,
    author: dbArticle.author,
    date: formatDate(dbArticle.post_date),
    url: dbArticle.canonical_url,
    preview: truncatePreview(dbArticle.preview_text),
    isPaid: dbArticle.is_paid,
    source: detectSource(dbArticle.canonical_url)
  }
}

/**
 * Create base query for articles with common filters
 */
function createArticlesQuery(supabase: ReturnType<typeof createServerClient>) {
  return supabase
    .from('substack_posts')
    .select(ARTICLE_COLUMNS)
    .eq('is_ns_relevant', true)
}

/**
 * Fetch articles from Supabase
 */
export async function getArticles(options?: {
  limit?: number
  author?: string
}): Promise<UIArticle[]> {
  const { limit = 50, author } = options ?? {}

  try {
    const supabase = createServerClient()
    let query = createArticlesQuery(supabase)

    if (author) {
      query = query.ilike('author', `%${author}%`)
    }

    const { data, error } = await query
      .order('post_date', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching articles from Supabase:', error)
      return []
    }

    return (data as DatabaseArticle[]).map(transformArticle)
  } catch (error) {
    console.error('Error in getArticles:', error)
    return []
  }
}

/**
 * Get unique authors from the database
 */
export async function getAuthors(): Promise<string[]> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('substack_posts')
      .select('author')
      .eq('is_ns_relevant', true)
      .order('author', { ascending: true })

    if (error) {
      console.error('Error fetching authors:', error)
      return []
    }

    const authors = [...new Set(data.map(d => d.author))].filter(Boolean)
    return authors
  } catch (error) {
    console.error('Error in getAuthors:', error)
    return []
  }
}
