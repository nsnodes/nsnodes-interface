import type { NextConfig } from "next";

const isStagingEnv =
  process.env.NSNODES_ENV === "staging" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_SITE_ENV === "staging";

const nextConfig: NextConfig = {
  async headers() {
    if (!isStagingEnv) return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
