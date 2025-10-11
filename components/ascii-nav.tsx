"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState } from "react";
import { LogoImage } from "@/components/logo-image";

export function AsciiNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "[ HOME ]" },
    { href: "/jobs", label: "[ JOBS ]" },
    { href: "/content", label: "[ CONTENT ]" },
    { href: "/vc", label: "[ VC ]" },
    { href: "/tooling", label: "[ TOOLING ]" },
    { href: "/investment-dao", label: "[ INVESTMENT DAO ]" },
    { href: "/contact", label: "[ CONTACT ]" },
  ];

  return (
    <nav className="border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Centered Logo and Controls */}
          <div className="flex items-center justify-center relative">
            <Link href="/" className="hover:opacity-80 transition-opacity block">
              <span className="hidden sm:inline-block"><LogoImage /></span>
              <span className="sm:hidden inline-block"><LogoImage width={160} height={32} /></span>
            </Link>
            {/* Right controls container to balance centering */}
            <div className="absolute right-0 flex items-center gap-2">
              {/* Desktop Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-border hover:bg-accent transition-colors font-mono"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span className="text-sm">[ LIGHT ]</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span className="text-sm">[ DARK ]</span>
                  </>
                )}
              </button>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden border-2 border-border px-3 py-2 font-mono text-sm hover:bg-accent"
              >
                {mobileMenuOpen ? "[ ✕ ]" : "[ ≡ ]"}
              </button>
            </div>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 font-mono text-sm border-2 border-border transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                      : "bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation (centered) */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-2 pb-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 font-mono text-sm border-2 border-border text-center ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-border hover:bg-accent transition-colors font-mono"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span className="text-sm">[ LIGHT MODE ]</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span className="text-sm">[ DARK MODE ]</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
