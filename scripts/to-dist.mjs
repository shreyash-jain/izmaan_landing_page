// Move Next's static export (./out) to ./dist so Cloudflare Pages (which looks
// for a "dist" output directory by default) can serve it with no dashboard config.
import { existsSync, rmSync, renameSync } from "node:fs";

const OUT = "out";
const DIST = "dist";

if (!existsSync(OUT)) {
  console.error(
    `[to-dist] "${OUT}/" not found — did "next build" run with output:"export"?`
  );
  process.exit(1);
}
if (existsSync(DIST)) rmSync(DIST, { recursive: true, force: true });
renameSync(OUT, DIST);
console.log(`[to-dist] Static site exported → ${DIST}/`);
