// ── Google Analytics 4 Data API client ──────────────────────────────────
// Deliberately does NOT use @google-analytics/data: that SDK speaks gRPC and
// pulls in Node built-ins, so it cannot run on the Cloudflare Workers runtime
// that serves /api/analytics. This talks to the REST endpoint over plain fetch
// and signs its own service-account JWT, so it runs anywhere fetch + WebCrypto
// exist (Workers, Node 18+, Deno).
//
// Flow: sign RS256 JWT → exchange at oauth2.googleapis.com → runReport.

import { SignJWT, importPKCS8 } from "jose";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

export type GaCredentials = {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
};

/** Reads credentials from an env bag. Returns null when any are absent —
 *  the caller then falls back to demo data rather than throwing. */
export function readCredentials(
  env: Record<string, string | undefined>
): GaCredentials | null {
  const propertyId = env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
  const clientEmail = env.GOOGLE_ANALYTICS_CLIENT_EMAIL?.trim();
  const privateKey = env.GOOGLE_ANALYTICS_PRIVATE_KEY;
  if (!propertyId || !clientEmail || !privateKey) return null;
  return { propertyId, clientEmail, privateKey };
}

/** Service-account private keys arrive in two shapes depending on where they
 *  were pasted: a .env file keeps the literal two-character `\n` sequences,
 *  while a hosting dashboard usually stores real newlines. Normalise both to
 *  real newlines so importPKCS8 accepts either. Surrounding quotes are also
 *  stripped — pasting the JSON value *with* its quotes is a common slip. */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").trim();
}

// Access tokens last an hour. Module scope persists across requests on a warm
// isolate, so this saves a signing round-trip on most calls; a cold isolate
// simply mints a new one.
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(creds: GaCredentials): Promise<string> {
  // 60s safety margin so a token can't expire mid-flight.
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const pem = normalizePrivateKey(creds.privateKey);
  if (!pem.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error(
      "GOOGLE_ANALYTICS_PRIVATE_KEY is missing its '-----BEGIN PRIVATE KEY-----' " +
        "header. Copy the whole private_key value from the service-account JSON, " +
        "including the header and footer lines."
    );
  }

  let key: CryptoKey | Uint8Array;
  try {
    key = await importPKCS8(pem, "RS256");
  } catch (err) {
    throw new Error(
      `GOOGLE_ANALYTICS_PRIVATE_KEY could not be parsed as a PKCS#8 key: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(creds.clientEmail)
    .setSubject(creds.clientEmail)
    .setAudience(TOKEN_URL)
    .setIssuedAt(nowSec)
    .setExpirationTime(nowSec + 3600)
    .sign(key);

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  } | null;

  if (!res.ok || !body?.access_token) {
    throw new Error(
      `Token exchange failed (${res.status}): ${
        body?.error_description || body?.error || "no access_token returned"
      }`
    );
  }

  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/** Test seam — lets the verification script prove a cold token exchange. */
export function clearTokenCache(): void {
  cachedToken = null;
}

// ── runReport ───────────────────────────────────────────────────────────

export type ReportRequest = {
  dimensions: string[];
  metrics: string[];
  startDate: string;
  endDate: string;
  /** Restricts the report to one content section, e.g. "/journal/". */
  pathPrefix?: string;
  orderByMetric?: string;
  limit?: number;
};

/** A report flattened to plain rows: dimension values + numeric metric values,
 *  both keyed by API name. */
export type ReportRow = {
  dimensions: Record<string, string>;
  metrics: Record<string, number>;
};

export async function runReport(
  creds: GaCredentials,
  token: string,
  req: ReportRequest
): Promise<ReportRow[]> {
  const payload: Record<string, unknown> = {
    dateRanges: [{ startDate: req.startDate, endDate: req.endDate }],
    dimensions: req.dimensions.map((name) => ({ name })),
    metrics: req.metrics.map((name) => ({ name })),
    limit: String(req.limit ?? 250),
  };

  if (req.pathPrefix) {
    payload.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: { matchType: "BEGINS_WITH", value: req.pathPrefix },
      },
    };
  }

  if (req.orderByMetric) {
    payload.orderBys = [
      { metric: { metricName: req.orderByMetric }, desc: true },
    ];
  }

  const res = await fetch(
    `${DATA_API}/properties/${creds.propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (res.status === 403) {
      // Two unrelated problems both surface as 403 here, and pointing at the
      // wrong one sends you to the wrong console. Distinguish them.
      if (/SERVICE_DISABLED|has not been used in project|is disabled/i.test(text)) {
        throw new Error(
          `The Google Analytics Data API is not enabled in this Google Cloud ` +
            `project. This is not a permissions problem — enable it at ` +
            `console.cloud.google.com/apis/library/analyticsdata.googleapis.com ` +
            `and wait a minute for it to propagate. ${text}`
        );
      }
      throw new Error(
        `403 PERMISSION_DENIED from the GA4 Data API. The token issued fine, so ` +
          `the credentials are valid — but the service account has not been added ` +
          `to property ${creds.propertyId}. In GA4: Admin → Property access ` +
          `management → + → add ${creds.clientEmail} with the Viewer role. ${text}`
      );
    }
    throw new Error(`runReport failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {
    rows?: Array<{
      dimensionValues?: Array<{ value?: string }>;
      metricValues?: Array<{ value?: string }>;
    }>;
  };

  return (data.rows ?? []).map((row) => {
    const dimensions: Record<string, string> = {};
    req.dimensions.forEach((name, i) => {
      dimensions[name] = row.dimensionValues?.[i]?.value ?? "";
    });
    const metrics: Record<string, number> = {};
    req.metrics.forEach((name, i) => {
      metrics[name] = Number(row.metricValues?.[i]?.value ?? 0) || 0;
    });
    return { dimensions, metrics };
  });
}

/** yyyy-mm-dd for `daysAgo` days before now, in UTC. */
export function isoDaysAgo(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86_400_000);
  return d.toISOString().slice(0, 10);
}
