import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPostMeta } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPostMeta().map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: p.updated || p.date ? new Date(p.updated || p.date) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
