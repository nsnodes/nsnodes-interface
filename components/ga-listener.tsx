"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GAListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    // We only emit when GA is present and an ID is configured
    if (!(window as any).gtag || !process.env.NEXT_PUBLIC_GA_ID) return;
    (window as any).gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path:
        pathname + (searchParams?.toString() ? `?${searchParams}` : ""),
    });
  }, [pathname, searchParams]);
  return null;
}


