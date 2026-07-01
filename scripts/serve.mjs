// Minimal zero-dependency static server to preview the exported ./dist locally
// (since `next start` doesn't work with output:"export"). Handles clean URLs.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";

const ROOT = "dist";
const PORT = process.env.PORT || 3007;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

async function resolve(pathname) {
  const p = join(ROOT, pathname);
  const s = await stat(p).catch(() => null);
  if (s && s.isFile()) return p;
  if (s && s.isDirectory()) {
    const idx = join(p, "index.html");
    if (await stat(idx).catch(() => null)) return idx;
    // directory without index.html (e.g. /journal) → fall through to <path>.html
  }
  const html = join(ROOT, pathname + ".html"); // clean URL → file.html
  if (await stat(html).catch(() => null)) return html;
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = await resolve(pathname === "/" ? "/index.html" : pathname);
    if (!file) {
      const nf = await readFile(join(ROOT, "404.html")).catch(() => null);
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      return res.end(nf || "Not found");
    }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("Server error");
  }
});

server.listen(PORT, () => console.log(`Static preview → http://localhost:${PORT}`));
