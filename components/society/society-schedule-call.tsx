import Image from 'next/image';
import { Video } from 'lucide-react';

interface TeamMember {
  name: string;
  image: string;
  profileUrl: string;
}

interface SocietyScheduleCallProps {
  url: string;
  description?: string;
  topics?: string[];
  teamMembers?: TeamMember[];
}

const DEFAULT_TEAM: TeamMember[] = [
  { name: 'Cookie', image: '/team/cookie.png', profileUrl: 'https://github.com/webel' },
  { name: 'Eric', image: '/team/Eric.png', profileUrl: 'https://paragraph.xyz/@ericmiki.eth' },
  { name: 'Michael', image: '/team/paralell-citizen.png', profileUrl: 'https://www.parallelcitizen.xyz/' },
  { name: 'Wagmit', image: '/team/wagmit.png', profileUrl: 'https://x.com/wagmiteth' },
];

export function SocietyScheduleCall({ url, description, topics, teamMembers }: SocietyScheduleCallProps) {
  const members = teamMembers ?? DEFAULT_TEAM;

  return (
    <div className="border-2 border-border p-6 bg-card shadow-brutal-md">
      <h2 className="font-mono font-bold text-sm uppercase mb-4">[ Schedule a Call With Nsnodes Team ]</h2>

      {/* Team avatar stack */}
      <div className="flex items-center mb-4">
        <div className="flex -space-x-3">
          {members.map((member) => (
            <a
              key={member.name}
              href={member.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-10 w-10 rounded-full border-2 border-border bg-muted overflow-hidden shadow-brutal-sm first:z-40 [&:nth-child(2)]:z-30 [&:nth-child(3)]:z-20 [&:nth-child(4)]:z-10 hover:z-50 hover:scale-110 transition-transform"
              title={member.name}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="40px"
              />
              {/* Initials fallback rendered behind the image */}
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-muted-foreground -z-10">
                {member.name.charAt(0).toUpperCase()}
              </span>
            </a>
          ))}
        </div>
      </div>

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
        className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm font-bold shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-[transform,box-shadow]"
      >
        <Video className="h-4 w-4" />
        Book a Call
      </a>
    </div>
  );
}
