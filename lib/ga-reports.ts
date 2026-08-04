// ── Live GA4 report assembly ────────────────────────────────────────────
// Runs the five dashboard reports in parallel against one access token and
// folds them into the same AnalyticsPayload shape the demo generator emits.

import {
  runReport,
  getAccessToken,
  isoDaysAgo,
  type GaCredentials,
} from "./ga";
import {
  rank,
  emptyPayload,
  type AnalyticsPayload,
  type DailyPoint,
  type PageRow,
  type Totals,
} from "./analytics";
import { lookupPath } from "./posts-registry.generated";

/**
 * The content section the dashboard reports on. GA's BEGINS_WITH match means
 * "/journal" covers both the index (/journal) and every post
 * (/journal/<slug>), while excluding the marketing homepage.
 *
 * Set to "" to report on the whole site instead — nothing else needs changing;
 * the UI reads its scope label from the payload.
 */
export const CONTENT_PATH_PREFIX = "/journal";

/** GA returns the `date` dimension as yyyymmdd. */
function formatGaDate(raw: string): string {
  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }
  return raw;
}

export async function fetchLivePayload(
  creds: GaCredentials,
  days = 30
): Promise<AnalyticsPayload> {
  const startDate = isoDaysAgo(days - 1);
  const endDate = isoDaysAgo(0);
  const token = await getAccessToken(creds);

  const base = {
    startDate,
    endDate,
    pathPrefix: CONTENT_PATH_PREFIX || undefined,
  };

  const [dailyRows, pageRows, countryRows, channelRows, deviceRows] =
    await Promise.all([
      runReport(creds, token, {
        ...base,
        dimensions: ["date"],
        metrics: [
          "activeUsers",
          "screenPageViews",
          "sessions",
          "newUsers",
          "averageSessionDuration",
          "engagementRate",
        ],
        limit: 400,
      }),
      runReport(creds, token, {
        ...base,
        dimensions: ["pagePath", "pageTitle"],
        metrics: ["screenPageViews", "activeUsers", "averageSessionDuration"],
        orderByMetric: "screenPageViews",
        limit: 200,
      }),
      runReport(creds, token, {
        ...base,
        dimensions: ["country"],
        metrics: ["activeUsers"],
        orderByMetric: "activeUsers",
        limit: 50,
      }),
      runReport(creds, token, {
        ...base,
        dimensions: ["sessionDefaultChannelGroup"],
        metrics: ["sessions"],
        orderByMetric: "sessions",
        limit: 30,
      }),
      runReport(creds, token, {
        ...base,
        dimensions: ["deviceCategory"],
        metrics: ["sessions"],
        orderByMetric: "sessions",
        limit: 10,
      }),
    ]);

  // A property that is collecting nothing yet returns zero rows everywhere.
  // That is a distinct state from "broken" and the UI says so.
  if (
    dailyRows.length === 0 &&
    pageRows.length === 0 &&
    countryRows.length === 0
  ) {
    return emptyPayload(startDate, endDate, days);
  }

  const daily: DailyPoint[] = dailyRows
    .map((r) => ({
      date: formatGaDate(r.dimensions.date),
      activeUsers: r.metrics.activeUsers,
      screenPageViews: r.metrics.screenPageViews,
      sessions: r.metrics.sessions,
      newUsers: r.metrics.newUsers,
      averageSessionDuration: r.metrics.averageSessionDuration,
      engagementRate: r.metrics.engagementRate,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const totalSessions = daily.reduce((a, d) => a + d.sessions, 0);
  const weighted = (key: "averageSessionDuration" | "engagementRate") =>
    totalSessions > 0
      ? daily.reduce((acc, d) => acc + d[key] * d.sessions, 0) / totalSessions
      : 0;

  const totals: Totals = {
    activeUsers: daily.reduce((a, d) => a + d.activeUsers, 0),
    screenPageViews: daily.reduce((a, d) => a + d.screenPageViews, 0),
    sessions: totalSessions,
    newUsers: daily.reduce((a, d) => a + d.newUsers, 0),
    averageSessionDuration: Math.round(weighted("averageSessionDuration")),
    engagementRate: weighted("engagementRate"),
  };

  // GA can report the same logical page under several paths (trailing slash,
  // query strings). Fold them together before the registry join.
  const merged = new Map<string, PageRow>();
  for (const row of pageRows) {
    const rawPath = row.dimensions.pagePath || "/";
    const entry = lookupPath(rawPath);
    const path = entry?.path ?? rawPath.split("?")[0];
    const existing = merged.get(path);

    const views = row.metrics.screenPageViews;
    const users = row.metrics.activeUsers;
    const dur = row.metrics.averageSessionDuration;

    if (existing) {
      // Duration is an average — re-weight it by pageviews as rows combine.
      const totalViews = existing.screenPageViews + views;
      existing.averageSessionDuration =
        totalViews > 0
          ? (existing.averageSessionDuration * existing.screenPageViews +
              dur * views) /
            totalViews
          : 0;
      existing.screenPageViews = totalViews;
      existing.activeUsers += users;
      continue;
    }

    merged.set(path, {
      path,
      // Prefer our own title: GA records whatever <title> was live when the
      // page was crawled, so it carries stale titles and " | Izmaan Lodge"
      // suffixes. Fall back to GA's only for paths we don't recognise.
      title: entry?.title ?? row.dimensions.pageTitle ?? path,
      category: entry?.category ?? "Unknown",
      slug: entry?.slug ?? null,
      known: Boolean(entry),
      screenPageViews: views,
      activeUsers: users,
      averageSessionDuration: dur,
    });
  }

  const pages = [...merged.values()]
    .map((p) => ({
      ...p,
      averageSessionDuration: Math.round(p.averageSessionDuration),
    }))
    .sort((a, b) => b.screenPageViews - a.screenPageViews);

  return {
    demo: false,
    empty: false,
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate, days },
    totals,
    daily,
    pages,
    countries: rank(
      countryRows.map((r) => ({
        name: r.dimensions.country || "(not set)",
        value: r.metrics.activeUsers,
      }))
    ),
    channels: rank(
      channelRows.map((r) => ({
        name: r.dimensions.sessionDefaultChannelGroup || "(not set)",
        value: r.metrics.sessions,
      }))
    ),
    devices: rank(
      deviceRows.map((r) => ({
        name: r.dimensions.deviceCategory || "(not set)",
        value: r.metrics.sessions,
      }))
    ),
  };
}
