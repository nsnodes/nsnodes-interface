"use client";

import { MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-2xl mx-auto">
        <pre className="text-xs sm:text-sm md:text-base font-mono leading-none opacity-80">
        </pre>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
        </h1>
        <p className="text-2xl font-mono text-muted-foreground">
          Coming soon
        </p>
        
        {/* Telegram Link */}
        <div className="pt-8">
          <a
            href="https://t.me/+RwyXfj5VsXk2NmE1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-border px-8 py-4 bg-background hover:bg-accent transition-colors font-mono font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <MessageCircle className="h-5 w-5" />
            [ TELEGRAM CHANNEL ] →
          </a>
        </div>
      </section>
    </div>
  );
}
