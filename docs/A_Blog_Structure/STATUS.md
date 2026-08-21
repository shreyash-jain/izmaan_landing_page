# STATUS — Izmaan Lodge journal

**The living state of blog work.** It exists so anyone picking up — a new teammate or a
fresh AI session — knows where things stand without needing chat history. The other docs
say *how*; this says *where we are*.

> **Handoff protocol:**
> - **Before you start:** read `README.md`, then this file.
> - **While you work:** keep the tables below current.
> - **Before you leave:** update statuses, record blockers, list the next actions, and
>   commit your branch.

*Last updated: 2026-08-21.*

---

## Published posts

Eight Markdown posts in `content/blog/`:

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

There is no registry to keep in sync — the folder *is* the registry. But
`lib/posts-registry.generated.ts` must be regenerated (it happens inside `npm run build`)
and committed whenever a post is added.

## In flight

| Work | Branch | State | Next action |
|---|---|---|---|
| Family / whole-lodge stays | `blog/family-whole-lodge-stays` | Checked out locally | Verify against `origin/main`, build, PR |
| Blog docs standardisation | *(this folder)* | Uncommitted | Commit `docs/A_Blog_Structure/` + `.claude/commands/blog.md` + the `.gitignore` change that lets the command be tracked |

## The plan

The keyword research is **complete and approved**, written to
[`SEO-KEYWORD-PLAN.md`](../../SEO-KEYWORD-PLAN.md): clusters A–G, an audit of the original
three posts, and a **3-posts-a-month** calendar (Jul / Aug / Sep 2026).

The manager hands over **one topic brief at a time** — title, keywords, outline, word
count — and expects the post drafted straight from it.

⚠ **Section 5 of the plan lists facts that must be re-verified before publication:**
visa/ETA 2026 rules, vehicle-kit law, season months.

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
