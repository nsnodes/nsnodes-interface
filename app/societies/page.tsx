import { getSocieties } from '@/lib/actions/societies';
import SocietiesPageClient from '@/components/societies-page-client';
import { generatePageMetadata } from '@/lib/utils/metadata';

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("Network State Dashboard & Societies List");

export default async function SocietiesPage() {
  // Fetch societies from Supabase
  const societies = await getSocieties();

  return <SocietiesPageClient societies={societies} />;
}
