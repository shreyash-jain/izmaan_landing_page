# CLAUDE.md — Izmaan Lodge

Repo-wide instructions. These are loaded every session and override defaults.

Hosting: **Cloudflare Pages**, project **`izmaan-landing-page`** (confirmed 2026-08-31 from the
PR check's dashboard link). Production branch `main`.

---

## Preview links: the `preview` branch

### The one thing to know

**Pull requests do not build previews on this repo any more.** Automatic preview
deployments are turned off for every non-production branch in Cloudflare's *Branch
control* settings. Only two branches ever build:

| Branch | Builds | URL |
|---|---|---|
| `main` | production | the live Izmaan Lodge site |
| `preview` | preview | `https://preview.izmaan-landing-page.pages.dev` |

`preview` is a **permanent, long-lived branch that runs parallel to `main`**. It is the
single preview lane for the whole repo. It is never merged into `main`, never closed,
never deleted. It just keeps growing alongside `main` forever.

To show someone a branch, you **merge that branch into `preview` and push**. Cloudflare
builds it and the same stable URL updates.

### When to do it — without being asked twice

Do this automatically, without asking for technical permission, whenever the person says
anything that means *"let me see it"*:

> "preview" · "preview link" · "can I see it?" · "show me the blog" · "send it to the
> client" · "is it live yet?" · "share this with the client" · "put it on the preview"

The people using this repo are **non-technical writers**. They should never have to say
the words merge, branch, push, or deploy. They say "I want to see it"; you do the whole
procedure below and hand back a link.

**Standing permission:** pushing to `preview` is pre-authorised. You do not need to ask
before merging into `preview` and pushing it. This is a carve-out and applies to the
`preview` branch **only** — pushing `main`, a blog branch, or anything else still needs
the person to ask for it, every time.

### The procedure

Preconditions — do these first, silently:

1. The post's own branch exists and its work is **committed**. If there are uncommitted
   changes for this post, commit them to the post's branch first. Never merge a
   half-saved post into `preview`.
2. Push the post's branch to `origin` (needed so the PR and the merge agree).
3. If the working tree still has unrelated uncommitted tracked changes, **stop and say
   so** — do not stash, do not discard someone else's work.

Then:

```bash
git fetch origin

# First time only: publish the branch so Cloudflare can see it.
git rev-parse --verify origin/preview >/dev/null 2>&1 || git push -u origin preview

git switch preview
git merge --no-edit origin/main          # keep preview level with production
git merge --no-edit <the-post-branch>    # add the post
git push origin preview
git switch -                             # put the person back where they were
```

Then hand them the deep link to the post itself, not the homepage:

> Your preview is ready: https://preview.izmaan-landing-page.pages.dev/journal/<slug>
>
> It takes a minute or two to finish building. Same link every time — refresh it after
> I make changes.

The build takes 1–3 minutes. If the link 404s, the build has not finished yet; wait and
tell them to refresh, do not re-merge.

### The feedback loop

When the client asks for changes:

1. Make the changes on the **post's own branch** and commit.
2. Repeat the merge procedure above.
3. Say: *"Updated — the client can refresh the same link."*

The URL never changes. Never create a second preview branch, never rename this one.

### Hard rules

- **Never merge `preview` into `main`.** Not once, not "just this bit". The flow is
  one-directional: `main` → `preview`, and post branch → `preview`. Nothing ever comes
  back out of `preview`.
- **`preview` is never a PR target.** The real pull request for a post still goes
  post-branch → `main`. `preview` is only ever updated by direct merge-and-push.
- **Never force-push `preview`, never delete it, never rebase it.** If it gets tangled,
  stop and ask — resetting it is the person's call, not yours.
- **Never delete the post's branch after merging into `preview`.** The real PR still
  needs it.
- Merge conflicts in `preview` are almost always two posts touching the same index or
  `STATUS.md`. Resolve by **keeping both posts**. If the conflict is in the post's own
  content, stop and ask.
- Content going live is still `main`'s job, via the normal pull request. A post being on
  `preview` means **nothing** about it being published.

### Talking about it

Use the `/blog` vocabulary — plain language only:

| Never say | Say |
|---|---|
| merged into preview, pushed | "put it on the preview site" |
| build / deploy running | "it's building — a minute or two" |
| branch, commit, merge conflict | "saved your work" |

### If it does not build

1. Check Cloudflare Pages → project `izmaan-landing-page` → Settings → **Branch control**.
   *Preview branch* must be set to **Custom branches** with `preview` in the list. If it
   still says **None**, nothing will build — tell the person that setting needs
   switching on; it is a dashboard change, not something you can do from here.
2. The project name was confirmed as `izmaan-landing-page` on 2026-08-31 — read off the
   `details_url` of the `Cloudflare Pages` check run
   (`gh api repos/{owner}/{repo}/commits/preview/check-runs`). No `wrangler.toml` names it.
3. A red `Vercel` status check on the PR is expected noise — ignore it.

### Precedence

`/blog` Phase 6 step 5 says the hosting platform builds a preview from the pull request.
**That is no longer true here.** This section wins: the PR builds nothing, the `preview`
branch is where previews come from.

---

## Everything else

The blog workflow, this client's voice, the build commands and the traps live in
`docs/A_Blog_Structure/` — read those, they win over memory on anything
client-specific. Run the blog lifecycle with `/blog`.
