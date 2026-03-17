'use client';

import Link from 'next/link';
import type { SocietyDatabase } from '@/lib/data/societies-database';
import { SocietyLogo } from './society-logo';
import { societyNameToSlug } from '@/lib/utils/slug';

interface SocietyRelatedProps {
  societies: SocietyDatabase[];
}

export function SocietyRelated({ societies }: SocietyRelatedProps) {
  if (societies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold font-mono">[ RELATED SOCIETIES ]</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {societies.map((society, index) => (
          <Link
            key={index}
            href={`/societies/${societyNameToSlug(society.name)}`}
            className="border-2 border-border p-4 bg-card hover:bg-accent transition-colors shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <div className="flex items-start gap-3">
              <SocietyLogo name={society.name} icon={society.icon} size="sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-mono font-bold text-sm">{society.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs font-mono px-1.5 py-0.5 border border-border bg-muted whitespace-nowrap">
                    {society.type}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
