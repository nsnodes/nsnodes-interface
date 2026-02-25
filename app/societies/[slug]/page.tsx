import { getSocieties } from '@/lib/actions/societies';
import { findSocietyBySlug, societyNameToSlug } from '@/lib/utils/slug';
import { generatePageMetadata } from '@/lib/utils/metadata';
import SocietyDetailClient from '@/components/society-detail-client';
import { notFound } from 'next/navigation';
import type { SocietyDatabase } from '@/lib/data/societies-database';

// Mock society data for prototyping when database is unavailable
const MOCK_SOCIETIES: SocietyDatabase[] = [
  {
    name: 'Próspera',
    url: 'https://prospera.hn',
    type: 'Physical',
    tier: 1,
    x: 'https://x.com/ProsperaGlobal',
    discord: 'https://discord.gg/prospera',
    mission: 'Próspera is a platform for good governance, enabling better rules to create better outcomes for residents, businesses, and investors.',
    application: 'https://prospera.hn/apply',
    location: 'Honduras',
    icon: 'https://pbs.twimg.com/profile_images/1747668498948046848/VwBrtTpO_400x400.jpg',
    category: 'Charter City',
    telegram: 'https://t.me/prospera',
    founded: '2020',
    scalability: 72,
    autonomy: 91,
    qol: 78,
    belonging: 65,
    economic: 88,
    purpose: 83,
  },
  {
    name: 'Praxis',
    url: 'https://www.praxissociety.com',
    type: 'Physical',
    tier: 1,
    x: 'https://x.com/praboreal',
    discord: 'https://discord.gg/praxis',
    mission: 'Building a new city to solve the decline of Western civilization.',
    application: 'https://www.praxissociety.com/apply',
    location: 'Mediterranean',
    category: 'Network State',
    founded: '2019',
  },
  {
    name: 'Vitalia',
    url: 'https://vitalia.city',
    type: 'Physical',
    tier: 2,
    x: 'https://x.com/VitaliaCity',
    discord: '',
    mission: 'A special economic zone focused on longevity science and biotech.',
    application: 'https://vitalia.city/apply',
    location: 'Próspera, Honduras',
    category: 'Popup City',
    founded: '2023',
  },
  {
    name: 'Edge City',
    url: 'https://www.edgecity.live',
    type: 'Physical',
    tier: 2,
    x: 'https://x.com/edaboreal',
    discord: '',
    mission: 'Pop-up cities for human flourishing at the frontier of tech, science, and society.',
    application: '',
    location: 'Global',
    category: 'Popup City',
    founded: '2023',
  },
  {
    name: 'Zuzalu',
    url: 'https://zuzalu.city',
    type: 'Physical',
    tier: 2,
    x: 'https://x.com/zaboreal',
    discord: '',
    mission: 'A first-of-its-kind pop-up city community in Montenegro.',
    application: '',
    location: 'Global',
    category: 'Popup City',
    founded: '2023',
  },
  {
    name: 'Network School',
    url: 'https://thenetworkschool.com',
    type: 'Physical',
    tier: 1,
    x: 'https://x.com/TheNetworkSchol',
    discord: '',
    mission: 'A school for the network state movement.',
    application: 'https://thenetworkschool.com/apply',
    location: 'Global',
    category: 'Network State',
    founded: '2023',
  },
];

export async function generateStaticParams() {
  // Try database first, fall back to mock data
  const societies = await getSocieties();
  const data = societies.length > 0 ? societies : MOCK_SOCIETIES;
  return data
    .filter(s => s.tier >= 1 && s.tier <= 3)
    .map(s => ({ slug: societyNameToSlug(s.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const societies = await getSocieties();
  const data = societies.length > 0 ? societies : MOCK_SOCIETIES;
  const society = findSocietyBySlug(slug, data);

  if (!society) {
    return generatePageMetadata('Society Not Found');
  }

  return generatePageMetadata(
    society.name,
    society.mission || `Explore ${society.name} - ${society.type} network state society.`
  );
}

export default async function SocietyDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const societies = await getSocieties();
  const data = societies.length > 0 ? societies : MOCK_SOCIETIES;
  const society = findSocietyBySlug(slug, data);

  if (!society || society.tier < 1 || society.tier > 3) {
    notFound();
  }

  // Get related societies: same type, prioritizing same tier
  const sameTypeSameTier = data.filter(
    s => s.tier >= 1 && s.tier <= 3 && s.name !== society.name && s.type === society.type && s.tier === society.tier
  );

  const sameTypeOtherTier = data.filter(
    s => s.tier >= 1 && s.tier <= 3 && s.name !== society.name && s.type === society.type && s.tier !== society.tier
  );

  const relatedSocieties = [...sameTypeSameTier, ...sameTypeOtherTier].slice(0, 6);

  return (
    <SocietyDetailClient
      society={society}
      relatedSocieties={relatedSocieties}
    />
  );
}
