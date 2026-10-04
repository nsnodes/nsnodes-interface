import type { Metadata } from 'next';
import { getQuizSocieties } from '@/lib/actions/quiz';
import { QuizClient } from '@/components/quiz/quiz-client';

export const metadata: Metadata = {
  // Hidden while the team reviews it: reachable by link only
  robots: { index: false, follow: false },
  title: 'Network State Quiz | nsnodes.com',
  description:
    'Test your network state knowledge, then rate the projects you know on belonging, autonomy, purpose and more. Your ratings shape the community radar.',
};

export const revalidate = 3600;

export default async function QuizPage() {
  const societies = await getQuizSocieties();
  return <QuizClient societies={societies} />;
}
