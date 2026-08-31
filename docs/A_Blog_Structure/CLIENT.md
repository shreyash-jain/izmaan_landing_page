# CLIENT — Izmaan Lodge

Who the client is, who reads them, how they sound, and every standing instruction they
have given. **This file is living.** Every time the client or the manager reacts to a
draft, write the lesson down here as a rule with its reason. That is the whole mechanism
by which the next blog is better than this one.

---

## The business

**Izmaan Lodge** — a luxury **self-catering** beachfront lodge on a dune above the Indian
Ocean at **Pomene**, Inhambane Province, Mozambique. Four en-suite bedrooms across two
units, solar-powered, 100 m from white sand. Tagline: *"Never want to go home."*

- Site: **https://izmaanlodge.co** (the old single-page `izmaan.co.za` is what this
  replaced) · journal at `/journal`
- Enquiries: **WhatsApp** `+27 82 374 4676`
- Location pin: Pomene peninsula, roughly **106 km south of Vilankulo (VNX)**, between the
  open sea and a large tidal estuary. The final approach is deep soft sand — **a
  high-clearance 4×4 is essential.**

**Self-catering is the core identity.** The owner confirmed this directly. Half-board and
all-inclusive are *optional add-ons*, never a repositioning.

⚠ **The brand name is split three ways** — Izmaan / Iz-Ma-An / "Izmaan Madelaine" on
Google. It needs standardising; until it is, use **Izmaan Lodge** in prose and don't
introduce a fourth variant.

## The reader

Someone planning a remote, self-drive Mozambique coastal trip — often South African,
often towing or 4×4-equipped, comfortable with self-catering, looking for quiet over
nightlife. They are researching logistics as much as scenery: the border, the road, the
supply run, the vehicle.

## Voice

Practical, grounded, first-person where it helps. This lodge's advantage is specificity
about a place most content can only describe vaguely — the sand section, the last shop,
the tide, the kit you actually need.

- Honest about difficulty. Pomene is remote and the drive is hard; saying so builds trust
  and filters out the wrong guest.
- SA / British spelling.
- Avoid the travel-copy filler: `nestled`, `hidden gem`, `bucket list`, `unwind`,
  `paradise`, `must-see`, `something for everyone`.

## Facts and accuracy

- **Never fabricate search volumes.** No keyword-volume API is available here.
- **Re-verify before publishing** anything from Section 5 of `SEO-KEYWORD-PLAN.md` —
  visa/ETA 2026 rules, vehicle-kit law, season months.
- **Verified once, reusable:** southern and central Mozambique flooded Dec 2025 – Feb
  2026; the Inhambane coastal corridor (Inhambane, Tofo, Vilanculo, Bazaruto) has been
  operating normally since roughly mid-2026, but **some secondary roads and EN1 stretches
  are still under repair**. "Is Mozambique open / safe in 2026" content should reassure
  about the beaches while telling readers to **re-check the route**.
- **Inhambane is a malaria area.** Children's prophylaxis is weight-dosed and doxycycline
  is unsuitable for young children — **always point readers to a travel clinic, never give
  a dose.**
- The lodge cannot currently promise a transfer: no named operator runs a dedicated
  Vilankulo/Inhambane → Pomene service. Existing guides say "arrange a transfer with the
  lodge" with no partner behind it. Don't imply more than that exists.

## Visual direction

**Three images per post: 1 cover + 2 in-body.** Alt text carries the keyword.

- **Never AI-generate the property.** Not the lodge, the rooms, the kitchen or the
  bathrooms — those are the owners' real photos in `public/images/lodge/`. Generated
  images cover **surrounding scenery, marine life and activities only.**
- Shared style spec lives in [`AI-IMAGE-PROMPTS.md`](../../AI-IMAGE-PROMPTS.md) — append
  it to every prompt, and add each new post's three prompts to that file.
- Square (1024×1024) works everywhere because the site crops with `object-cover`, but ask
  for **16:9** for the hero and wide cards.
- No real faces, no number plates, no logos, no political content.

## Commercial rules

- **WhatsApp is the call to action.**
- **Half-board / all-inclusive bookings need a minimum two weeks' notice.** Confirmed by
  the owner — more planning and sourcing are required at this remoteness.
- The menu **refreshes weekly** with seasonal availability; it is *not* a fixed rotating
  cycle, and it includes casual staples (fish cakes and chips, hamburgers and chips)
  alongside feature dishes. Any earlier "4-night rotating menu" description was
  illustrative only.

---

## Standing instructions and past feedback

*Append every new one, newest first, with the date and the reason. Never delete an entry
— supersede it and say so.*

- **2026-08-25 — Generated images must look like photographs, not brochures.** The first
  pass for the Komatipoort post came back golden-hour, saturated and glossy; the manager
  asked for "more realistic images". What fixed it was prompting for the *flaws* — patched
  and cracked tarmac, faded markings, dust haze, flat overcast light, sensor noise,
  "documentary photojournalism, not travel-brochure photography". The realism spec is in
  section 7 of `AI-IMAGE-PROMPTS.md`; start there rather than from the coastal style spec
  whenever a post's images are roads, vehicles or logistics rather than sea and sand.
- **2026-08-25 — Don't publish a number that will expire.** For the border post, three
  widely-repeated figures were wrong or unstable: third party insurance (R280 for a
  car/SUV/bakkie, not the R140–160 in circulation — that's the motorcycle rate), the
  "60-hour border queue" (that's *freight*, not tourist lanes), and visa fees (changed
  twice since 2023). Toll amounts were left out entirely because sources disagreed by 8x.
  Where a figure moves, name the qualitative fact and link the primary source instead.
- **2026-07-11 — Advisory, not development.** The relationship now extends into general
  business advice: transport logistics, package and pricing structure, operational asks
  the owner raises informally. Produce findings, options and recommendations. **Only touch
  the site when explicitly told to build something.** Confirmed directly: *"we are just
  suggesting and helping, no development for now."*
- **2026-07-11 — Frame agency input as suggestions, never as claims.** Corrected
  explicitly: *"no claiming like suggesting message."* When drafting a message for the
  owner, the register is formal-but-WhatsApp-length — no email salutation or sign-off —
  unless told otherwise.
- **2026-07-11 — Self-catering stays the core identity** (owner: "I agree 100%").
  Half-board and all-inclusive are add-ons.
- **Research-first, and get approval before drafting.** A colleague showed the manager
  that keyword-researched posts grow and unresearched ones don't. Never draft straight
  from a topic idea; produce or consult the keyword map, then get an explicit yes.
- **Transactional head terms are conceded.** "Pomene accommodation" belongs to the
  aggregators (SafariNow, accommodationmozambique.co.za — verified). The winnable space is
  Pomene-specific long-tail logistics (border crossing, supply runs, 4×4 vocabulary from
  the 4x4community.co.za forums) and comparison posts (Pomene vs Barra / Tofo).

*Last reviewed: 2026-08-25.*
