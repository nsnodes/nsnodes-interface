import { getCommandmentsByPopularity } from '@/lib/data/corecommand-database';
import CoreCommandPageClient from '@/components/corecommand-page-client';
import { generatePageMetadata } from '@/lib/utils/metadata';

// Static page title
export const metadata = generatePageMetadata("Core Commandments - Moral Innovations");

export default async function CoreCommandPage() {
  // Fetch commandments from mock database (sorted by popularity)
  const commandments = getCommandmentsByPopularity();

  return <CoreCommandPageClient commandments={commandments} />;
}
