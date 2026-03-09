import { Suspense } from 'react';
import { generatePageMetadata } from '@/lib/utils/metadata';
import JobsClient from './jobs-client';

export const metadata = generatePageMetadata(
  "Network State Jobs & Work Opportunities",
  "Find job opportunities in the emerging Network State ecosystem. Remote as well as on-site opportunities are available."
);

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsClient />
    </Suspense>
  );
}
