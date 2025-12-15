import { generatePageMetadata } from '@/lib/utils/metadata';
import FundingClient from './funding-client';

export const metadata = generatePageMetadata(
  "Network State Funding & Capital Opportunities",
  "Explore funding opportunities for Network State projects. Connect with VCs and grant programs supporting the ecosystem."
);

export default function FundingPage() {
  return <FundingClient />;
}
