import { generatePageMetadata } from '@/lib/utils/metadata';
import EdgeClient from './edge-client';

export const metadata = generatePageMetadata(
  "Edge Esmeralda Events",
  "Events and activities at Edge Esmeralda in Patagonia. Join the Network State community building at the edge of the world."
);

export default function EdgePage() {
  return <EdgeClient />;
}
