// Verify ambient sound: auto-starts on first gesture, caps at "on" (50%),
// and mutes on tap. Also screenshots Getting There. Serves ./dist on 4324.
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const OUT = fileURLToPath(new URL("../.audit", import.meta.url));
const PORT = 4324, BASE = `http://localhost:${PORT}`;
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".xml":"application/xml",".txt":"text/plain",".ico":"image/x-icon" };
async function isFile(f){try{return (await stat(f)).isFile();}catch{return false;}}
async function resolve(u){let p=decodeURIComponent(u.split("?")[0]).replace(/\/+$/,"");if(p==="")return join(ROOT,"index.html");for(const c of [join(ROOT,p),join(ROOT,p+".html"),join(ROOT,p,"index.html")])if(await isFile(c))return c;return null;}
const server=createServer(async(req,res)=>{const f=await resolve(req.url);if(!f){res.writeHead(404);return res.end("404");}try{res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(await readFile(f));}catch{res.writeHead(404);res.end("404");}});

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });

  const btn = 'button[data-ambient]';
  const state = async () => page.getAttribute(btn, "aria-pressed");
  const labelText = async () => (await page.textContent(btn))?.trim();

  await page.waitForSelector(btn);
  await page.waitForTimeout(800);
  console.log("after load:        aria-pressed =", await state(), "| label:", await labelText());

  // simulate a real user gesture (scroll) → autostart should flip it on
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(1200);
  console.log("after scroll:      aria-pressed =", await state(), "| label:", await labelText());

  // tap to mute
  await page.click(btn);
  await page.waitForTimeout(700);
  console.log("after tap (mute):  aria-pressed =", await state(), "| label:", await labelText());

  // tap to play again
  await page.click(btn);
  await page.waitForTimeout(700);
  console.log("after tap (play):  aria-pressed =", await state(), "| label:", await labelText());

  // screenshot Getting There (clean location line, no "approximate")
  await page.evaluate(() => document.getElementById("getting-there")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: join(OUT, "qa_getting-there.png") });

  await browser.close();
  server.close();
  console.log("shot → .audit/qa_getting-there.png");
})();
