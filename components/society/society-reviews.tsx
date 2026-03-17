'use client';

import { Quote } from 'lucide-react';
import { societyNameToSlug } from '@/lib/utils/slug';

interface Review {
  quote: string;
  author: string;
  role: string;
}

const SOCIETY_REVIEWS: Record<string, Review[]> = {
  'network-school': [
    { quote: 'It\'s gritty AND pretty. Perfect place for founders to camp out and find product market fit with other founders.', author: 'Jason Calacanis', role: 'Entrepreneur and Investor' },
    { quote: 'Its intent is to build this society, the bootstrapping-other-societies society. NS is a well-run, intellectually rich experiment in bootstrapping startup societies.', author: 'Tanner Gesek', role: 'NS Attendee' },
    { quote: 'The monthly fee of $1,500 provides premium yet practical accommodations. The food helps maintain a health-oriented lifestyle.', author: 'Danny Castonguay', role: 'NS Attendee' },
    { quote: 'July 2025\'s cohort featured 100+ people, mainly from India or the US. Male-to-female ratio was about 80:20 and the majority were in their 20s.', author: 'Sitesh Shrivastava', role: 'Founder and NS Attendee' },
  ],
};

interface SocietyReviewsProps {
  societyName: string;
}

export function SocietyReviews({ societyName }: SocietyReviewsProps) {
  const reviews = SOCIETY_REVIEWS[societyNameToSlug(societyName)];
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono font-bold text-sm">[ REVIEWS ]</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, i) => (
            <div key={i} className="border-2 border-border p-4 bg-background space-y-3">
              <Quote className="h-4 w-4 text-muted-foreground opacity-40" />
              <p className="text-sm font-mono text-muted-foreground leading-relaxed italic">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="pt-2 border-t border-border">
                <div className="text-xs font-mono font-bold">{review.author}</div>
                <div className="text-xs font-mono text-muted-foreground">{review.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
