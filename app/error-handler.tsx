"use client";

import { useEffect } from "react";

/**
 * Global error handler to suppress harmless browser extension errors
 * Specifically handles wallet extension injection conflicts with Next.js 15
 */
export function ErrorHandler() {
  useEffect(() => {
    // Store original error handler
    const originalError = console.error;

    // Override console.error to filter out known harmless errors
    console.error = (...args: unknown[]) => {
      const errorString = String(args.join(" "));
      
      // Suppress wallet extension errors that don't affect functionality
      const suppressedErrors = [
        "Cannot redefine property: ethereum",
        "Cannot redefine property: solana",
        "Cannot redefine property: phantom",
        "evmAsk.js", // Phantom wallet extension
      ];

      const shouldSuppress = suppressedErrors.some((err) =>
        errorString.includes(err)
      );

      if (!shouldSuppress) {
        originalError.apply(console, args);
      }
    };

    // Handle window errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || "";
      
      // Suppress wallet extension errors
      if (
        errorMessage.includes("Cannot redefine property: ethereum") ||
        errorMessage.includes("Cannot redefine property: solana") ||
        errorMessage.includes("Cannot redefine property: phantom") ||
        errorMessage.includes("evmAsk.js")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener("error", handleError, true);

    // Cleanup
    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError, true);
    };
  }, []);

  return null;
}

