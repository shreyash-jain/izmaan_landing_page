# START HERE — Izmaan Lodge journal

**This folder is the single source of truth for blog work in this repo.** A new teammate
or a fresh AI session with zero chat history can ship a correct post using only these
files.

**Read in this order:**

1. **README.md** (this file) — what the client is, the rules you must not break
2. **[CLIENT.md](CLIENT.md)** — who they are, who reads them, the voice, and every
   standing instruction they have given. Living file: add to it after every round of
   feedback.
3. **[BLOG_PLAYBOOK.md](BLOG_PLAYBOOK.md)** — how to write and build a post *here*
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** — commands, image pipeline, traps, deploy
5. **[STATUS.md](STATUS.md)** — the living ledger: what's published, what's next

> **These files win.** When they disagree with an old memory, a stale doc, or chat
> history — believe these. If you find one wrong, fix it and bump the date.

The day-to-day workflow is the **`/blog`** command (`.claude/commands/blog.md`). It is
identical in every client repo; everything client-specific is here.

Two companion files at the repo root are still live and referenced from here:
[`SEO-KEYWORD-PLAN.md`](../../SEO-KEYWORD-PLAN.md) (the keyword map and content calendar)
and [`AI-IMAGE-PROMPTS.md`](../../AI-IMAGE-PROMPTS.md) (the image prompt pack).

---

## 60-second context

**Izmaan Lodge** is a luxury **self-catering** beachfront lodge on a dune above the Indian
Ocean at **Pomene, Inhambane Province, Mozambique** — four en-suite bedrooms across two
units, solar-powered, 100 m from white sand. Tagline: *"Never want to go home."*

- Live site: **https://izmaanlodge.co** · journal at `/journal`
- Enquiries run through **WhatsApp** — `+27 82 374 4676`
- The account is managed by Vidyayatan Technologies, whose role now extends beyond the
  website into **advisory** work (transport logistics, packages, pricing). See CLIENT.md.

**The journal** is an SEO content engine: **3 posts a month**, each built on one researched
primary keyword, aimed at the Pomene-specific long-tail that aggregators haven't taken.

## Stack in one line

Next.js **14.2.5** (App Router) · React · TypeScript · Tailwind · **posts are Markdown
files** in `content/blog/` read through `gray-matter` · build emits a static `dist/` ·
deployed to **Cloudflare Pages**.

## The non-negotiables

1. **Never draft a post straight from a topic idea.** Research first: consult or produce
   the keyword map, assign one primary keyword, and **get explicit approval on the plan
   before writing.**
2. **Never AI-generate the lodge itself** — not the building, rooms, kitchen or bathrooms.
   Those are the owners' real photos under `public/images/lodge/`. Generated images are
   only for surrounding scenery, marine life and activities.
3. **Exactly 3 images per post** — 1 cover + 2 in-body — with keyword-bearing alt text.
4. **The FAQ block is the real SEO asset.** `keywords:` in frontmatter is decorative (meta
   keywords only); the `FAQPage` JSON-LD emitted by `app/journal/[slug]/page.tsx` is what
   Google uses. **FAQ questions must be verbatim search queries.**
5. **Never fabricate a search volume.** No keyword-volume API is available here. Use
   evidence-based prioritisation and label anything unverified.
6. **Section 5 of `SEO-KEYWORD-PLAN.md` lists facts that must be re-verified** before they
   appear in any published post — visa/ETA 2026, vehicle-kit law, season months.
7. **Advisory work is advisory.** Transport, pricing and ops asks get research and
   recommendations, not code — unless the user explicitly says to build something.

## Where everything lives

| Thing | Path |
|---|---|
| A post (the whole post) | `content/blog/<slug>.md` |
| Post loader (frontmatter → site) | `lib/posts.ts` |
| Generated dependency-free registry | `lib/posts-registry.generated.ts` (emitted by `scripts/gen-registry.mjs`) |
| Post route | `app/journal/[slug]/` |
| Images | `public/images/blog/` · real lodge photos in `public/images/lodge/` |
| Image slots | `lib/images.ts` |
| Brand, contact, geo, booking | `lib/site.ts` |
| Keyword map + content calendar | `SEO-KEYWORD-PLAN.md` |
| Image prompt pack | `AI-IMAGE-PROMPTS.md` |

*Last reviewed: 2026-08-21.*
