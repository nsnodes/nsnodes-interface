import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata(
  "EDGE & DEVCONNECT RELATED EVENTS IN ARGENTINA"
);

export default function ArgentinaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

