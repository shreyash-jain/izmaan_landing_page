// ── Analytics payload shape + demo-data generator ───────────────────────
// The demo generator produces data of the *identical* shape to the live GA4
// path, so the entire dashboard can be built and reviewed before the Google
// account exists — and switches to real data on environment variables alone,
// with no code change.
//
// Numbers come from a seeded PRNG keyed to the date, so they hold still
// between refreshes instead of shuffling on every page load.

import { POST_REGISTRY, type RegistryEntry } from "./posts-registry.generated";

export type DailyPoint = {
  date: string; // yyyy-mm-dd
  activeUsers: number;
  screenPageViews: number;
  sessions: number;
  newUsers: number;
  averageSessionDuration: number; // seconds
  engagementRate: number; // 0..1
};

export type PageRow = {
  path: string;
  /** Our own title from the content registry where we have one, GA's otherwise. */
  title: string;
  category: string;
  slug: string | null;
  /** False when GA reported a path the registry doesn't know (e.g. a deleted post). */
  known: boolean;
  screenPageViews: number;
  activeUsers: number;
  averageSessionDuration: number;
};

export type RankedRow = {
  name: string;
  value: number;
  share: number; // 0..1 of the total
};

export type Totals = {
  activeUsers: number;
  screenPageViews: number;
  sessions: number;
  newUsers: number;
  averageSessionDuration: number;
  engagementRate: number;
};

export type AnalyticsPayload = {
  /** True when serving invented data because credentials are absent. */
  demo: boolean;
  /** True when credentials work but GA returned no rows at all. */
  empty: boolean;
  generatedAt: string;
  range: { startDate: string; endDate: string; days: number };
  totals: Totals;
  daily: DailyPoint[];
  pages: PageRow[];
  countries: RankedRow[];
  channels: RankedRow[];
  devices: RankedRow[];
};

// ── helpers ─────────────────────────────────────────────────────────────

/** Turns a list of {name,value} into ranked rows with shares, biggest first. */
export function rank(
  rows: Array<{ name: string; value: number }>
): RankedRow[] {
  const total = rows.reduce((sum, r) => sum + r.value, 0);
  return rows
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((r) => ({ ...r, share: total > 0 ? r.value / total : 0 }));
}

// ── seeded PRNG (mulberry32) ────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash so a string can seed the PRNG. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ── demo data ───────────────────────────────────────────────────────────

const DEMO_COUNTRIES = [
  "South Africa",
  "Mozambique",
  "United Kingdom",
  "Zimbabwe",
  "Germany",
  "Netherlands",
  "United States",
  "Portugal",
  "Botswana",
  "France",
];

const DEMO_CHANNELS = [
  "Organic Search",
  "Direct",
  "Organic Social",
  "Referral",
  "Organic Video",
  "Email",
];

const DEMO_DEVICES = ["mobile", "desktop", "tablet"];

/**
 * Builds a realistic 30-day dataset for a small lodge blog. `todayIso` is
 * passed in rather than read from the clock so callers (and tests) control it.
 */
