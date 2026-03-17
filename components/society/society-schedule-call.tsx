import { Video } from 'lucide-react';

interface SocietyScheduleCallProps {
  url: string;
  description?: string;
  topics?: string[];
}

export function SocietyScheduleCall({ url, description, topics }: SocietyScheduleCallProps) {
  return (
    <div className="border-2 border-border p-6 bg-card shadow-brutal-md">
      <h2 className="font-mono font-bold text-sm uppercase mb-4">[ Schedule a Call With Nsnodes Team ]</h2>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      )}
      {topics && topics.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-mono font-bold mb-2">Things we can answer:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2">
                <span className="text-muted-foreground/60 select-none">-</span>
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm font-bold shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        <Video className="h-4 w-4" />
        Book a Call
      </a>
    </div>
  );
}
