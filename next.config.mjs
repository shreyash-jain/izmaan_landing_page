/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — emits a fully static site (to ./out, then moved to ./dist)
  // so hosts like Cloudflare Pages can serve it directly. The site has no
  // SSR / API routes, so nothing is lost.
  output: "export",
  reactStrictMode: true,
  images: {
    // Required for `output: export` — no on-the-fly optimizer at runtime.
    // Source images are pre-sized; the host (e.g. Cloudflare) can optimize further.
    unoptimized: true,
  },
};

export default nextConfig;
