import type { Metadata } from "next";
import { getAllPostMeta } from "@/lib/posts";
import { AdminDashboard } from "./AdminDashboard";

// Never index the admin area. robots.ts also disallows /admin, but a Disallow
// only stops crawling — a page linked from elsewhere can still be indexed
// without being fetched, so the meta tag is the belt to that braces.
export const metadata: Metadata = {
  title: "Analytics · Izmaan Lodge",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  // Read at build time (this is a static export) and hand the registry to the
  // client, so the leaderboard can list posts GA has no rows for yet and show
  // them honestly as zero rather than omitting them.
  const posts = getAllPostMeta().map((p) => ({
    slug: p.slug,
    path: `/journal/${p.slug}`,
    title: p.title,
    category: p.category,
    date: p.date,
  }));

  return <AdminDashboard posts={posts} />;
}
