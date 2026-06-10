'use server'

import { createServerClient } from '@/lib/supabase/server'
import { DatabaseArticle, UIArticle } from '@/lib/types/articles'
import { fallbackEcosystemArticles } from '@/lib/data/ecosystem-articles'

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
  is_paid,
  is_ns_relevant
`

const ECOSYSTEM_AUTHORS = [
  'Peerbase',
  'Isa (Utopia in Beta)',
  'Metagov News',
  'Elle Griffin',
  'Free Cities',
  'Niklas Anzinger (Infinita City Times)',
  'Parallel Citizen',
  'Timour Kosters (At the Edges)',
  'Michel (4th Generation Civilization)',
  'Growing the Commons',
  'Traditional Dream Factory',
  'Seasteading Institute',
  'Protocolized',
  'Agartha.One',
  'Gen (Start of Something New)',
  'Olivier Roland (Disruptive Horizons)',
  'Zach.dev (Startup Cities)',
  'Kiba Gateaux (Nuo Nation)',
  'Underthrow',
  'The Palladium Letter',
]

const RELEVANCE_STALE_AFTER_DAYS = 21

/**
 * Detect source platform from URL
 */
function detectSource(url: string, author: string): UIArticle['source'] {
  if (url.includes('paragraph.xyz') || url.includes('paragraph.com')) {
    return 'paragraph'
  }
  if (url.includes('medium.com') || author.toLowerCase().includes('(medium)')) {
    return 'medium'
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
    source: detectSource(dbArticle.canonical_url, dbArticle.author)
  }
}

function getPostTime(article: DatabaseArticle): number {
  return new Date(article.post_date).getTime()
}

function isRelevantFeedStale(articles: DatabaseArticle[]): boolean {
  if (articles.length === 0) return true

  const newestTime = Math.max(...articles.map(getPostTime).filter(Number.isFinite))
  if (!Number.isFinite(newestTime)) return true

  const ageMs = Date.now() - newestTime
  return ageMs > RELEVANCE_STALE_AFTER_DAYS * 24 * 60 * 60 * 1000
}

function mergeArticles(
  relevantArticles: DatabaseArticle[],
  supplementalArticles: DatabaseArticle[],
  limit: number
): DatabaseArticle[] {
  const byUrl = new Map<string, DatabaseArticle>()

  for (const article of [...supplementalArticles, ...relevantArticles]) {
    byUrl.set(article.canonical_url || String(article.id), article)
  }

  return [...byUrl.values()]
    .sort((a, b) => getPostTime(b) - getPostTime(a))
    .slice(0, limit)
}

function fallbackArticles(limit: number, author?: string): UIArticle[] {
  const rows = author
    ? fallbackEcosystemArticles.filter((article) =>
        article.author.toLowerCase().includes(author.toLowerCase())
      )
    : fallbackEcosystemArticles

  return rows.slice(0, limit).map(transformArticle)
}

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
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
    if (!hasSupabaseEnv()) {
      return fallbackArticles(limit, author)
    }

    const supabase = createServerClient()
    let relevantQuery = createArticlesQuery(supabase)

    if (author) {
      relevantQuery = relevantQuery.ilike('author', `%${author}%`)
    }

    const { data: relevantData, error: relevantError } = await relevantQuery
      .order('post_date', { ascending: false })
      .limit(limit)

    if (relevantError) {
      console.error('Error fetching relevant articles from Supabase:', relevantError)
      return fallbackArticles(limit, author)
    }

    const relevantArticles = (relevantData ?? []) as DatabaseArticle[]
    if (author || !isRelevantFeedStale(relevantArticles)) {
      return relevantArticles.map(transformArticle)
    }

    const { data: supplementalData, error: supplementalError } = await supabase
      .from('substack_posts')
      .select(ARTICLE_COLUMNS)
      .is('is_ns_relevant', null)
      .in('author', ECOSYSTEM_AUTHORS)
      .order('post_date', { ascending: false })
      .limit(Math.max(limit * 3, 24))

    if (supplementalError) {
      console.error('Error fetching supplemental ecosystem articles from Supabase:', supplementalError)
      return relevantArticles.length > 0
        ? relevantArticles.map(transformArticle)
        : fallbackArticles(limit, author)
    }

    return mergeArticles(
      relevantArticles,
      (supplementalData ?? []) as DatabaseArticle[],
      limit
    ).map(transformArticle)
  } catch (error) {
    console.error('Error in getArticles:', error)
    return fallbackArticles(limit, author)
  }
}

/**
 * Get unique authors from the database
 */
export async function getAuthors(): Promise<string[]> {
  try {
    if (!hasSupabaseEnv()) {
      return [...new Set(fallbackEcosystemArticles.map((article) => article.author))]
    }

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
