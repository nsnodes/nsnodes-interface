import { Briefcase, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Job } from '@/lib/data/jobs-database';

interface SocietyJobsProps {
  jobs: Job[];
  societyName: string;
}

export function SocietyJobs({ jobs, societyName }: SocietyJobsProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono font-bold text-sm flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          [ OPEN POSITIONS ] ({jobs.length})
        </h2>
      </div>
      <div className="divide-y divide-border">
        {jobs.map((job, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <h3 className="font-mono font-bold text-sm">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="text-border">|</span>
                  <span>{job.type}</span>
                  {job.salary && (
                    <>
                      <span className="text-border">|</span>
                      <span>{job.salary}</span>
                    </>
                  )}
                </div>
              </div>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 border-2 border-border bg-background hover:bg-accent transition-colors text-xs font-mono shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex-shrink-0 self-start"
              >
                Apply
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs font-mono text-muted-foreground leading-relaxed line-clamp-2">
              {job.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 4).map((tag, j) => (
                <span key={j} className="px-2 py-0.5 text-[10px] font-mono border border-border bg-muted">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Link
          href={`/jobs?employer=${encodeURIComponent(societyName)}`}
          className="block text-center text-xs font-mono text-primary hover:underline"
        >
          View all positions on Jobs page →
        </Link>
      </div>
    </div>
  );
}
