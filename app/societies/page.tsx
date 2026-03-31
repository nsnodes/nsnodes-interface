import { getSocieties } from '@/lib/actions/societies';
import { getAllCommunityScores } from '@/lib/actions/societies-radar';
import SocietiesPageClient from '@/components/societies-page-client';
import { generatePageMetadata } from '@/lib/utils/metadata';

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("Network State Dashboard & Societies List");

export default async function SocietiesPage() {
  // Fetch societies and community scores from Supabase
  const [societies, communityScores] = await Promise.all([
    getSocieties(),
    getAllCommunityScores(),
  ]);

  return <SocietiesPageClient societies={societies} communityScores={communityScores} />;
}
