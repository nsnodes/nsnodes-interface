// Type definitions for articles from Supabase (substack_posts table)

export interface DatabaseArticle {
  id: number
  slug: string
  title: string
  subtitle: string | null
  author: string
  post_date: string // ISO timestamp
  canonical_url: string
  preview_text: string | null
  is_paid: boolean
  fetched_at: string // ISO timestamp
  content: string | null // HTML content (optional for list views)
}

// Type for the transformed article used in the UI
export interface UIArticle {
  id: number
  slug: string
  title: string
  subtitle: string | null
  author: string
  date: string // Formatted date
  url: string
  preview: string
  isPaid: boolean
  source: 'substack' | 'paragraph'
}
