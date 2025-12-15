import { generatePageMetadata } from '@/lib/utils/metadata';
import VCClient from './vc-client';

export const metadata = generatePageMetadata(
  "Venture Capital Directory",
  "Comprehensive directory of VCs investing in Network States, crypto, and decentralized communities. Find the right investors for your project."
);

export default function VCDirectoryPage() {
  return <VCClient />;
}
