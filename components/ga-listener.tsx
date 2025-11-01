"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Type declaration for Google Analytics gtag function
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: {
        page_path?: string;
      }
    ) => void;
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


