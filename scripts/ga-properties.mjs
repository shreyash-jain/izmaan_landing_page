// Lists every GA4 property a service account can read, with property IDs.
//
//   node scripts/ga-properties.mjs path/to/service-account.json
//   node scripts/ga-properties.mjs            # uses .env.local / .env instead
//
// Useful because the property ID is the value people most often get wrong —
// this prints it directly instead of making you find it in the GA4 UI. Also
// doubles as an access check: if a property isn't listed here, the service
// account has not been added to it under Property access management.
//
// Read-only. Calls the Admin API only; it never touches event data.

import { readFileSync, existsSync } from "node:fs";
import { SignJWT, importPKCS8 } from "jose";

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let [, k, v] = m;
      v = v.trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const keyPath = process.argv[2];
let clientEmail, privateKey;

if (keyPath) {
  if (!existsSync(keyPath)) {
    console.error(`\x1b[31m✗\x1b[0m No such file: ${keyPath}`);
    process.exit(1);
  }
  const json = JSON.parse(readFileSync(keyPath, "utf8"));
  clientEmail = json.client_email;
  privateKey = json.private_key;
  if (!clientEmail || !privateKey) {
    console.error(
      `\x1b[31m✗\x1b[0m ${keyPath} has no client_email/private_key — is it a service-account JSON key?`
    );
    process.exit(1);
  }
} else {
  loadEnvFiles();
  clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL?.trim();
  privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY;
  if (!clientEmail || !privateKey) {
    console.error(
      "\x1b[31m✗\x1b[0m Pass a service-account JSON path, or set " +
        "GOOGLE_ANALYTICS_CLIENT_EMAIL / GOOGLE_ANALYTICS_PRIVATE_KEY in .env.local"
    );
    process.exit(1);
  }
}

let pem = privateKey.trim();
if ((pem.startsWith('"') && pem.endsWith('"')) || (pem.startsWith("'") && pem.endsWith("'"))) {
  pem = pem.slice(1, -1);
}
pem = pem.replace(/\\n/g, "\n").trim();

console.log(`\nService account: \x1b[1m${clientEmail}\x1b[0m`);

const key = await importPKCS8(pem, "RS256");
const now = Math.floor(Date.now() / 1000);
const assertion = await new SignJWT({ scope: SCOPE })
  .setProtectedHeader({ alg: "RS256", typ: "JWT" })
  .setIssuer(clientEmail)
  .setSubject(clientEmail)
  .setAudience(TOKEN_URL)
  .setIssuedAt(now)
  .setExpirationTime(now + 3600)
  .sign(key);

const tokenRes = await fetch(TOKEN_URL, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  }),
});
const token = await tokenRes.json();
if (!token.access_token) {
  console.error(
    `\x1b[31m✗\x1b[0m Token exchange failed (${tokenRes.status}): ` +
      `${token.error_description || token.error}`
  );
  process.exit(1);
}
console.log("\x1b[32m✓\x1b[0m Credentials valid\n");

const res = await fetch(
  "https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200",
  { headers: { authorization: `Bearer ${token.access_token}` } }
);
const body = await res.json();

if (res.status === 403) {
  console.error(
    "\x1b[31m✗\x1b[0m 403 from the Admin API.\n\n" +
      "  \x1b[33m→ Enable the 'Google Analytics Admin API' in the same Google Cloud\n" +
      "    project as this service account, then try again. (The dashboard itself\n" +
      "    only needs the Data API — this listing is the extra one.)\x1b[0m"
  );
  process.exit(1);
}
if (!res.ok) {
  console.error(`\x1b[31m✗\x1b[0m Admin API ${res.status}: ${JSON.stringify(body).slice(0, 500)}`);
  process.exit(1);
}

const accounts = body.accountSummaries ?? [];
if (accounts.length === 0) {
  console.log(
    "\x1b[33mThis service account can see ZERO GA4 properties.\x1b[0m\n\n" +
      "  That is expected until someone adds it. In GA4 → Admin →\n" +
      `  Property access management → + → add\n    ${clientEmail}\n` +
      "  with the \x1b[1mViewer\x1b[0m role, then run this again."
  );
  process.exit(0);
}

for (const acct of accounts) {
  console.log(`\x1b[1m${acct.displayName}\x1b[0m  (${acct.account})`);
  for (const p of acct.propertySummaries ?? []) {
    const id = p.property.replace("properties/", "");
    console.log(`   GOOGLE_ANALYTICS_PROPERTY_ID=\x1b[36m${id}\x1b[0m   ${p.displayName}`);
  }
  console.log();
}
console.log("Copy the property ID above into .env.local, then run: npm run verify:ga\n");
