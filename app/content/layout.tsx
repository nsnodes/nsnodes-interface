import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("Network State Content Creators");

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

