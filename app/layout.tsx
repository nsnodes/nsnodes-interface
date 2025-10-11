import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AsciiNav } from "@/components/ascii-nav";

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
    siteName: "nsnodes.com",
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
    title: "NSNodes - Network State Hub for Network Societies builders",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        <ThemeProvider defaultTheme="dark">
          <div className="relative z-50">
            <AsciiNav />
          </div>
          {/* Full-screen overlay: blur background and show Coming Soon */}
          <div className="fixed inset-0 z-40 backdrop-blur-md bg-background/70 flex items-center justify-center">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">Coming Soon</h1>
              <p className="text-muted-foreground font-mono text-sm">We&apos;re getting things ready.</p>
            </div>
          </div>
          <main className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">{children}</main>
          <footer className="border-t-2 border-border mt-16 py-8">
            <div className="container mx-auto px-4">
              <pre className="text-center font-mono text-[10px] sm:text-xs opacity-60 max-w-full overflow-x-auto whitespace-pre">{`╔═══════════════════════════════════════════════════════════╗
║  Built with ❤️ for the Network State Community           ║
║  "The future is decentralized" - Balaji Srinivasan       ║
╚═══════════════════════════════════════════════════════════╝`}</pre>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
