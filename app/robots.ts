import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    // /admin is the private analytics dashboard and /api is its data endpoint —
    // neither should be crawled. The admin page also sends `noindex` itself,
    // because Disallow only prevents fetching, not indexing of a URL that is
    // linked from somewhere else.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
