import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AsciiNav } from "@/components/ascii-nav";
import { BlurOverlay } from "@/components/blur-overlay";

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
    "Hub for Network State events, jobs, content creators, VCs, and tooling.",
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
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden dark">
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
        {/* Set dark mode as default before hydration to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden flex flex-col`}
      >
        <ThemeProvider defaultTheme="dark">
          <div className="relative z-50">
            <AsciiNav />
          </div>
          <BlurOverlay />
          <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden flex-1 w-full">{children}</main>
          <footer className="border-t-2 border-border py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-2">
                <div className="font-mono text-xs opacity-60">
                  Built with ❤️ for the Network State Community
                </div>
                <a 
                  href="https://github.com/orgs/nsnodes/repositories" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-xs opacity-60 hover:opacity-100 hover:text-primary transition-all block"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
