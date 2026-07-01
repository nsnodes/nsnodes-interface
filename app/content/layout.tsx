import { generatePageMetadata } from "@/lib/utils/metadata";

// Static page title - independent of H1 text in the page component
export const metadata = generatePageMetadata(
  "NSNodes Readings & Nodes Digest",
  "Read the latest Nodes Digest, browse core network-state resources, and follow the people shaping startup societies, popup cities, and new governance experiments."
);

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
