import { generatePageMetadata } from '@/lib/utils/metadata';
import VCClient from './vc-client';

export const metadata = generatePageMetadata(
  "Network State Venture Capital Directory",
  "The VCs funding the Network State revolution. These firms back crypto infrastructure, decentralized governance, and the future of coordination."
);

export default function VCPage() {
  return <VCClient />;
}
