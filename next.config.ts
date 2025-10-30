import type { NextConfig } from "next";

const isStagingEnv =
  process.env.NSNODES_ENV === "staging" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_SITE_ENV === "staging";

const nextConfig: NextConfig = {
  eslint: {
    // Do not fail the production build on ESLint warnings/errors.
    // Vercel/Next will still lint locally and in CI where desired.
    ignoreDuringBuilds: true,
  },
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
