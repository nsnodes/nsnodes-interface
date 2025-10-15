const PROD = "https://nsnodes.com";

const routes = [
  "/",
  "/jobs",
  "/content",
  "/vc",
  "/tooling",
  "/contact",
];

function generateXml(base: string) {
  const urls = routes
    .map((path) => {
      const loc = `${base}${path}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${path === "/" ? "1.0" : "0.7"}</priority>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function GET() {
  // Always point search engines to production canonical host
  const base = PROD;
  const xml = generateXml(base);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}


