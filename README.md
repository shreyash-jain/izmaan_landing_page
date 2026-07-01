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
  (owner originals from the Booking.com gallery and the LAM/Índico press feature).
- **Atmosphere/AI images** (ocean, reef, activities, blog covers) live in
  `public/images/`. See `AI-IMAGE-PROMPTS.md` for the Gemini prompt pack — generate,
  drop in over the same filename, rebuild.
- All images go through `next/image` (AVIF/WebP, lazy, responsive).

## Launch-critical config — `lib/site.ts`

- **Booking** → Booking.com listing link (client-supplied).
- **WhatsApp** → ⚠️ currently `+27 82 374 4676` (SA). KT also lists `+258 84 570
  5769` (MZ) — verify before launch.
- **Brand name / canonical URL** → `Izmaan Lodge` / `https://izmaan.co.za`.

## SEO

Per-page metadata, `sitemap.ts`, `robots.ts`, Article + FAQPage JSON-LD,
semantic HTML, alt text, fast first load (~104 kB).

---

Built by Vidyayatan Technologies.
