'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar } from 'lucide-react';
import { KidsPasswordGate } from '@/components/kids-password-gate';
import { KidsSubmissionForm } from '@/components/kids-submission-form';
import { KidsTimeline } from '@/components/kids-timeline';
import { getKidsSubmissions } from '@/lib/actions/kids';
import type { KidsSubmission } from '@/lib/types/kids';

export default function NSKidsPage() {
  const [submissions, setSubmissions] = useState<KidsSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getKidsSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleSubmitSuccess = () => {
    loadSubmissions();
  };

  const handleDelete = () => {
    loadSubmissions();
  };

  return (
    <KidsPasswordGate>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left side - Content */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono flex items-center gap-3">
              <Users className="h-8 w-8" />
              [ NS KIDS ]
            </h1>
            <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl">
              Track when families with kids are staying at Network School.
            </p>
          </div>

          {/* Right side - Stats */}
          {!isLoading && !error && (
            <div className="lg:w-80">
              <div className="border-2 border-border bg-card p-6">
                <div className="space-y-2">
                  {/* Total Families */}
                  <div className="border-2 border-border p-3 text-center bg-background">
                    <div className="flex justify-center mb-1">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="text-xl font-bold font-mono mb-0.5">
                      {submissions.length}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      UPCOMING STAYS
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Submission Form */}
        <KidsSubmissionForm onSubmitSuccess={handleSubmitSuccess} />

        {/* Timeline View */}
        {isLoading ? (
          <div className="border-2 border-border bg-card p-8 text-center">
            <p className="text-lg font-mono animate-pulse">Loading stays...</p>
          </div>
        ) : error ? (
          <div className="border-2 border-border bg-card p-8 text-center space-y-4">
            <p className="text-lg font-mono text-destructive">{error}</p>
            <button
              onClick={loadSubmissions}
              className="px-6 py-3 border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              [ RETRY ]
            </button>
          </div>
        ) : (
          <KidsTimeline submissions={submissions} onDelete={handleDelete} />
        )}

        {/* Footer Info */}
        <section className="border-2 border-border p-6 bg-card/50 text-center space-y-2">
          <p className="text-sm font-mono text-muted-foreground">
            <strong>Note:</strong> This page is private and hidden from search engines.
            All submissions are visible to everyone with access to this page.
            Please do not enter private or sensitive details.
          </p>
        </section>
      </div>
    </KidsPasswordGate>
  );
}
