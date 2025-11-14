import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("Edge City Events");

export default function EdgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

