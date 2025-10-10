import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Basic auth middleware for staging host
export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const rawHost = request.headers.get("host") || url.host;

  // Strip any port number (e.g., test.nsnodes.com:443 → test.nsnodes.com)
  const host = rawHost.replace(/:\d+$/, "");
  const pathname = url.pathname;

  // Match the staging host domain
  const isStagingHost = host === "test.nsnodes.com";

  // Skip auth for Next.js internals and public assets
  const isPublicAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    /\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|woff2?)$/i.test(pathname);

  if (!isStagingHost || isPublicAsset) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const expectedUser = process.env.BASIC_AUTH_USER || "user";
  const expectedPass = process.env.BASIC_AUTH_PASS || "pass";

  if (authHeader && authHeader.startsWith("Basic ")) {
    try {
      const base64Credentials = authHeader.slice(6).trim();
      const decoded = Buffer.from(base64Credentials, "base64").toString("utf8");
      const [user, pass] = decoded.split(":");
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    } catch {
      // fallthrough to unauthorized response
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Staging", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

export const config = {
  matcher: "/:path*",
};
