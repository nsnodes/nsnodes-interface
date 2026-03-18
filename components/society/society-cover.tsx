import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Cover images for society detail pages.
 * Key: society slug. Value: path to image in /public/societies/.
 * Recommended dimensions: 1200x400 (3:1 aspect ratio).
 */
export const SOCIETY_COVERS: Record<string, string> = {
  'network-school': '/societies/network-school-cover.png',
};

interface SocietyCoverProps {
  slug: string;
  children?: ReactNode;
}

export function SocietyCover({ slug, children }: SocietyCoverProps) {
  const src = SOCIETY_COVERS[slug];

  // No cover image — render children (back button) in normal flow
  if (!src) return <>{children}</>;

  return (
    <div className="relative w-full border-2 border-border shadow-brutal-md overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '3 / 1' }}>
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
        />
      </div>
      {/* Top gradient fade for back button readability */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/60 to-transparent pointer-events-none" />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
      {/* Overlaid children (back button) */}
      {children && (
        <div className="absolute top-4 left-4 z-10">
          {children}
        </div>
      )}
    </div>
  );
}
