import { getSocieties } from '@/lib/actions/societies';
import { findSocietyBySlug, societyNameToSlug } from '@/lib/utils/slug';
import SocietyDetailClient from '@/components/society-detail-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { SocietyDatabase } from '@/lib/data/societies-database';
import { jobsDatabase } from '@/lib/data/jobs-database';
import { societyNamesMatch } from '@/lib/utils/society-matcher';
import { getEvents } from '@/lib/actions/events';
import { getSocietyRadarScores } from '@/lib/actions/societies-radar';
import { SOCIETY_CONTENT } from '@/components/society/society-content';

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
    x: 'https://x.com/balajis',
    discord: 'https://discord.gg/networkschool',
    telegram: 'https://t.me/nsdotcom',
    mission: 'A school for the network state movement.',
    application: 'https://thenetworkschool.com/apply',
    location: 'Global',
    category: 'Network State',
    founded: '2023',
    x_followers: 1300000,
    discord_members: 2763,
    youtube: 'https://www.youtube.com/@nspodcast',
    youtube_subscribers: 32000,
    telegram_members: 846,
  },
];

export async function generateStaticParams() {
  // Try database first, fall back to mock data
  const societies = await getSocieties();
  const data = societies.length > 0 ? societies : MOCK_SOCIETIES;
  return data
    .filter(s => s.tier >= 1 && s.tier <= 5)
    .map(s => ({ slug: societyNameToSlug(s.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const societies = await getSocieties();
  const data = societies.length > 0 ? societies : MOCK_SOCIETIES;
  const society = findSocietyBySlug(slug, data);

  if (!society) {
    return { title: 'Society Not Found | nsnodes.com' };
  }

  const content = SOCIETY_CONTENT[societyNameToSlug(society.name)];
  const pageUrl = `https://nsnodes.com/societies/${slug}`;

  // Build a rich description from content if available
  const overviewText = content?.overview?.[0]?.text;
  const description = overviewText
    ? overviewText.slice(0, 155) + (overviewText.length > 155 ? '...' : '')
    : society.mission || `Explore ${society.name} — a ${society.type?.toLowerCase()} network state society.`;

  const TITLE_OVERRIDES: Record<string, string> = {
    'network-school': 'Network School — Balaji ns.com Network State | nsnodes.com',
  };

  const title = TITLE_OVERRIDES[slug] ?? `${society.name} — ${society.category || 'Network Society'} | nsnodes.com`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'NSNodes',
      images: [
        {
          url: society.icon || '/featured-image.png',
          width: 400,
          height: 400,
          alt: society.name,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [society.icon || '/featured-image.png'],
    },
  };
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

  if (!society || society.tier < 1 || society.tier > 5) {
    notFound();
  }

  // Get related societies: same type, prioritizing same tier
  const sameTypeSameTier = data.filter(
    s => s.tier >= 1 && s.tier <= 5 && s.name !== society.name && s.type === society.type && s.tier === society.tier
  );

  const sameTypeOtherTier = data.filter(
    s => s.tier >= 1 && s.tier <= 5 && s.name !== society.name && s.type === society.type && s.tier !== society.tier
  );

  const relatedSocieties = [...sameTypeSameTier, ...sameTypeOtherTier].slice(0, 6);

  // Filter jobs for this society
  const jobs = jobsDatabase.filter(job => societyNamesMatch(job.company, society.name));

  // Fetch and filter events for this society
  const [allEvents, radarScores] = await Promise.all([
    getEvents(),
    getSocietyRadarScores(society.name),
  ]);
  const events = allEvents.filter(e => societyNamesMatch(e.networkState, society.name));

  // Convert radar scores to array format for the radar component
  const radarScoresArray = radarScores
    ? [radarScores.scalability, radarScores.autonomy, radarScores.qol, radarScores.belonging, radarScores.purpose, radarScores.economic]
    : null;

  // Build JSON-LD structured data
  const content = SOCIETY_CONTENT[slug];
  const jsonLd: Record<string, unknown>[] = [];

  // Organization schema
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: society.name,
    url: society.url || `https://nsnodes.com/societies/${slug}`,
    description: society.mission,
    ...(society.icon && { logo: society.icon }),
    ...(society.founded && { foundingDate: society.founded }),
    ...(society.location && { location: { '@type': 'Place', name: society.location } }),
  });

  // FAQPage schema from content FAQs
  if (content?.faqs?.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          // Strip markdown link syntax for clean plain text
          text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'),
        },
      })),
    });
  }

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <SocietyDetailClient
        society={society}
        relatedSocieties={relatedSocieties}
        jobs={jobs}
        events={events}
        radarScores={radarScoresArray}
      />
    </>
  );
}
