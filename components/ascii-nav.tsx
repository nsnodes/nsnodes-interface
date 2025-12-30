"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";
import { LogoImage } from "@/components/logo-image";

export function AsciiNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fundingDropdownOpen, setFundingDropdownOpen] = useState(false);
  const fundingDropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/events", label: "[ EVENTS ]" },
    { href: "/societies", label: "[ SOCIETIES ]" },
    { href: "/corecommand", label: "[ CORE COMMANDS ]" },
    { href: "/jobs", label: "[ JOBS ]" },
    {
      href: "/funding",
      label: "[ FUNDING ]",
      dropdown: [
        { href: "/funding/vc", label: "[ VC ]" },
        { href: "/funding/grants", label: "[ GRANTS ]", comingSoon: true },
        { href: "/investment-dao", label: "[ INVESTMENT DAO ]", comingSoon: true },
      ]
    },
    { href: "/content", label: "[ CONTENT ]" },
    { href: "/tooling", label: "[ TOOLING ]", comingSoon: true },
    { href: "/contact", label: "[ CONTACT ]" },
  ];

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only run on desktop (check if mobile menu is closed)
      if (!mobileMenuOpen && fundingDropdownRef.current && !fundingDropdownRef.current.contains(event.target as Node)) {
        setFundingDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Logo and Controls */}
          <div className="flex items-center justify-between md:justify-center relative w-full">
            {/* Mobile: Logo on left, controls on right */}
            <div className="flex items-center justify-between w-full md:hidden">
              <Link href="/" className="hover:opacity-80 transition-opacity block">
                <LogoImage width={120} height={24} />
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="border-2 border-border px-3 py-2 font-mono text-sm hover:bg-accent whitespace-nowrap"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? "[ LIGHT ]" : "[ DARK ]"}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="border-2 border-border px-3 py-2 font-mono text-sm hover:bg-accent whitespace-nowrap"
                >
                  {mobileMenuOpen ? "[ ✕ ]" : "[ ≡ ]"}
                </button>
              </div>
            </div>
            
            {/* Desktop: Centered logo with controls positioned absolutely within container */}
            <div className="hidden md:flex items-center justify-center relative w-full">
              <Link href="/" className="hover:opacity-80 transition-opacity block">
                <LogoImage />
              </Link>
              <div className="absolute right-0 flex items-center gap-2">
                {/* Desktop Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-border hover:bg-accent transition-colors font-mono"
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
              </div>
            </div>
          </div>

          {/* Centered Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              {navItems.map((item) => {
                if (item.dropdown) {
                  // Dropdown item
                  const isActive = pathname === item.href || item.dropdown.some(sub => pathname === sub.href);
                  return (
                    <div
                      key={item.href}
                      ref={fundingDropdownRef}
                      className="relative group"
                    >
                      <Link
                        href={item.href}
                        onMouseEnter={() => setFundingDropdownOpen(true)}
                        className={`px-4 py-2 font-mono text-sm border-2 border-border transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center gap-1 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                            : "bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-3 w-3 transition-transform ${fundingDropdownOpen ? 'rotate-180' : ''}`} />
                      </Link>
                      {fundingDropdownOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 bg-background border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] z-50 min-w-[200px]"
                          onMouseEnter={() => setFundingDropdownOpen(true)}
                          onMouseLeave={() => setFundingDropdownOpen(false)}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-2 font-mono text-sm border-b last:border-b-0 border-border hover:bg-accent transition-colors ${
                                pathname === subItem.href ? "bg-primary/10" : ""
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {subItem.label}
                                {subItem.comingSoon && (
                                  <span className="text-[8px] px-1 py-0.5 bg-yellow-500 text-black font-bold rounded">SOON</span>
                                )}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                // Regular item
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 font-mono text-sm border-2 border-border transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none relative ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                        : "bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.comingSoon && (
                        <span className="text-[8px] px-1 py-0.5 bg-yellow-500 text-black font-bold rounded">SOON</span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation (centered) */}
          {mobileMenuOpen && (
            <div className="md:hidden flex flex-col gap-2 pb-2">
              {navItems.map((item) => {
                if (item.dropdown) {
                  // Dropdown item for mobile - show on hover/tap
                  const isActive = pathname === item.href || item.dropdown.some(sub => pathname === sub.href);
                  return (
                    <div key={item.href} className="flex flex-col gap-2 relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFundingDropdownOpen(!fundingDropdownOpen);
                        }}
                        className={`px-4 py-2 font-mono text-sm border-2 border-border text-center flex items-center justify-center gap-1 w-full ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-accent active:bg-accent"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className={`h-3 w-3 transition-transform ${fundingDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {fundingDropdownOpen && (
                        <div 
                          className="flex flex-col gap-2 pl-4 bg-muted/50 p-2 rounded border border-border"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              prefetch={true}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Close menus immediately - Next.js will handle navigation
                                setFundingDropdownOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className={`px-4 py-2 font-mono text-sm border-2 border-border text-center min-h-[44px] flex items-center justify-center touch-manipulation ${
                                pathname === subItem.href
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background hover:bg-accent active:bg-accent"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {subItem.label}
                                {subItem.comingSoon && (
                                  <span className="text-[8px] px-1 py-0.5 bg-yellow-500 text-black font-bold rounded">SOON</span>
                                )}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                // Regular item
                return (
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
                    <span className="flex items-center justify-center gap-2">
                      {item.label}
                      {item.comingSoon && (
                        <span className="text-[8px] px-1 py-0.5 bg-yellow-500 text-black font-bold rounded">SOON</span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
