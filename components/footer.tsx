"use client";

import { SOCIAL_LINKS } from "@/lib/config/social-links";

export function Footer() {
  return (
    <footer className="border-t-2 border-border py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="border-2 border-border p-2.5 bg-card shadow-brutal-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all block"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <div className="font-mono text-xs opacity-60">
            Built with ❤️ for the Network State Community
          </div>
        </div>
      </div>
    </footer>
  );
}
