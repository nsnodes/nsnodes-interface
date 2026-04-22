'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SocietyContentData } from '@/lib/data/society-content';

// Render text with markdown-style [label](url) links
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary transition-colors font-bold">
              {match[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function TextSection({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-2 border-border bg-card shadow-brutal-md">
      <div className="p-4 border-b border-border">
        <h2 className="font-mono font-bold text-sm">[ {title} ]</h2>
      </div>
      <div className="p-6 space-y-4">
        {text.split('\n\n').map((paragraph, i) => (
          <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

interface SocietyContentProps {
  content: SocietyContentData | null;
}

export function SocietyContent({ content }: SocietyContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!content) return null;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ OVERVIEW ]</h2>
        </div>
        <div className="p-6 space-y-6">
          {content.overview.map((item, i) => (
            <div key={i}>
              <h3 className="font-mono font-bold text-base mb-2">{item.title}</h3>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ HISTORY ]</h2>
        </div>
        <div className="p-6 space-y-6">
          {content.history.text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>

      <TextSection title="LOCATION" text={content.location} />
      <TextSection title="DURATION" text={content.duration} />
      <TextSection title="PRICING" text={content.pricing} />

      {/* Amenities */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ AMENITIES ]</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <span className="text-primary">+</span>
                {amenity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fellowship */}
      {content.fellowship && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ FELLOWSHIP ]</h2>
          </div>
          <div className="p-6">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {(() => {
                if (!content.fellowshipUrl) return content.fellowship;

                const text = content.fellowship;
                const marker = 'fellowship';
                const idx = text.toLowerCase().indexOf(marker);
                if (idx === -1) return content.fellowship;

                const before = text.slice(0, idx);
                const matched = text.slice(idx, idx + marker.length);
                const after = text.slice(idx + marker.length);

                return (
                  <>
                    {before}
                    <a
                      href={content.fellowshipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                    >
                      {matched}
                    </a>
                    {after}
                  </>
                );
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Longtermer */}
      {content.longtermer && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ NS LONGTERMER ]</h2>
          </div>
          <div className="p-6">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              <RichText text={content.longtermer} />
            </p>
          </div>
        </div>
      )}

      {/* Kid Friendly */}
      {content.kidFriendly && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ KID FRIENDLY ]</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">{content.kidFriendly.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.kidFriendly.activities.map((activity, i) => (
                <div key={i} className="border-2 border-border p-3 bg-background">
                  <div className="font-mono font-bold text-sm mb-1">
                    {activity.emoji} {activity.name}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.location}</div>
                  <div className="text-xs font-mono text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discount */}
      {content.discount && (
        <div className="border-2 border-border bg-card shadow-brutal-md">
          <div className="p-4 border-b border-border">
            <h2 className="font-mono font-bold text-sm">[ NETWORK SCHOOL DISCOUNT ]</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              {(() => {
                const text = content.discount.text;
                const marker = 'our link';
                const idx = text.indexOf(marker);
                if (idx === -1) return text;

                const before = text.slice(0, idx);
                const after = text.slice(idx + marker.length);

                return (
                  <>
                    {before}
                    <a
                      href={content.discount.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                    >
                      {marker}
                    </a>
                    {after}
                  </>
                );
              })()}
            </p>
            <a
              href={content.discount.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm font-bold shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-[transform,box-shadow]"
            >
              {content.discount.linkText}
            </a>
          </div>
        </div>
      )}

      {/* How to Enter */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ HOW TO ENTER ]</h2>
        </div>
        <div className="p-6 space-y-4">
          {content.howToEnter.text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">
              {i === 0 && content.howToEnter.linkText && content.howToEnter.linkUrl ? (
                <>
                  Applications are submitted{' '}
                  <a
                    href={content.howToEnter.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-primary transition-colors font-bold"
                  >
                    {content.howToEnter.linkText}
                  </a>
                  .{' '}
                </>
              ) : null}
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="border-2 border-border bg-card shadow-brutal-md">
        <div className="p-4 border-b border-border">
          <h2 className="font-mono font-bold text-sm">[ FAQs ]</h2>
        </div>
        <div className="divide-y divide-border">
          {content.faqs.map((faq, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-mono font-bold">{faq.question}</span>
                <ChevronDown className={`h-4 w-4 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === i && (
                <p className="text-sm font-mono text-muted-foreground leading-relaxed mt-3 pr-8">
                  <RichText text={faq.answer} />
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