export function buildDemoPayload(
  todayIso: string,
  days = 30,
  posts: RegistryEntry[] = POST_REGISTRY
): AnalyticsPayload {
  const end = new Date(`${todayIso}T00:00:00Z`);
  const daily: DailyPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    const rnd = mulberry32(hash(iso));

    // Weekends run lighter; a gentle upward trend across the window.
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6 ? 0.72 : 1;
    const trend = 0.75 + (0.5 * (days - i)) / days;

    const activeUsers = Math.max(
      3,
      Math.round((18 + rnd() * 26) * weekend * trend)
    );
    const sessions = Math.round(activeUsers * (1.1 + rnd() * 0.25));
    const screenPageViews = Math.round(sessions * (1.6 + rnd() * 0.8));
    const newUsers = Math.round(activeUsers * (0.62 + rnd() * 0.2));

    daily.push({
      date: iso,
      activeUsers,
      sessions,
      screenPageViews,
      newUsers,
      averageSessionDuration: Math.round(95 + rnd() * 130),
      engagementRate: 0.52 + rnd() * 0.26,
    });
  }

  const sum = (key: keyof DailyPoint) =>
    daily.reduce((acc, d) => acc + (d[key] as number), 0);

  // Duration and rate are averages, not sums — weight them by sessions so the
  // headline figure matches how GA reports it.
  const totalSessions = sum("sessions");
  const weighted = (key: "averageSessionDuration" | "engagementRate") =>
    totalSessions > 0
      ? daily.reduce((acc, d) => acc + d[key] * d.sessions, 0) / totalSessions
      : 0;

  const totals: Totals = {
    activeUsers: sum("activeUsers"),
    screenPageViews: sum("screenPageViews"),
    sessions: totalSessions,
    newUsers: sum("newUsers"),
    averageSessionDuration: Math.round(weighted("averageSessionDuration")),
    engagementRate: weighted("engagementRate"),
  };

  // Distribute pageviews across real posts, newest-and-featured skewing higher.
  const totalViews = totals.screenPageViews;
  const weights = posts.map((p, i) => {
    const rnd = mulberry32(hash(p.slug));
    return (1 / (i + 1.4)) * (0.7 + rnd() * 0.6);
  });
  // The journal index takes a slice before the posts split the rest. The
  // marketing homepage is deliberately absent: live reports are filtered to
  // the content section (see CONTENT_PATH_PREFIX), so it would not appear
  // there either, and demo data must mirror the live shape exactly.
  const chromeShare = 0.16;
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

  const pages: PageRow[] = posts.map((p, i) => {
    const rnd = mulberry32(hash(`${p.slug}:page`));
    const views = Math.max(
      0,
      Math.round((totalViews * (1 - chromeShare) * weights[i]) / weightSum)
    );
    return {
      path: p.path,
      title: p.title,
      category: p.category,
      slug: p.slug,
      known: true,
      screenPageViews: views,
      activeUsers: Math.round(views * (0.68 + rnd() * 0.14)),
      averageSessionDuration: Math.round(120 + rnd() * 190),
    };
  });

  const indexViews = Math.round(totalViews * chromeShare);
  pages.unshift({
    path: "/journal",
    title: "Journal",
    category: "Page",
    slug: "journal",
    known: true,
    screenPageViews: indexViews,
    activeUsers: Math.round(indexViews * 0.79),
    averageSessionDuration: 64,
  });
  pages.sort((a, b) => b.screenPageViews - a.screenPageViews);

  const spread = (names: string[], total: number, seedTag: string) => {
    const rnd = mulberry32(hash(seedTag));
    const raw = names.map((_, i) => (1 / (i + 1.2)) * (0.75 + rnd() * 0.5));
    const rawSum = raw.reduce((a, b) => a + b, 0);
    return names.map((name, i) => ({
      name,
      value: Math.round((total * raw[i]) / rawSum),
    }));
  };

  return {
    demo: true,
    empty: false,
    generatedAt: new Date().toISOString(),
    range: { startDate: daily[0].date, endDate: daily[daily.length - 1].date, days },
    totals,
    daily,
    pages,
    countries: rank(spread(DEMO_COUNTRIES, totals.activeUsers, "countries")),
    channels: rank(spread(DEMO_CHANNELS, totals.sessions, "channels")),
    devices: rank(spread(DEMO_DEVICES, totals.sessions, "devices")),
  };
}

/** The shape returned when credentials are valid but the property has no data. */
export function emptyPayload(
  startDate: string,
  endDate: string,
  days: number
): AnalyticsPayload {
  return {
    demo: false,
    empty: true,
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate, days },
    totals: {
      activeUsers: 0,
      screenPageViews: 0,
      sessions: 0,
      newUsers: 0,
      averageSessionDuration: 0,
      engagementRate: 0,
    },
    daily: [],
    pages: [],
    countries: [],
    channels: [],
    devices: [],
  };
}
