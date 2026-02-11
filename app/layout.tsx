import type { Metadata } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AsciiNav } from "@/components/ascii-nav";
import { BlurOverlay } from "@/components/blur-overlay";
import { Footer } from "@/components/footer";
import GAListener from "@/components/ga-listener";

export const metadata: Metadata = {
  title: "nsnodes.com | Network State Hub for Network Societies Builders",
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
    title: "nsnodes.com | Network State Hub for Network Societies Builders",
    description: "Hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.",
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
  const pathname = h.get("x-pathname") || "/";
  const isStaging = host === "test.nsnodes.com";

  // Build canonical URL with the current pathname
  const canonicalUrl = `https://nsnodes.com${pathname}`;

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
        {/* Canonical: point to production host with current path to avoid duplicate content */}
        <link rel="canonical" href={canonicalUrl} />
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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen overflow-x-hidden flex flex-col`}
      >
        <ThemeProvider defaultTheme="dark">
          <div className="relative z-50">
            <AsciiNav />
          </div>
          <BlurOverlay />
          <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 overflow-x-hidden flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
        {!isStaging && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
            <GAListener />
          </>
        )}
      </body>
    </html>
  );
}
