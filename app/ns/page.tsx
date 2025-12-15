import { generatePageMetadata } from '@/lib/utils/metadata';
import NSClient from './ns-client';

export const metadata = generatePageMetadata(
  "Network School Events",
  "Events and programming from Network School. Learn, build, and connect with the Network State community."
);

export default function NSPage() {
  return <NSClient />;
}
