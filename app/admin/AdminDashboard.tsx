"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsPayload, PageRow, RankedRow } from "@/lib/analytics";

const AUTH_KEY = "izmaan:admin:auth";

type RegistryPost = {
  slug: string;
  path: string;
  title: string;
  category: string;
  date: string;
};

type Payload = AnalyticsPayload & { scope?: string };

type Status =
  | { kind: "booting" }
  | { kind: "login"; error?: string; busy?: boolean }
  | { kind: "loading" }
  | { kind: "ready"; data: Payload }
  | { kind: "error"; message: string };

// ── formatting ──────────────────────────────────────────────────────────

const nf = new Intl.NumberFormat("en-GB");

function num(n: number): string {
  return nf.format(Math.round(n));
}

function duration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function percent(fraction: number, dp = 0): string {
  return `${(fraction * 100).toFixed(dp)}%`;
}

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

// ── auth helpers ────────────────────────────────────────────────────────

async function requestPayload(basic: string | null): Promise<Response> {
  return fetch("/api/analytics", {
    headers: basic ? { authorization: `Basic ${basic}` } : {},
    cache: "no-store",
  });
}

// ── component ───────────────────────────────────────────────────────────

export function AdminDashboard({ posts }: { posts: RegistryPost[] }) {
  const [status, setStatus] = useState<Status>({ kind: "booting" });

  const load = useCallback(async (basic: string | null): Promise<Status> => {
    try {
      const res = await requestPayload(basic);
      if (res.status === 401) return { kind: "login" };
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        return {
          kind: "error",
          message:
            body?.error ?? `The analytics service returned ${res.status}.`,
        };
      }
      return { kind: "ready", data: (await res.json()) as Payload };
    } catch {
      return {
        kind: "error",
        message:
          "Could not reach the analytics service. Check your connection and try again.",
      };
    }
  }, []);

  // localStorage is read *inside* the effect rather than during render. Reading
  // it at render time would disagree with the prerendered HTML (this is a
  // static export) and hydrate wrong; snapshot-style hooks have the same
  // problem, where the first render sees the server value and any effect
  // created in that render acts on a stale "logged out".
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = window.localStorage.getItem(AUTH_KEY);
      // With no stored credentials, try anyway: when ADMIN_USERNAME /
      // ADMIN_PASSWORD are unset the endpoint is open and there is nothing to
      // log in to.
      const next = await load(stored);
      if (!cancelled) setStatus(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const signIn = useCallback(
    async (username: string, password: string) => {
      setStatus({ kind: "login", busy: true });
      const basic = btoa(`${username}:${password}`);
      const next = await load(basic);
      if (next.kind === "login") {
        setStatus({ kind: "login", error: "Wrong username or password." });
        return;
      }
      window.localStorage.setItem(AUTH_KEY, basic);
      setStatus(next);
    },
    [load]
  );

  const signOut = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY);
    setStatus({ kind: "login" });
  }, []);

  const retry = useCallback(async () => {
    setStatus({ kind: "loading" });
    const stored = window.localStorage.getItem(AUTH_KEY);
    setStatus(await load(stored));
  }, [load]);

  if (status.kind === "booting" || status.kind === "loading") {
    return <Centered>{<Spinner />}</Centered>;
  }

  if (status.kind === "login") {
    return (
      <LoginForm
        error={status.error}
        busy={status.busy}
        onSubmit={signIn}
      />
    );
  }

  if (status.kind === "error") {
    return (
      <Centered>
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-card">
          <h1 className="font-heading text-xl font-semibold text-deepsea">
            Analytics unavailable
          </h1>
          <p className="mt-3 break-words font-body text-[15px] leading-relaxed text-deepsea/70">
            {status.message}
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-6 rounded-full bg-coral px-6 py-3 font-heading text-sm font-semibold text-white transition hover:bg-coral-deep"
          >
            Try again
          </button>
        </div>
      </Centered>
    );
  }

  return (
    <Dashboard data={status.data} posts={posts} onSignOut={signOut} onRefresh={retry} />
  );
}

// ── shell pieces ────────────────────────────────────────────────────────

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sand px-5 py-16">
      {children}
    </main>
  );
}

function Spinner() {
  return (
    <div
      role="status"
      aria-label="Loading analytics"
      className="h-10 w-10 animate-spin rounded-full border-[3px] border-mist border-t-teal"
    />
  );
}

