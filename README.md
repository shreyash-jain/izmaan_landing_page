# Izmaan Lodge (Iz-Ma-An Lodge)

Marketing site for **Iz-Ma-An Lodge** — a luxury self-catering beachfront lodge in
Pomene, Mozambique. Built with **Next.js (App Router) + TypeScript + Tailwind**,
with a file-based Markdown blog.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Design system

Brand palette (`tailwind.config.ts`): `sand #FBF7EF` (bg), `teal #16B5AC`
(brand), `coral #FF7A59` (**CTAs only**), `deepsea #0B3A40` (text), `mist
#CFEAE7` (tints), `golden #F6C56B` (highlights). Fonts: **Poppins** (headings) +
**Inter** (body) via `next/font`.

## Blog / CMS (no-code posts)

Drop a Markdown file into `content/blog/`. Frontmatter:

```markdown
---
title: "Headline"
description: "SEO + card summary."
category: "Travel Guide"
date: "2026-07-01"
updated: "2026-07-02"        # optional
readingTime: "8 min read"    # optional — auto-estimated
featured: true               # optional — homepage hero card
cover: "/images/blog/my-post.jpg"   # optional
keywords: ["pomene", "..."]  # optional — meta + schema
faq:                          # optional — renders + emits FAQPage schema
  - q: "Question?"
    a: "Answer."
---

Markdown body…
```

Posts appear on `/journal`, get their own page + Article/FAQ JSON-LD, and join the
sitemap automatically.

## Images

- **Real lodge photos** live in `public/images/lodge/` + `lodge-real-*.jpg`
  (owner originals from the owners' online listing and the LAM/Índico press feature).
- **Atmosphere/AI images** (ocean, reef, activities, blog covers) live in
  `public/images/`. See `AI-IMAGE-PROMPTS.md` for the Gemini prompt pack — generate,
  drop in over the same filename, rebuild.
- All images go through `next/image` (AVIF/WebP, lazy, responsive).

## Launch-critical config — `lib/site.ts`

- **Bookings & availability** → all handled over WhatsApp (no third-party
  booking engine). "Check availability" pre-fills a WhatsApp message to the
  owner from the visitor's own phone.
- **WhatsApp** → ⚠️ currently `+27 82 374 4676` (SA). KT also lists `+258 84 570
  5769` (MZ) — verify before launch.
- **Brand name / canonical URL** → `Izmaan Lodge` / `https://izmaanlodge.co`.
  (`izmaan.co.za` is the old single-page site this rebuild replaces — not ours.)

## Analytics dashboard — `/admin`

A password-gated dashboard showing how the journal is performing: readers,
pageviews, engagement, a 30-day trend, device / channel / country splits, and a
per-post leaderboard.

The site is a **static export**, so there is no Next.js server and no API route.
The data comes from a **Cloudflare Pages Function** at
[`functions/api/analytics.ts`](functions/api/analytics.ts), which Pages deploys
alongside the static build. It signs a service-account JWT and calls the GA4
Data API over plain `fetch` — deliberately not the official
`@google-analytics/data` SDK, which speaks gRPC and cannot run on Workers.

**With no credentials set it serves seeded demo data behind a "DEMO DATA"
banner**, so the dashboard is reviewable before the Google account exists. Adding
the environment variables switches it to live data with no code change.

```bash
cp .env.example .env.local   # fill in
npm run verify:ga            # proves key parses → token issues → runReport 200
npm run build
npx wrangler pages dev dist  # runs the Function locally, unlike `npm start`
```

Cloudflare Pages settings: build command `npm run build`, output directory
`dist`. Set the environment variables under **Settings → Environment variables**
— note Production and Preview are *separate lists*, so a preview showing demo
data says nothing about production.

⚠️ **Two GA4 setup steps are easy to miss:**
1. The service account must be added in GA4 → Admin → **Property access
   management** with the **Viewer** role. Without it you get `403
   PERMISSION_DENIED` even though the token issues fine.
2. Set **data retention to 14 months** (Admin → Data collection and modification
   → Data retention). The default is 2 months, and it only applies going
   forward — expired event-level data cannot be recovered.

## SEO

Per-page metadata, `sitemap.ts`, `robots.ts`, Article + FAQPage JSON-LD,
semantic HTML, alt text, fast first load (~104 kB).

---

Built by Vidyayatan Technologies.
