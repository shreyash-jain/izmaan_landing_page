// One-off QA audit harness. Serves ./dist and walks the site as a real user
// across desktop + mobile, capturing console errors, broken images/links,
// basic a11y signals and screenshots. Run: node scripts/audit.mjs
import { chromium, devices } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const OUT = fileURLToPath(new URL("../.audit", import.meta.url));
const PORT = 4321;
const BASE = `http://localhost:${PORT}`;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".xml": "application/xml",
  ".txt": "text/plain", ".webp": "image/webp", ".avif": "image/avif",
  ".ico": "image/x-icon",
};

async function isFile(f) { try { return (await stat(f)).isFile(); } catch { return false; } }

async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "");
  if (p === "") return join(ROOT, "index.html");
  // Next static export: /journal -> journal.html, /journal/foo -> journal/foo.html
  const candidates = [
    join(ROOT, p),
    join(ROOT, p + ".html"),
    join(ROOT, p, "index.html"),
  ];
  for (const c of candidates) if (await isFile(c)) return c;
  return null;
}

const server = createServer(async (req, res) => {
  const full = await resolveFile(req.url);
  if (!full) { res.writeHead(404); return res.end("404"); }
  try {
    const body = await readFile(full);
    res.writeHead(200, { "content-type": MIME[extname(full)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("404"); }
});

const findings = [];
const note = (page, sev, msg) => findings.push({ page, sev, msg });

async function walk(browser, label, contextOpts, pages) {
  const ctx = await browser.newContext(contextOpts);
  for (const route of pages) {
    const page = await ctx.newPage();
    const consoleErrs = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrs.push(m.text()); });
    page.on("pageerror", (e) => consoleErrs.push("PAGEERROR: " + e.message));

    const resp = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    if (!resp || resp.status() >= 400) note(route, "ERR", `${label}: HTTP ${resp?.status()}`);

    // scroll the whole page so lazy (below-the-fold) images load, then settle
    await page.evaluate(async () => {
      await new Promise((res) => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += window.innerHeight;
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else { window.scrollTo(0, 0); setTimeout(res, 400); }
        };
        step();
      });
    });
    await page.waitForLoadState("networkidle").catch(() => {});
    // give every in-viewport <img> up to 5s to finish decoding before judging
    await page.evaluate(() =>
      Promise.all(Array.from(document.images).map((i) =>
        i.complete ? Promise.resolve() : i.decode().catch(() => {})
      ))
    ).catch(() => {});

    // broken images
    const imgs = await page.$$eval("img", (els) =>
      els.map((i) => ({ src: i.currentSrc || i.src, w: i.naturalWidth, alt: i.getAttribute("alt") }))
    );
    for (const im of imgs) {
      if (im.w === 0) note(route, "ERR", `${label}: broken image ${im.src}`);
      if (im.alt === null) note(route, "A11Y", `${label}: <img> missing alt ${im.src}`);
    }

    // headings / landmarks
    const h1s = await page.$$eval("h1", (e) => e.length);
    if (h1s !== 1) note(route, "SEO", `${label}: ${h1s} <h1> on page (want 1)`);
    const hasMain = await page.$("main");
    if (!hasMain) note(route, "A11Y", `${label}: no <main> landmark`);

    // meta / og
    if (route === "/") {
      const og = await page.$('meta[property="og:image"]');
      if (!og) note(route, "SEO", `${label}: homepage has NO og:image (bad social sharing)`);
      const ld = await page.$$eval('script[type="application/ld+json"]', (e) => e.length);
      if (ld === 0) note(route, "SEO", `${label}: homepage has NO JSON-LD structured data`);
      const desc = await page.$('meta[name="description"]');
      if (!desc) note(route, "SEO", `${label}: no meta description`);
    }

    if (consoleErrs.length) note(route, "JS", `${label}: console errors: ${consoleErrs.slice(0,3).join(" | ")}`);

    // screenshot
    const safe = (label + route).replace(/[^a-z0-9]+/gi, "_");
    await page.screenshot({ path: join(OUT, safe + ".png"), fullPage: true });
    await page.close();
  }
  await ctx.close();
}

(async () => {
  await mkdir(OUT, { recursive: true });
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();
  const routes = ["/", "/journal", "/journal/pomene-travel-guide", "/nonexistent-page"];

  await walk(browser, "desktop", { viewport: { width: 1440, height: 900 } }, routes);
  await walk(browser, "mobile", { ...devices["iPhone 13"] }, routes);

  await browser.close();
  server.close();

  // report — printed AND written to a file (stdout capture is unreliable here)
  const order = { ERR: 0, JS: 1, A11Y: 2, SEO: 3 };
  findings.sort((a, b) => (order[a.sev] ?? 9) - (order[b.sev] ?? 9));
  const lines = ["================ AUDIT FINDINGS ================"];
  if (!findings.length) lines.push("No automated findings — all clear. ✓");
  for (const f of findings) lines.push(`[${f.sev}] ${f.page}  —  ${f.msg}`);
  lines.push(`\nScreenshots → .audit/  (${routes.length * 2} shots)`);
  const out = lines.join("\n");
  console.log("\n" + out);
  await writeFile(join(OUT, "report.txt"), out + "\n");
})();
