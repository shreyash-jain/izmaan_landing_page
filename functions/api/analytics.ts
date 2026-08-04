// ── /api/analytics — Cloudflare Pages Function ──────────────────────────
// The site itself is a static export (next.config.mjs sets output:"export"),
// so there is no Next.js server and no route handler. Cloudflare Pages serves
// the static build from dist/ and deploys this file alongside it as a Workers
// function, which is where the service-account credentials live.
//
// Returns one JSON payload for the whole dashboard. Falls back to demo data
// when GA credentials are absent, so the UI is reviewable before the Google
// account exists.

import { readCredentials } from "../../lib/ga";
import { buildDemoPayload, type AnalyticsPayload } from "../../lib/analytics";
import { fetchLivePayload, CONTENT_PATH_PREFIX } from "../../lib/ga-reports";

// Minimal shape of the Pages Function context, declared locally so the repo
// doesn't need @cloudflare/workers-types as a dependency just for this.
type PagesContext = {
  request: Request;
  env: Record<string, string | undefined>;
  waitUntil: (promise: Promise<unknown>) => void;
};

declare const caches: {
  default: {
    match: (req: Request) => Promise<Response | undefined>;
    put: (req: Request, res: Response) => Promise<void>;
  };
};

const CACHE_SECONDS = 900; // GA4 has daily quotas and these numbers barely move.
const WINDOW_DAYS = 30;

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers ?? {}),
    },
  });
}

/** Length-independent-ish comparison, to avoid leaking the secret by timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Validates HTTP Basic credentials against ADMIN_USERNAME / ADMIN_PASSWORD.
 * Returns a 401 Response when the caller should be rejected, or null to allow.
 *
 * When neither variable is configured the endpoint is left open — that is the
 * local-development and demo-preview case, where there is nothing to protect.
 */
function checkAuth(context: PagesContext): Response | null {
  const user = context.env.ADMIN_USERNAME;
  const pass = context.env.ADMIN_PASSWORD;
  if (!user || !pass) return null;

  const header = context.request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) {
    return json({ error: "Authentication required." }, { status: 401 });
  }

  let decoded = "";
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return json({ error: "Malformed credentials." }, { status: 401 });
  }

  const sep = decoded.indexOf(":");
  const gotUser = sep === -1 ? decoded : decoded.slice(0, sep);
  const gotPass = sep === -1 ? "" : decoded.slice(sep + 1);

  // Both compared every time so a wrong username costs the same as a wrong
  // password.
  const ok = safeEqual(gotUser, user) && safeEqual(gotPass, pass);
  return ok ? null : json({ error: "Invalid credentials." }, { status: 401 });
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const denied = checkAuth(context);
  if (denied) return denied;

  const url = new URL(context.request.url);
  // Cache on the URL alone, deliberately ignoring the Authorization header:
  // every authenticated admin sees the same numbers, so one cached copy is
  // correct and keeps us well inside GA4's daily request quota.
  const cacheKey = new Request(`${url.origin}${url.pathname}`, {
    method: "GET",
  });

  const cached = await caches.default.match(cacheKey).catch(() => undefined);
  if (cached) return cached;

  const creds = readCredentials(context.env);
  let payload: AnalyticsPayload;

  if (!creds) {
    payload = buildDemoPayload(
      new Date().toISOString().slice(0, 10),
      WINDOW_DAYS
    );
  } else {
    try {
      payload = await fetchLivePayload(creds, WINDOW_DAYS);
    } catch (err) {
      // Surface the real reason — only authenticated admins see this, and the
      // 403-missing-property-access case is otherwise very hard to diagnose.
      return json(
        {
          error: err instanceof Error ? err.message : "Unknown error",
          demo: false,
          empty: false,
        },
        { status: 502, headers: { "cache-control": "no-store" } }
      );
    }
  }

  const response = json(
    { ...payload, scope: CONTENT_PATH_PREFIX || "whole site" },
    {
      headers: {
        "cache-control": `private, s-maxage=${CACHE_SECONDS}, max-age=60`,
      },
    }
  );

  context.waitUntil(
    caches.default.put(cacheKey, response.clone()).catch(() => {})
  );
  return response;
}
