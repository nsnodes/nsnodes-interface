"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

export default function GAListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // We only emit when GA is present and an ID is configured
    if (!window.gtag || !process.env.NEXT_PUBLIC_GA_ID) return;
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path:
        pathname + (searchParams?.toString() ? `?${searchParams}` : ""),
    });
  }, [pathname, searchParams]);
  return null;
}


