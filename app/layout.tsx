import type { Metadata } from "next";
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
  title: "NSNodes - Network State Hub for Crypto Builders",
  description: "The ultimate hub for Network State events, jobs, content creators, VCs, and tooling. Built for the decentralized future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider defaultTheme="dark">
          <AsciiNav />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="border-t-2 border-border mt-16 py-8">
            <div className="container mx-auto px-4">
              <pre className="text-center font-mono text-xs opacity-60">
{`╔═══════════════════════════════════════════════════════════╗
║  Built with ❤️ for the Network State Community           ║
║  "The future is decentralized" - Balaji Srinivasan       ║
╚═══════════════════════════════════════════════════════════╝`}
              </pre>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
