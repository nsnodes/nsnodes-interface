'use client';

import { useState } from 'react';
import { deleteKidsSubmission } from '@/lib/actions/kids';
import type { KidsSubmission } from '@/lib/types/kids';

interface KidsTimelineProps {
  submissions: KidsSubmission[];
  onDelete: () => void;
}

// Color palette for submissions
const COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
];

export function KidsTimeline({ submissions, onDelete }: KidsTimelineProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate timeline months (12 months from today)
  const today = new Date();
  const months: Date[] = [];
  for (let i = 0; i < 12; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push(month);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteKidsSubmission(id);
      onDelete();
    } catch (err) {
      alert('Failed to delete submission');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Helper to calculate position and width for timeline bar
  const getBarStyle = (submission: KidsSubmission) => {
    const timelineStart = months[0];
    const timelineEnd = new Date(months[11].getFullYear(), months[11].getMonth() + 1, 0);

    const submissionStart = submission.startDate > timelineStart ? submission.startDate : timelineStart;
    const submissionEnd = submission.endDate < timelineEnd ? submission.endDate : timelineEnd;

    // Calculate position as percentage
    const totalDays = (timelineEnd.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (submissionStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (submissionEnd.getTime() - submissionStart.getTime()) / (1000 * 60 * 60 * 24);

    const left = (startOffset / totalDays) * 100;
    const width = (duration / totalDays) * 100;

    return { left: `${left}%`, width: `${width}%` };
  };

  // Format kids ages
  const formatKids = (submission: KidsSubmission) => {
    const kids: Array<{ num: number; age?: number }> = [];
    if (submission.kid1Age !== undefined) kids.push({ num: 1, age: submission.kid1Age });
    else kids.push({ num: 1 });

    if (submission.kid2Age !== undefined) kids.push({ num: 2, age: submission.kid2Age });
    if (submission.kid3Age !== undefined) kids.push({ num: 3, age: submission.kid3Age });
    if (submission.kid4Age !== undefined) kids.push({ num: 4, age: submission.kid4Age });

    // Check if we have any ages at all
    const hasAnyAge = kids.some(k => k.age !== undefined);

    if (!hasAnyAge) {
      // No ages provided, just show "Kid 1", "Kid 2", etc.
      return kids.map(k => `Kid ${k.num}`).join(', ');
    }

    // Show with ages when provided
    const ageStrings = kids.map(k => {
      if (k.age === undefined) return `Kid ${k.num}`;
      return `Kid ${k.num} (${k.age} ${k.age === 1 ? 'year' : 'years'})`;
    });

    return ageStrings.join(', ');
  };

  // Format date range
  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  if (submissions.length === 0) {
    return (
      <div className="border-2 border-border bg-card p-8 text-center">
        <p className="text-lg font-mono">No stays scheduled yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
      {/* Timeline Header */}
      <div className="border-b-2 border-border p-4 bg-card">
        <h2 className="text-xl sm:text-2xl font-bold font-mono">[ UPCOMING STAYS TIMELINE ]</h2>
        <p className="text-sm font-mono text-muted-foreground mt-1">Next 12 months</p>
      </div>

      {/* Desktop Timeline View */}
      <div className="hidden lg:block overflow-x-auto">
        {/* Month Headers */}
        <div className="flex border-b-2 border-border bg-muted/50">
          <div className="w-64 flex-shrink-0 border-r-2 border-border p-2 font-mono font-medium">
            Details
          </div>
          <div className="flex-1 flex">
            {months.map((month, idx) => (
              <div
                key={idx}
                className="flex-1 p-2 text-center text-sm font-mono font-medium border-r-2 border-border last:border-r-0"
              >
                {getMonthName(month)}
              </div>
            ))}
          </div>
        </div>

        {/* Submissions */}
        {submissions.map((submission, idx) => (
          <div
            key={submission.id}
            className="flex border-b-2 border-border last:border-b-0 hover:bg-muted/50"
          >
            {/* Details Column */}
            <div className="w-64 flex-shrink-0 border-r-2 border-border p-3 bg-card">
              <div className="space-y-1 text-sm font-mono">
                <div className="font-medium">{formatKids(submission)}</div>
                <div className="text-xs text-muted-foreground">{formatDateRange(submission.startDate, submission.endDate)}</div>
                <div className="text-xs text-muted-foreground">
                  Parents: {submission.parent1Discord}
                  {submission.parent2Discord && `, ${submission.parent2Discord}`}
                </div>
                <button
                  onClick={() => handleDelete(submission.id)}
                  disabled={deletingId === submission.id}
                  className="text-xs px-2 py-1 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 font-mono mt-2"
                >
                  {deletingId === submission.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Timeline Bar */}
            <div className="flex-1 relative p-3 bg-background">
              <div
                className={`absolute top-1/2 -translate-y-1/2 h-8 ${COLORS[idx % COLORS.length]} opacity-80 hover:opacity-100 transition-opacity rounded border-2 border-border`}
                style={getBarStyle(submission)}
                title={`${formatKids(submission)}: ${formatDateRange(submission.startDate, submission.endDate)}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y-2 divide-border">
        {submissions.map((submission, idx) => (
          <div key={submission.id} className="p-4 bg-card">
            <div className="flex items-start justify-between mb-3">
              <div className="font-mono">
                <div className="font-medium">{formatKids(submission)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatDateRange(submission.startDate, submission.endDate)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(submission.id)}
                disabled={deletingId === submission.id}
                className="text-xs px-2 py-1 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 font-mono"
              >
                {deletingId === submission.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            <div className="text-sm text-muted-foreground font-mono mb-3">
              Parents: {submission.parent1Discord}
              {submission.parent2Discord && `, ${submission.parent2Discord}`}
            </div>

            {/* Visual timeline bar for mobile */}
            <div className="relative h-8 bg-muted rounded overflow-hidden border-2 border-border">
              <div
                className={`absolute inset-y-0 ${COLORS[idx % COLORS.length]} opacity-80`}
                style={getBarStyle(submission)}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
              <span>{getMonthName(months[0])}</span>
              <span>{getMonthName(months[11])}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
