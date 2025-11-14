import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("VENTURE CAPITAL");

export default function VCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
