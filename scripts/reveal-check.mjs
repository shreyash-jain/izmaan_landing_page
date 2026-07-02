// Focused check: does content actually reveal for a normal user who scrolls
// slowly, and what happens with JS disabled? Serves ./dist.
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const PORT = 4322;
const BASE = `http://localhost:${PORT}`;
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".xml":"application/xml",".txt":"text/plain",".ico":"image/x-icon" };
async function isFile(f){try{return (await stat(f)).isFile();}catch{return false;}}
async function resolve(u){let p=decodeURIComponent(u.split("?")[0]).replace(/\/+$/,"");if(p==="")return join(ROOT,"index.html");for(const c of [join(ROOT,p),join(ROOT,p+".html"),join(ROOT,p,"index.html")])if(await isFile(c))return c;return null;}
const server=createServer(async(req,res)=>{const f=await resolve(req.url);if(!f){res.writeHead(404);return res.end("404");}try{res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(await readFile(f));}catch{res.writeHead(404);res.end("404");}});

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();

  // 1) JS ENABLED, slow human-like scroll
  const ctx1 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p1 = await ctx1.newPage();
  await p1.goto(BASE + "/", { waitUntil: "load" });
  for (let i = 0; i < 12; i++) { await p1.mouse.wheel(0, 700); await p1.waitForTimeout(350); }
  await p1.waitForTimeout(1200);
  const hiddenJS = await p1.$$eval(".reveal", (els) =>
    els.filter((e) => getComputedStyle(e).opacity !== "1").length
  );
  const totalReveal = await p1.$$eval(".reveal", (e) => e.length);
  console.log(`JS ON  — still-hidden .reveal after slow scroll: ${hiddenJS}/${totalReveal}`);
  await ctx1.close();

  // 2) JS DISABLED — what does a crawler / no-JS user see?
  const ctx2 = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const p2 = await ctx2.newPage();
  await p2.goto(BASE + "/", { waitUntil: "load" });
  const hiddenNoJS = await p2.$$eval(".reveal", (els) =>
    els.filter((e) => getComputedStyle(e).opacity !== "1").length
  );
  const total2 = await p2.$$eval(".reveal", (e) => e.length);
  const visibleText = await p2.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim().length);
  console.log(`JS OFF — hidden .reveal: ${hiddenNoJS}/${total2}  | visible innerText chars: ${visibleText}`);
  await p2.screenshot({ path: join(ROOT, "..", ".audit", "nojs_home.png"), fullPage: true });
  await ctx2.close();

  await browser.close();
  server.close();
})();
