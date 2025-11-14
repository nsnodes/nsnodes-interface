import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata("Network State Grants");

export default function GrantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

