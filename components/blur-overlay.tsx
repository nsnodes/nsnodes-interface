"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function BlurOverlay() {
  const pathname = usePathname();

  // Don't show blur overlay on /ns page
  if (pathname === "/ns") {
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
            We&apos;re getting things ready. Want to help out? Fill in this form:

          </p>
        </div>

        <div className="space-y-4 pt-4">
      
          <Link
            href="https://forms.gle/Yc53KytVD36zamHC8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 font-mono text-sm border-2 border-border bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            [ CONTRIBUTE ]
          </Link>
        </div>
      </div>
    </div>
  );
}