function LoginForm({
  error,
  busy,
  onSubmit,
}: {
  error?: string;
  busy?: boolean;
  onSubmit: (username: string, password: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Centered>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!busy) onSubmit(username, password);
        }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card"
      >
        <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">
          Izmaan Lodge
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-deepsea">
          Analytics
        </h1>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-deepsea/60">
          Sign in to see how the journal is performing.
        </p>

        <label className="mt-6 block font-body text-[13px] font-medium text-deepsea/80">
          Username
          <input
            type="text"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist bg-sand px-4 py-3 font-body text-[15px] text-deepsea outline-none transition focus:border-teal"
          />
        </label>

        <label className="mt-4 block font-body text-[13px] font-medium text-deepsea/80">
          Password
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-mist bg-sand px-4 py-3 font-body text-[15px] text-deepsea outline-none transition focus:border-teal"
          />
        </label>

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-coral/10 px-4 py-3 font-body text-[13px] text-coral-deep"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-coral px-6 py-3 font-heading text-sm font-semibold text-white transition hover:bg-coral-deep disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </Centered>
  );
}

// ── dashboard ───────────────────────────────────────────────────────────

function Dashboard({
  data,
  posts,
  onSignOut,
  onRefresh,
}: {
  data: Payload;
  posts: RegistryPost[];
  onSignOut: () => void;
  onRefresh: () => void;
}) {
  const topCountry = data.countries[0];

  // Posts GA has no rows for are still ours — list them at zero rather than
  // letting them vanish, which would read as "we have no such post".
  const seen = new Set(data.pages.map((p) => p.path));
  const missing: PageRow[] = posts
    .filter((p) => !seen.has(p.path))
    .map((p) => ({
      path: p.path,
      title: p.title,
      category: p.category,
      slug: p.slug,
      known: true,
      screenPageViews: 0,
      activeUsers: 0,
      averageSessionDuration: 0,
    }));
  const leaderboard = [...data.pages, ...missing].sort(
    (a, b) => b.screenPageViews - a.screenPageViews
  );

  return (
    <main className="min-h-screen bg-sand px-5 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-content">
        {data.demo ? <DemoBanner /> : null}

        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.22em] text-teal">
              Izmaan Lodge
            </p>
            <h1 className="mt-1.5 font-heading text-[28px] font-semibold leading-tight text-deepsea sm:text-[34px]">
              Content analytics
            </h1>
            <p className="mt-2 font-body text-[14px] text-deepsea/60">
              {data.range.days} days · {shortDate(data.range.startDate)} –{" "}
              {shortDate(data.range.endDate)}
              {data.scope ? ` · ${data.scope}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-full border border-mist bg-white px-5 py-2.5 font-heading text-[13px] font-semibold text-deepsea transition hover:border-teal"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-full border border-transparent px-4 py-2.5 font-heading text-[13px] font-semibold text-deepsea/55 transition hover:text-deepsea"
            >
              Sign out
            </button>
          </div>
        </header>

        {data.empty ? (
          <EmptyState />
        ) : (
          <>
            <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi
                label="Readers"
                value={num(data.totals.activeUsers)}
                sub={`${num(data.totals.newUsers)} new`}
              />
              <Kpi
                label="Pageviews"
                value={num(data.totals.screenPageViews)}
                sub={`${num(data.totals.sessions)} sessions`}
              />
              <Kpi
                label="Engagement"
                value={percent(data.totals.engagementRate)}
                sub={`${duration(data.totals.averageSessionDuration)} average`}
              />
              <Kpi
                label="Top region"
                value={topCountry?.name ?? "—"}
                sub={
                  topCountry
                    ? `${percent(topCountry.share)} of readers`
                    : "No data yet"
                }
              />
            </section>

            <TrendChart daily={data.daily} />

            {/* items-start so a short panel (three devices) keeps its natural
                height instead of stretching to match a six-row neighbour. */}
            <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              <Panel title="Devices">
                <BarList rows={data.devices} labelCase="capitalize" />
              </Panel>
              <Panel title="How they arrive">
                <BarList rows={data.channels} />
              </Panel>
              <Panel title="Where they are">
                <BarList rows={data.countries} limit={6} />
              </Panel>
            </div>

            <Leaderboard rows={leaderboard} />
          </>
        )}

        <p className="mt-10 text-center font-body text-[12px] text-deepsea/40">
          Updated {new Date(data.generatedAt).toLocaleString("en-GB")} · cached
          for 15 minutes
        </p>
      </div>
    </main>
  );
}

function DemoBanner() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-golden bg-golden/20 px-5 py-4">
      <span className="rounded-full bg-deepsea px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-golden">
        Demo data
      </span>
      <p className="font-body text-[14px] leading-relaxed text-deepsea/80">
        These numbers are invented. Add the Google Analytics environment
        variables and this switches to live data automatically.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-card">
      <h2 className="font-heading text-xl font-semibold text-deepsea">
        Connected — but no data yet
      </h2>
      <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed text-deepsea/70">
        The Google Analytics credentials are working, and the property returned
        no rows for this period. That is normal for a property that was set up
        recently: data appears about 24–48 hours after the tracking tag first
        collects a visit.
      </p>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-soft">
      <p className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-deepsea/45">
        {label}
      </p>
      <p
        className="mt-2 truncate font-heading text-[30px] font-semibold leading-none text-deepsea"
        title={value}
      >
        {value}
      </p>
      <p className="mt-2 truncate font-body text-[13px] text-deepsea/55" title={sub}>
        {sub}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-soft">
      <h2 className="font-heading text-[15px] font-semibold text-deepsea">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function BarList({
  rows,
  limit = 8,
  labelCase,
}: {
  rows: RankedRow[];
  limit?: number;
  labelCase?: "capitalize";
}) {
  if (rows.length === 0) {
    return (
      <p className="font-body text-[14px] text-deepsea/45">Nothing recorded.</p>
    );
  }
  return (
    <ul className="space-y-3.5">
      {rows.slice(0, limit).map((row) => (
        <li key={row.name}>
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`min-w-0 truncate font-body text-[14px] text-deepsea/80 ${
                labelCase === "capitalize" ? "capitalize" : ""
              }`}
              title={row.name}
            >
              {row.name}
            </span>
            <span className="shrink-0 font-heading text-[13px] font-semibold tabular-nums text-deepsea/55">
              {percent(row.share)}
            </span>
          </div>
          <div
            className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-mist/60"
            role="progressbar"
            aria-label={row.name}
            aria-valuenow={Math.round(row.share * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-teal"
              style={{ width: `${Math.max(row.share * 100, 1.5)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function TrendChart({ daily }: { daily: Payload["daily"] }) {
  if (daily.length === 0) return null;
  const peak = Math.max(...daily.map((d) => d.activeUsers), 1);

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-[15px] font-semibold text-deepsea">
          Readers per day
        </h2>
        <p className="font-body text-[12px] text-deepsea/45">
          Peak {num(peak)} on a single day
        </p>
      </div>

      {/* Hand-rolled with flex — a charting library would cost more bytes than
          the whole page for one bar chart. */}
      <div className="mt-6 flex h-44 items-end gap-[3px] sm:gap-1.5">
        {daily.map((d) => (
          <div
            key={d.date}
            className="group relative flex h-full min-w-0 flex-1 items-end"
            title={`${shortDate(d.date)} · ${num(d.activeUsers)} readers · ${num(
              d.screenPageViews
            )} views`}
          >
            <div
              className="w-full rounded-t-[3px] bg-teal/75 transition-colors group-hover:bg-teal"
              style={{
                height: `${Math.max((d.activeUsers / peak) * 100, 2)}%`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-between font-body text-[11px] text-deepsea/40">
        <span>{shortDate(daily[0].date)}</span>
        {daily.length > 2 ? (
          <span className="hidden sm:inline">
            {shortDate(daily[Math.floor(daily.length / 2)].date)}
          </span>
        ) : null}
        <span>{shortDate(daily[daily.length - 1].date)}</span>
      </div>
    </section>
  );
}

function Leaderboard({ rows }: { rows: PageRow[] }) {
  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-soft">
      <h2 className="font-heading text-[15px] font-semibold text-deepsea">
        Every page, most read first
      </h2>

      {rows.length === 0 ? (
        <p className="mt-5 font-body text-[14px] text-deepsea/45">
          No pages recorded in this period.
        </p>
      ) : (
        <div className="-mx-6 mt-5 overflow-x-auto px-6">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-mist text-left">
                <Th>Page</Th>
                <Th align="right">Views</Th>
                <Th align="right">Readers</Th>
                <Th align="right">Avg. time</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.path}
                  className="border-b border-mist/50 last:border-0"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex max-w-[520px] flex-wrap items-center gap-x-2.5 gap-y-1">
                      <a
                        href={row.path}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 break-words font-body text-[14px] font-medium leading-snug text-deepsea underline-offset-2 hover:underline"
                      >
                        {row.title}
                      </a>
                      <Badge known={row.known}>{row.category}</Badge>
                    </div>
                    <p className="mt-0.5 truncate font-body text-[12px] text-deepsea/40">
                      {row.path}
                    </p>
                  </td>
                  <Td>{num(row.screenPageViews)}</Td>
                  <Td>{num(row.activeUsers)}</Td>
                  <Td>
                    {row.screenPageViews === 0
                      ? "—"
                      : duration(row.averageSessionDuration)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      scope="col"
      className={`pb-2.5 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-deepsea/40 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="whitespace-nowrap py-3.5 text-right font-heading text-[14px] font-semibold tabular-nums text-deepsea/75">
      {children}
    </td>
  );
}

function Badge({
  children,
  known,
}: {
  children: React.ReactNode;
  known: boolean;
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${
        known ? "bg-mist text-teal-deep" : "bg-deepsea/8 text-deepsea/50"
      }`}
      title={known ? undefined : "GA reported a path that isn't in the content registry"}
    >
      {children}
    </span>
  );
}
