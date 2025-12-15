import { generatePageMetadata } from '@/lib/utils/metadata';
import GrantsClient from './grants-client';

export const metadata = generatePageMetadata(
  "Network State Grants & Funding Programs",
  "Discover grant programs supporting Network State and Web3 projects. Find funding for your decentralized community or infrastructure project."
);

export default function GrantsPage() {
  return <GrantsClient />;
}
