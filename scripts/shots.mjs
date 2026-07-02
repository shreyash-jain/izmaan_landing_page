// Visual QA: scroll like a human (so reveals trigger) and capture viewport
// screenshots of the new/changed sections. Serves ./dist on port 4323.
import { chromium, devices } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist", import.meta.url));
const OUT = fileURLToPath(new URL("../.audit", import.meta.url));
const PORT = 4323, BASE = `http://localhost:${PORT}`;
const MIME = { ".html":"text/html",".js":"text/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".xml":"application/xml",".txt":"text/plain",".ico":"image/x-icon" };
async function isFile(f){try{return (await stat(f)).isFile();}catch{return false;}}
async function resolve(u){let p=decodeURIComponent(u.split("?")[0]).replace(/\/+$/,"");if(p==="")return join(ROOT,"index.html");for(const c of [join(ROOT,p),join(ROOT,p+".html"),join(ROOT,p,"index.html")])if(await isFile(c))return c;return null;}
const server=createServer(async(req,res)=>{const f=await resolve(req.url);if(!f){res.writeHead(404);return res.end("404");}try{res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"});res.end(await readFile(f));}catch{res.writeHead(404);res.end("404");}});

async function shoot(page, id) {
  await page.screenshot({ path: join(OUT, `qa_${id}.png`) });
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "load" });

  // scroll to each target section slowly so IntersectionObserver reveals fire
  for (const id of ["packages", "getting-there"]) {
    await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, id);
    await page.waitForTimeout(1400); // let the 0.9s reveal transition finish
    await shoot(page, id);
  }

  await browser.close();
  server.close();
  console.log("QA shots → .audit/qa_packages.png, qa_getting-there.png");
})();
