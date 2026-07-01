import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ── Blog / CMS layer ────────────────────────────────────────────────
// Posts are plain Markdown files in /content/blog with frontmatter.
// Adding a post = drop a new `.md` file in that folder. No hardcoded pages.

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type Faq = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // ISO yyyy-mm-dd
  updated?: string;
  readingTime: string;
  cover?: string;
  coverAlt?: string;
  featured?: boolean;
  keywords: string[];
};

export type Post = PostMeta & { content: string; faq: Faq[] };

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getPost(slug: string): Post | null {
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const filePath = fs.existsSync(mdPath) ? mdPath : mdxPath;
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    category: data.category ?? "Field Notes",
    date: data.date ? String(data.date).slice(0, 10) : "",
    updated: data.updated ? String(data.updated).slice(0, 10) : undefined,
    readingTime: data.readingTime ?? `${Math.max(1, Math.round(words / 200))} min read`,
    cover: data.cover ?? undefined,
    coverAlt: data.coverAlt ?? data.title ?? "",
    featured: Boolean(data.featured),
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    faq: Array.isArray(data.faq) ? data.faq : [],
    content,
  };
}

export function getAllPosts(): Post[] {
  return readSlugs()
    .map(getPost)
    .filter((p): p is Post => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostMeta(): PostMeta[] {
  return getAllPosts().map(({ content, faq, ...meta }) => meta);
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
