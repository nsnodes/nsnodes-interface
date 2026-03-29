import type { MetadataRoute } from "next";
import { readdirSync, existsSync } from "fs";
import { join } from "path";
import { getSocieties } from "@/lib/actions/societies";
import { societyNameToSlug } from "@/lib/utils/slug";

const SITE_URL = "https://nsnodes.com";

// Routes to exclude from the sitemap
const EXCLUDED_ROUTES = new Set(["/nskids"]);

function discoverRoutes(dir: string, base = ""): string[] {
  const routes: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;

    // Skip Next.js internals, API route handlers, and dynamic segments
    if (name.startsWith("_") || name.startsWith("(") || name.startsWith("[")) continue;
    // Skip the robots.txt route directory
    if (name === "robots.txt") continue;

    const fullPath = join(dir, name);
    const routePath = `${base}/${name}`;

    // If this directory has a page.tsx, it's a route
    if (existsSync(join(fullPath, "page.tsx"))) {
      if (!EXCLUDED_ROUTES.has(routePath)) {
        routes.push(routePath);
      }
    }

    // Recurse into subdirectories
    routes.push(...discoverRoutes(fullPath, routePath));
  }

  return routes;
}

async function getSocietyRoutes(): Promise<string[]> {
  try {
    const societies = await getSocieties();
    return societies
      .filter((s) => s.tier >= 1 && s.tier <= 5)
      .map((s) => `/societies/${societyNameToSlug(s.name)}`);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appDir = join(process.cwd(), "app");
  const staticRoutes = ["/", ...discoverRoutes(appDir)];
  const societyRoutes = await getSocietyRoutes();
  const routes = [...staticRoutes, ...societyRoutes];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: "daily" as const,
    priority: route === "/" ? 1.0 : route.startsWith("/societies/") ? 0.6 : 0.7,
  }));
}
