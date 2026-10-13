# STATUS — Izmaan Lodge journal

**The living state of blog work.** It exists so anyone picking up — a new teammate or a
fresh AI session — knows where things stand without needing chat history. The other docs
say *how*; this says *where we are*.

> **Handoff protocol:**
> - **Before you start:** read `README.md`, then this file.
> - **While you work:** keep the tables below current.
> - **Before you leave:** update statuses, record blockers, list the next actions, and
>   commit your branch.

*Last updated: 2026-08-25.*

---

## Published posts

Nine Markdown posts in `content/blog/`:

| Slug | Notes |
|---|---|
| `pomene-travel-guide` | The pillar guide |
| `drive-to-pomene-4x4-guide` | Logistics |
| `best-time-to-visit-pomene` | Seasonal |
| `whale-watching-pomene-mozambique` | From the plan — Jul 2026 |
| `diving-snorkelling-pomene` | From the plan — Jul 2026 |
| `self-catering-vs-all-inclusive-mozambique` | From the plan — 7 Aug 2026 |
| `turtle-nesting-season-pomene` | From the plan — 17 Aug 2026 |
| `family-holiday-mozambique-pomene` | From the plan — 17 Aug 2026 |
| `komatipoort-border-crossing-mozambique` | From the plan — 25 Aug 2026. **In review, PR #14** |

There is no registry to keep in sync — the folder *is* the registry. But
`lib/posts-registry.generated.ts` must be regenerated (it happens inside `npm run build`)
and committed whenever a post is added.

## In flight

| Work | Branch | State | Next action |
|---|---|---|---|
| Komatipoort border crossing | `blog/komatipoort-border-crossing-mozambique` | **PR #14 open, not merged** | Client review, then merge on the manager's word |
| Family / whole-lodge stays | `blog/family-whole-lodge-stays` | Merged as PR #13 | — |
| Pomene hidden paradise (`pomene-mozambique-hidden-paradise`) | none yet — post + 3 images sit in local commit `6f47180` on `blog/komatipoort-border-crossing-mozambique` (with 4 other new posts from another session) | Written 2026-10-05; client reviewing via private artifact `https://claude.ai/artifact/CHuwwkAvMbyx33UvnLHRYs`. **Not sent: Phase 5 Tier 2 on 2026-10-06** (see the 6 Oct security note) | Only on the manager's word: fresh branch off `main` per post, PR, then `preview` |
| Blog docs standardisation | *(this folder)* | Uncommitted | Commit `docs/A_Blog_Structure/` + `.claude/commands/blog.md` + the `.gitignore` change that lets the command be tracked |

## The plan

The keyword research is **complete and approved**, written to
[`SEO-KEYWORD-PLAN.md`](../../SEO-KEYWORD-PLAN.md): clusters A–G, an audit of the original
three posts, and a **3-posts-a-month** calendar (Jul / Aug / Sep 2026).

The manager hands over **one topic brief at a time** — title, keywords, outline, word
count — and expects the post drafted straight from it.

⚠ **Section 5 of the plan lists facts that must be re-verified before publication:**
visa/ETA 2026 rules, vehicle-kit law, season months.

## Security note — 6 Oct 2026: preview infected, and the laptop itself was compromised

- `preview` and the turtle / family / Komatipoort blog branches were force-pushed to forged merge `c58557a`
  (postcss payload + `.vscode/tasks.json` `runOn: folderOpen` + fake `public/fonts/fa-solid-400.woff2`).
  `preview` was repaired forward on 6 Oct (`5092ad7`); **the three blog branches were still infected on 7 Oct.**
  They hold nothing that isn't already on `main`.
- A Cloudflare build failing with `Identifier 'createRequire' has already been declared` in `next/font` **is the
  payload**, not a bug in a post. Never "fix" it by editing the config on that branch.
- **The laptop's global npm was trojaned on 4 Sep** (`%APPDATA%\npm\node_modules\npm\lib\cli.js`, a space-padded
  1.5 MB 13th line). Every `npm` command launched a clipboard/credential stealer talking to 91.218.183.174 and
  193.247.144.38. Defender did not flag it. Restored to the genuine 12 lines on 6 Oct. Treat every credential used on
  that laptop since 4 Sep as stolen. Before any blog work, check that file's longest line (genuine is 79).

## Security note — 20 Aug 2026 force-push incident (resolved)

`Manshu48` force-pushed `main` and two blog branches to `5364781` at 2026-08-20T02:11:32Z.
That commit carried the `postcss.config.mjs` payload (longest line **31,329** chars, 3 IOC
matches). `github-actions[bot]` force-pushed `main` back to `f6e8202` **9 seconds later**.

**Current state: clean.** `5364781` is not in `origin/main`'s history; a full scan of every
commit reachable from `main` finds no oversized `postcss.config.mjs`; the tip is 51 chars.

Two things to know for future safety checks, because both cost time on 25 Aug:
- **GitHub's Activity page pages out quickly.** Force-pushes from five days ago sit below
  the fold. Use `gh api repos/{owner}/{repo}/activity` and read `before->after`, which
  shows whether a bad push was *rolled back* — the Activity UI does not make that obvious.
- **The forged-committer signature (`Saral`, `-0700`) appears on clean commits too.**
  `f1ef280` carries it and is an ancestor of `main`, but has no payload. Treat the
  signature as a lead, then check the config line length at that commit before escalating.

## Open items

- **Brand name is split three ways** — Izmaan / Iz-Ma-An / "Izmaan Madelaine" on Google.
  Needs standardising with the client.
- **No transfer partner exists** for the Vilankulo/Inhambane → Pomene route. Two leads
  surfaced in the 2026-07-11 transport research: **Big Blue Charters** (Vilankulo boat
  operator, doesn't run to Pomene yet — `+258 84 566 5006`, `bigbluelda.vilankulo@gmail.com`)
  and **The Sardine Co "Pomene by Sea"** (proves the route is navigable, but it's a
  week-long minimum-4-guest expedition, not a shuttle). EKAYA gave a pricing benchmark
  ($50/vehicle one-way road transfer, jetty-handoff model). Recommendation: split the
  106–170 km problem into a ground leg plus a short local hop. **Next step is the client
  calling those leads** — nothing further from us until they report back.
- **Unconfirmed:** whether Pomene Reserve has a usable airstrip (one low-reliability
  source claims a 738 m unpaved strip). Don't publish it.
- **Pricing model review** (Half Board R950pp/night, All-Inclusive R1200pp/night) was
  delivered as a document and three decisions were confirmed by the owner — see
  `CLIENT.md`. The one remaining open item is a **self-catering base price**.
