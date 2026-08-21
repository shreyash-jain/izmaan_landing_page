# BLOG PLAYBOOK — Izmaan Lodge

How a post is **written** and **built** in this repo. Voice, accuracy rules and client
instructions live in [CLIENT.md](CLIENT.md); commands and traps in
[ARCHITECTURE.md](ARCHITECTURE.md). The end-to-end process is `/blog`.

**Posts here are Markdown files, not React components.** Adding a post is dropping a
`.md` file into `content/blog/` — there is no route to scaffold.

---

## Part 1 — Research first (this is the gate)

**Never draft a post directly from a topic idea.**

1. Consult or extend [`SEO-KEYWORD-PLAN.md`](../../SEO-KEYWORD-PLAN.md) — keyword clusters
   A–G, an audit of existing posts, and a 3-posts-a-month calendar.
2. Assign **one primary keyword** to the post. It goes in the **title, the H1, the slug
   and the first paragraph**. Secondaries go in H2s. Long-tail questions become verbatim
   FAQ entries.
3. **Never fabricate a search volume.** Use evidence-based prioritisation, and label
   anything unverified.
4. **Get explicit approval on the plan before writing.** The manager hands over one topic
   brief at a time (title, keywords, outline, word count) and expects the post drafted
   from that brief.
5. Re-verify anything from Section 5 of the plan (visa/ETA 2026, vehicle-kit law, season
   months) before it appears in prose.

**Don't chase the head terms** — see [CLIENT.md](CLIENT.md). The winnable space is
Pomene-specific long-tail logistics and comparison posts.

---

## Part 2 — Write the file

Create `content/blog/<slug>.md`. The slug is the primary keyword.

### Frontmatter

```yaml
---
title: "…"                     # contains the primary keyword
description: "…"               # the meta description
category: "Travel Guide"
date: "2026-06-10"             # ISO
updated: "2026-06-26"          # optional
readingTime: "11 min read"
featured: true                 # optional
cover: "/images/blog/<slug>.jpg"
coverAlt: "…"                  # keyword-bearing
keywords:
  - "…"                        # decorative — meta keywords only
faq:
  - q: "…"                     # VERBATIM search queries
    a: "…"
---
```

> **The `faq` block is the real structured-data asset.** `app/journal/[slug]/page.tsx`
> emits it as `FAQPage` JSON-LD. `keywords:` is decorative. Write the questions exactly as
> a person would type them into Google.

### Body

Markdown. Primary keyword in the first paragraph and one H2; secondaries across the other
H2s. Long-tail questions answered in the FAQ verbatim.

Be concrete about logistics — the road, the sand section, the distances, the kit, the
supply run. That specificity is the whole competitive advantage.

---

## Part 3 — Images

**Exactly three per post: 1 cover + 2 in-body.** Alt text carries the keyword.

- **Never generate the property** — lodge, rooms, kitchen, bathrooms are the owners' real
  photos in `public/images/lodge/`. Generated images cover scenery, marine life and
  activities only.
- Files go to `public/images/blog/`, named from the slug —
  `<slug>.jpg` for the cover and `<slug>-<subject>.jpg` for the in-body pair (existing
  convention: `diving-snorkelling-pomene-reef.jpg`, `-turtle.jpg`, `-gear.jpg`).
- **Append this post's three prompts to [`AI-IMAGE-PROMPTS.md`](../../AI-IMAGE-PROMPTS.md)**
  — that's the repo convention, and it keeps the style spec in one place.
- Ask for **16:9** for the cover; square works for in-body because the site crops with
  `object-cover`.

Generate them per [ARCHITECTURE.md § Generating blog images](ARCHITECTURE.md).

---

## Part 4 — Verify and ship

```bash
npm run gen:registry     # regenerates lib/posts-registry.generated.ts
npm run build            # gen-registry + next build + to-dist  — the gate
npm run dev              # then open /journal/<slug> and check images + FAQ render
```

**The generated registry is committed** — `scripts/gen-registry.mjs` bakes a
dependency-free copy of the post list into `lib/posts-registry.generated.ts` so the
Cloudflare Pages Function (which has no filesystem) can join GA page paths back to real
titles. **If you add a post and don't rebuild, the registry goes stale.** It runs as part
of `npm run build`, so a normal build handles it — just make sure the regenerated file is
in your commit.

Commit scoped to this post's files, push `blog/<slug>`, open a PR, hand over the link.
**Don't merge until told.**

---

## Pre-ship checklist

- [ ] Keyword plan consulted; one primary keyword; plan approved before drafting
- [ ] Primary keyword in title, H1, slug, first paragraph; secondaries in H2s
- [ ] FAQ entries are verbatim search queries
- [ ] No fabricated search volumes; Section-5 facts re-verified
- [ ] Malaria guidance points to a travel clinic, never a dose
- [ ] Route advice tells readers to re-check road conditions
- [ ] Exactly 3 images; none of them depict the property; alt text carries the keyword
- [ ] The three prompts appended to `AI-IMAGE-PROMPTS.md`
- [ ] `npm run build` clean and the regenerated registry included in the commit

*Last reviewed: 2026-08-21.*
