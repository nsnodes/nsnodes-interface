import { generatePageMetadata } from '@/lib/utils/metadata';
import ContentClient from './content-client';

export const metadata = generatePageMetadata(
  "Network State Content Creators & Thinkers",
  "Follow the thought leaders, podcasters, and content creators shaping the Network State movement. Learn from the voices building the future."
);

export default function ContentPage() {
  return <ContentClient />;
}
