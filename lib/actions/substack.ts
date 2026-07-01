'use server'

import type { SubstackPost } from "@/lib/types/content-hub";

const ARCHIVE_URL =
  "https://nsnodes.substack.com/api/v1/archive?sort=new&search=&offset=0&limit=";

interface SubstackArchivePost {
  id?: number;
  title?: string;
  subtitle?: string | null;
  description?: string | null;
  canonical_url?: string;
  cover_image?: string | null;
  post_date?: string;
  wordcount?: number | null;
  postTags?: Array<{ name?: string }>;
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatShortDate(dateString?: string): string {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recent";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getIssueNumber(title?: string): number | null {
  if (!title) return null;
  const match = title.match(/#\s?(\d+)/);
  return match ? Number(match[1]) : null;
}

function getReadTime(wordCount?: number | null): string {
  if (!wordCount) return "Read";
  return `${Math.max(2, Math.round(wordCount / 225))} min`;
}

function normalizePost(post: SubstackArchivePost): SubstackPost | null {
  if (!post.id || !post.title || !post.canonical_url) return null;

  const subtitle = post.subtitle || post.description || "";

  return {
    id: post.id,
    issueNumber: getIssueNumber(post.title),
    title: post.title,
    subtitle,
    url: post.canonical_url,
    coverImage: post.cover_image ?? null,
    date: formatDate(post.post_date),
    shortDate: formatShortDate(post.post_date),
    readTime: getReadTime(post.wordcount),
    wordCount: post.wordcount ?? 0,
    tags: (post.postTags ?? [])
      .map((tag) => tag.name)
      .filter((name): name is string => Boolean(name))
      .slice(0, 4),
  };
}

export async function getSubstackPosts(limit = 10): Promise<SubstackPost[]> {
  try {
    const response = await fetch(`${ARCHIVE_URL}${limit}`, {
      next: { revalidate: 900 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Substack archive fetch failed:", response.status);
      return [];
    }

    const posts = (await response.json()) as SubstackArchivePost[];
    return posts.map(normalizePost).filter((post): post is SubstackPost => Boolean(post));
  } catch (error) {
    console.error("Error fetching NSNodes Substack posts:", error);
    return [];
  }
}
