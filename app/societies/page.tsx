import { getSocieties } from '@/lib/actions/societies';
import SocietiesPageClient from '@/components/societies-page-client';

export default async function SocietiesPage() {
  // Fetch societies from Airtable (with fallback to hardcoded data)
  const societies = await getSocieties();

  return <SocietiesPageClient societies={societies} />;
}
