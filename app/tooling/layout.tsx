import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("NETWORK STATE TOOLING");

export default function ToolingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
