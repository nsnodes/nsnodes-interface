import type { Metadata } from "next";

/**
 * Generates page metadata with the format: H1 text | nsnodes.com
 * @param h1Text - The H1 text from the page (e.g., "CONTACT", "NETWORK STATE JOBS")
 * @param description - Optional description for the page
 * @returns Metadata object for Next.js
 */
export function generatePageMetadata(
  h1Text: string,
  description?: string
): Metadata {
  // Remove brackets if present, then format as H1 text | nsnodes.com
  const cleanH1Text = h1Text.replace(/^\[|\]$/g, "").trim();
  const title = `${cleanH1Text} | nsnodes.com`;

  return {
    title,
    description:
      description ||
      `${cleanH1Text} - Network State Hub for Network Societies Builders`,
    openGraph: {
      title,
      description:
        description ||
        `${cleanH1Text} - Network State Hub for Network Societies Builders`,
      url: "https://nsnodes.com",
      siteName: "NSNodes",
      images: [
        {
          url: "/featured-image.png",
          width: 1200,
          height: 630,
          alt: "Don't dare to raise me up in a nation state",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        description ||
        `${cleanH1Text} - Network State Hub for Network Societies Builders`,
      images: ["/featured-image.png"],
    },
  };
}
