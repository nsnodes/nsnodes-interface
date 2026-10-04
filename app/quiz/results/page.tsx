import type { Metadata } from 'next';
import { getQuizResults } from '@/lib/actions/quiz';
import { QuizResultsClient } from '@/components/quiz/quiz-results-client';

export const metadata: Metadata = {
  // Hidden while the team reviews it: reachable by link only
  robots: { index: false, follow: false },
  title: 'Live Quiz Results | nsnodes.com',
  description:
    'Live results of the nsnodes network state quiz: what the community knows, and how its ratings move each project on the six radar metrics in real time.',
};

export const dynamic = 'force-dynamic';

export default async function QuizResultsPage() {
  const initial = await getQuizResults();
  return <QuizResultsClient initial={initial} />;
}
