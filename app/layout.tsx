import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AsciiNav } from "@/components/ascii-nav";
import { ErrorHandler } from "./error-handler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nsnodes.com - Network State Hub for Network Societies Builders",
  description:
    "Hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.",
  metadataBase: new URL("https://nsnodes.com"),
  openGraph: {
    title: "nsnodes.com - Network State Hub for Network Societies Builders",
    description: "Hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.",
    url: "https://nsnodes.com",
    siteName: "NSNodes",
    images: [
      {
        url: "/featured-image.png",
        width: 1200,
        height: 630,
        alt: "Don't dare to raise me up in a nation state",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NSNodes - Network State Hub for Crypto Builders",
    description: "The ultimate hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.",
    images: ["/featured-image.png"],
  },
};

// ✅ Make RootLayout async so we can await headers()
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ FIX: await headers() instead of using it synchronously
  const h = await headers();
  const host = h.get("host") || "";
  const isStaging = host === "test.nsnodes.com";

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        {isStaging && (
          <>
            <meta
              name="robots"
              content="noindex,nofollow,noarchive,nosnippet"
            />
            <meta
              name="googlebot"
              content="noindex,nofollow,noarchive,nosnippet"
            />
          </>
        )}
        {/* Canonical: always point to production host to avoid duplicate content */}
        <link rel="canonical" href="https://nsnodes.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden flex flex-col dark`}
      >
        <ErrorHandler />
        <ThemeProvider defaultTheme="dark">
          <div className="relative z-50">
            <AsciiNav />
          </div>
          {/* Removed coming soon overlay */}
          <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden flex-1 w-full">{children}</main>
          <footer className="border-t-2 border-border py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                {/* Mobile-friendly ASCII art */}
                <div className="hidden sm:block">
                  <pre className="font-mono text-[10px] sm:text-xs opacity-60 max-w-full overflow-x-auto whitespace-pre">{`╔═══════════════════════════════════════════════════════════╗
║  Built with ❤️ for the Network State Community           ║
║  "The future is decentralized" - Balaji Srinivasan       ║
╚═══════════════════════════════════════════════════════════╝`}</pre>
                </div>
                
                {/* Mobile version - simpler text */}
                <div className="sm:hidden space-y-2">
                  <div className="font-mono text-xs opacity-60">
                    Built with ❤️ for the Network State Community
                  </div>
                  <div className="font-mono text-[10px] opacity-50 italic">
                    &quot;The future is decentralized&quot; - Balaji Srinivasan
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
