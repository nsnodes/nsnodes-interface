import Image from 'next/image';

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
}

export function SocietyCover({ slug }: SocietyCoverProps) {
  const src = SOCIETY_COVERS[slug];

  if (!src) return null;

  return (
    <div className="relative w-full overflow-hidden">
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
    </div>
  );
}
