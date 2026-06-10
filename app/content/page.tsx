import { generatePageMetadata } from '@/lib/utils/metadata';
import { getArticles } from '@/lib/actions/articles';
import { getSubstackPosts } from '@/lib/actions/substack';
import ContentClient from './content-client';

export const metadata = generatePageMetadata(
  "NSNodes Readings & Nodes Digest",
  "Read the latest Nodes Digest, browse core network-state resources, and follow the people shaping startup societies, popup cities, and new governance experiments."
);

export default async function ContentPage() {
  const [substackPosts, ecosystemArticles] = await Promise.all([
    getSubstackPosts(12),
    getArticles({ limit: 8 }),
  ]);

  return (
    <ContentClient
      substackPosts={substackPosts}
      ecosystemArticles={ecosystemArticles}
    />
  );
}
