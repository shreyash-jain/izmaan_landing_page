// Standalone end-to-end check of the GA4 credentials, with no UI involved.
// Proves, in order: the private key parses → a token issues → runReport
// returns 200 with rows. Each step fails loudly with the specific fix.
//
//   node scripts/verify-ga.mjs
//
// Reads .env.local / .env if present, otherwise the ambient environment.

import { readFileSync, existsSync } from "node:fs";
import { SignJWT, importPKCS8 } from "jose";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

// ── minimal .env loader (no dependency needed) ──────────────────────────
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let [, key, val] = m;
    val = val.trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const step = (m) => console.log(`\n\x1b[1m${m}\x1b[0m`);

function die(message, hint) {
  bad(message);
  if (hint) console.log(`\n  \x1b[33m→ ${hint}\x1b[0m`);
  process.exit(1);
}

// ── 1. environment ──────────────────────────────────────────────────────
step("1. Environment variables");

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL?.trim();
const rawKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY;

if (!propertyId || !clientEmail || !rawKey) {
  die(
    "Missing one or more of GOOGLE_ANALYTICS_PROPERTY_ID, " +
      "GOOGLE_ANALYTICS_CLIENT_EMAIL, GOOGLE_ANALYTICS_PRIVATE_KEY.",
    "Put them in .env.local for a local check, or set them in the Cloudflare " +
      "Pages dashboard for the deployed site."
  );
}

if (!/^\d{6,12}$/.test(propertyId)) {
  die(
    `GOOGLE_ANALYTICS_PROPERTY_ID is "${propertyId}", which doesn't look like a property ID.`,
    "It is a ~9-digit number from GA4 → Admin → Property details (top right). " +
      "It is NOT the G-XXXXXXX measurement ID and NOT the Stream ID. Shortcut: " +
      "the Analytics URL contains /a<accountId>p<propertyId>/ — use the digits after 'p'."
  );
}
ok(`Property ID ${propertyId}`);
ok(`Service account ${clientEmail}`);

// ── 2. private key ──────────────────────────────────────────────────────
step("2. Private key");

let pem = rawKey.trim();
if (
  (pem.startsWith('"') && pem.endsWith('"')) ||
  (pem.startsWith("'") && pem.endsWith("'"))
) {
  pem = pem.slice(1, -1);
}
pem = pem.replace(/\\n/g, "\n").trim();

if (!pem.includes("-----BEGIN PRIVATE KEY-----")) {
  die(
    "The key is missing its '-----BEGIN PRIVATE KEY-----' header.",
    "Copy the entire private_key value out of the service-account JSON, " +
      "header and footer lines included. A copy that starts after the header " +
      "fails with 'must be PKCS#8 formatted string'."
  );
}

let key;
try {
  key = await importPKCS8(pem, "RS256");
  ok("Parsed as a PKCS#8 RS256 key");
} catch (err) {
  die(`Key would not parse: ${err.message}`, "Re-copy private_key from the JSON file.");
}

// ── 3. token exchange ───────────────────────────────────────────────────
step("3. Access token");

const nowSec = Math.floor(Date.now() / 1000);
const assertion = await new SignJWT({ scope: SCOPE })
  .setProtectedHeader({ alg: "RS256", typ: "JWT" })
  .setIssuer(clientEmail)
  .setSubject(clientEmail)
  .setAudience(TOKEN_URL)
  .setIssuedAt(nowSec)
  .setExpirationTime(nowSec + 3600)
  .sign(key);

const tokenRes = await fetch(TOKEN_URL, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
const tokenBody = await tokenRes.json().catch(() => ({}));

if (!tokenRes.ok || !tokenBody.access_token) {
  die(
    `Token exchange failed (${tokenRes.status}): ${
      tokenBody.error_description || tokenBody.error || "no access_token"
    }`,
    "If this says 'invalid_grant', the service account's clock-sensitive JWT " +
      "was rejected — check the key belongs to the account in " +
      "GOOGLE_ANALYTICS_CLIENT_EMAIL."
  );
}
ok(`Token issued, expires in ${tokenBody.expires_in}s`);

// ── 4. runReport ────────────────────────────────────────────────────────
step("4. runReport");

const reportRes = await fetch(
  `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${tokenBody.access_token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      limit: "10",
    }),
  }
);

if (reportRes.status === 403) {
  die(
    "403 PERMISSION_DENIED.",
    "The credentials are valid — the token issued fine — but the service " +
      `account has no access to property ${propertyId}. In GA4: Admin → ` +
      `Property access management → + → add ${clientEmail} with the Viewer ` +
      "role, and untick 'Notify new users by email'. This step is the one " +
      "almost everyone misses."
  );
}

if (!reportRes.ok) {
  die(`runReport failed (${reportRes.status}): ${await reportRes.text()}`);
}

const report = await reportRes.json();
const rows = report.rows ?? [];
ok(`runReport returned 200 with ${rows.length} row(s)`);

if (rows.length === 0) {
  console.log(
    "\n  \x1b[33m→ Connected, but the property has no data for the last 28 days.\x1b[0m\n" +
      "    That is expected if the tracking tag was only just installed — data\n" +
      "    shows up 24–48 hours after the first visit is collected."
  );
} else {
  console.log("\n  Top pages:");
  for (const r of rows.slice(0, 5)) {
    console.log(
      `    ${r.dimensionValues[0].value.padEnd(48)} ${r.metricValues[0].value}`
    );
  }
}

console.log("\n\x1b[32m\x1b[1mAll checks passed.\x1b[0m\n");
