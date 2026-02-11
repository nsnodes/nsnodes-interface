"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Pages marked as "soon" in the navigation
const SOON_PAGES = [
  "/funding",
  "/funding/grants",
  "/investment-dao",
  "/content",
  "/tooling",
];

export function BlurOverlay() {
  const pathname = usePathname();

  // Only show blur overlay on pages marked as "soon"
  if (!SOON_PAGES.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 backdrop-blur-md bg-background/70 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            Coming Soon
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Want to help out? Fill in this form:
          </p>
        </div>

        <div className="space-y-4 pt-4">
      
          <Link
            href="https://forms.gle/Yc53KytVD36zamHC8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 font-mono text-sm border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-brutal-md-active hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ CONTRIBUTE ]
          </Link>
        </div>
      </div>
    </div>
  );
}
