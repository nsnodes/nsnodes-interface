import { generatePageMetadata } from '@/lib/utils/metadata';
import EventsClient from './events-client';

export const metadata = generatePageMetadata(
  "Network State Events & Meetups Calendar",
  "Discover upcoming events across the Network State ecosystem. From conferences and workshops to meetups and social gatherings, find where the community is gathering next."
);

export default function EventsPage() {
  return <EventsClient />;
}
