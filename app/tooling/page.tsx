import { generatePageMetadata } from '@/lib/utils/metadata';
import ToolingClient from './tooling-client';

export const metadata = generatePageMetadata(
  "Network State Tooling & Open Source Projects",
  "Discover tools, frameworks, and resources for building Network States. From governance platforms to coordination tools."
);

export default function ToolingPage() {
  return <ToolingClient />;
}
