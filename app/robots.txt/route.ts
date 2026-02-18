export function GET(request: Request) {
  const url = new URL(request.url);
  const host = url.hostname;
  const isStaging = host === "test.nsnodes.com";

  const body = isStaging
    ? [
        "User-agent: *",
        "Disallow: /",
        "# Staging environment - disallow all crawling",
      ].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
        "Disallow: /nskids",
        "Sitemap: https://nsnodes.com/sitemap.xml",
      ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": isStaging ? "noindex, nofollow, noarchive, nosnippet" : "index, follow",
    },
  });
}

