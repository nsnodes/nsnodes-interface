import { Rocket } from "lucide-react";
import Image from "next/image";

export default function InvestmentDAO() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <Rocket className="h-12 w-12" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono">
          [ INVESTMENT DAO ]
        </h1>
        <p className="text-xl font-mono text-muted-foreground max-w-2xl mx-auto">
          The team is cooking, stay tuned.
        </p>
        <div className="flex justify-center mt-8">
          <Image
            src="/patience-please.jpeg"
            alt="Patience please"
            width={800}
            height={600}
            className="max-w-full h-auto"
          />
        </div>
      </section>

      {/* Main Content Box */}
      <section className="border-2 border-border p-8 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] text-center space-y-6">
        <pre className="font-mono text-sm opacity-80 whitespace-pre">{`
        `}</pre>
      </section>
    </div>
  );
}
