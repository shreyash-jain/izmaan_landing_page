# Iz-Ma-An Lodge — AI image prompt pack (Gemini / Imagen)

Paste these into Gemini (or any Imagen-based generator) to create on-brand images
for the slots that use scenery/atmosphere. Generate, then drop the file into
`public/images/...` over the exact filename below (or repoint it in
`lib/images.ts`). `next/image` handles sizing/format.

> ⚠️ **Do NOT AI-generate the lodge, rooms, kitchen or bathrooms.** Those use the
> owners' real photos (`public/images/lodge/*`). AI images are only for
> *surrounding scenery, marine life and activities* — never the property itself.
>
> 💡 Gemini outputs **1024×1024 squares** by default. The site crops them with
> `object-cover`, so square works everywhere — but for the hero and wide cards,
> ask for a 16:9 frame (or pick a generation with the key subject centred).

---

## 1. Shared style spec (append to every prompt)

```
Style: bright, airy, sun-drenched editorial travel photography of the Pomene
coast, Inhambane Province, Mozambique. Fresh coastal-luxury mood, NOT dark.
Colour palette: lagoon turquoise (#16B5AC), warm coral sunset accents (#FF7A59),
white sand (#FBF7EF), deep teal-green water (#0B3A40), soft golden light.
Natural midday-to-golden-hour lighting, high clarity, gentle film grain.
Photorealistic, 35mm look, no people unless specified, no text, no logos,
no watermark, no borders.
```

---

## 2. Blog covers

**`public/images/blog/pomene-travel-guide.jpg`**
```
Aerial drone view of a remote Mozambican peninsula at golden hour: turquoise
lagoon meeting white-sand beach, dune scrub, a single dhow sailboat on calm
water, empty coastline curving into the distance. [+ shared style spec] 16:9.
```

**`public/images/blog/drive-to-pomene-4x4-guide.jpg`**
```
Deep 4x4 tyre tracks winding across soft golden sand dunes toward a distant
turquoise sea, low morning light, scattered coastal scrub, remote adventure feel.
No vehicle visible, just the tracks and dunes. [+ shared style spec] 16:9.
```

**`public/images/blog/best-time-to-visit-pomene.jpg`**
```
Calm open turquoise ocean off Mozambique at sunrise, a humpback whale's tail
(fluke) gently breaking the glassy surface in the distance, soft pastel sky,
serene and expansive. [+ shared style spec] 16:9.
```

**`public/images/blog/whale-watching-pomene-mozambique.jpg`** (cover)
```
A humpback whale breaching clear of glassy deep teal-green water off a remote
Mozambican coastline, white spray frozen mid-air, empty white-sand beach and
dune scrub visible in the soft-focus foreground as if watched from the shore,
early golden-hour light. [+ shared style spec] 16:9.
```

**`public/images/blog/whale-watching-pomene-mozambique-blow.jpg`** (body — "From the beach" section)
```
View from an empty white-sand beach at dawn: far out on a flat, glassy
turquoise sea, a humpback whale's blow — a tall white puff of spray — hangs in
the still air, the whale's dark back just breaking the surface beneath it.
Vast calm ocean, soft pastel morning sky, sense of quiet scale and distance.
[+ shared style spec] 16:9.
```

**`public/images/blog/whale-watching-pomene-mozambique-mother-calf.jpg`** (body — "Why the whales come here" section)
```
A humpback whale mother swimming just beneath the surface of clear, warm
turquoise water with her small calf close alongside, seen from slightly above,
sunbeams filtering through the water, gentle and protective mood, deep
teal-green open ocean fading below. [+ shared style spec] 16:9.
```

**`public/images/blog/diving-snorkelling-pomene.jpg`** (cover)
```
A single scuba diver hovering above a healthy, untouched coral reef in bright,
clear turquoise-to-deep-teal water off a remote Mozambican coast, colourful reef
fish shoaling over the coral, strong shafts of sunlight from the surface above,
vast open blue beyond the reef edge, pristine and uncrowded.
[+ shared style spec] 16:9.
```

**`public/images/blog/diving-snorkelling-pomene-reef.jpg`** (body — "Why the reefs off Pomene are still untouched")
```
Close underwater view of a thriving untouched coral garden in clear blue water:
hard and soft corals in natural muted colour, dense shoals of small colourful
reef fish, a sea turtle grazing at the edge of frame, dappled sunlight rays
filtering down, no divers, no bubbles. [+ shared style spec] 16:9.
```

**`public/images/blog/diving-snorkelling-pomene-snorkel-beach.jpg`** (body — "Snorkelling in Pomene — straight off the beach")
```
Over-under (split-level) photograph in clear shallow turquoise water just off an
empty white-sand beach: below the waterline, coral heads and bright reef fish in
sunlit shallows; above it, a flat calm sea, white sand, dune scrub and a bright
morning sky. Sharp, luminous, no people. [+ shared style spec] 16:9.
```

**`public/images/blog/diving-snorkelling-pomene-turtle.jpg`** (body — "What you'll see")
```
A green sea turtle grazing calmly on a coral reef in clear sunlit turquoise
water, seen from the side and slightly above; a single snorkeller silhouetted at
the surface in the soft-focus background, keeping a respectful distance, not
reaching toward the animal. Peaceful, unhurried, wild. [+ shared style spec] 16:9.
```

**`public/images/blog/diving-snorkelling-pomene-gear.jpg`** (body — "What to bring")
```
Flat-lay of snorkelling and dive gear arranged on clean white sand: mask,
snorkel, fins, reef shoes, rash vest, mesh drawstring bag and a dive computer,
warm golden side light casting soft shadows, calm turquoise sea and empty beach
blurred behind. Documentary, uncluttered, no brand logos, no text.
[+ shared style spec] 16:9.
```

**`public/images/blog/self-catering-vs-all-inclusive-mozambique.jpg`** (cover)
```
A weathered wooden table on white sand at golden hour, laid for a home-cooked
meal: a whole grilled fish on a board, a bowl of salad, cut limes, simple enamel
plates and two glasses, turquoise sea and empty beach softly out of focus behind.
Relaxed, unstyled, end-of-day mood. No people, no building or lodge visible.
[+ shared style spec] 16:9.
```

**`public/images/blog/self-catering-vs-all-inclusive-mozambique-catch.jpg`** (body — "Freedom and flexibility")
```
Close-up of a just-caught fresh fish on a wooden board beside coarse salt, cut
limes and a sprig of herbs, next to a simple beach grill with glowing coals,
white sand underfoot, warm late-afternoon light. Honest and rustic, not
restaurant-styled. No people, no building visible. [+ shared style spec] 16:9.
```

**`public/images/blog/self-catering-vs-all-inclusive-mozambique-supplies.jpg`** (body — "What's provided vs what you bring")
```
The open back of a dusty 4x4 loaded for a remote self-catering trip: a cool box,
crates of fruit and vegetables, bottled water, dry-goods bags and a coffee tin,
parked on a soft sand track through coastal dune scrub, bright morning light.
Practical and real, not staged. No people. [+ shared style spec] 16:9.
```

**`public/images/blog/self-catering-vs-all-inclusive-mozambique-market.jpg`** (body — "How to plan supplies")
```
A sunlit open-air market stall in a small coastal Mozambican town: baskets and
crates of tomatoes, onions, bananas, mangoes and peppers under a shade cloth,
warm dusty light, bright colours. Documentary travel feel, faces not visible.
No text or signage. [+ shared style spec] 16:9.
```

**`public/images/blog/self-catering-vs-all-inclusive-mozambique-solar.jpg`** — ❌ **WITHDRAWN, do not regenerate**
```
(Was: solar panels on a raised wooden frame in the dune scrub.)

Wrong: the owners' panels are mounted ON THE LODGE ROOF, not ground-framed.
Roof-mounted panels are part of the property, so this slot falls under the
no-AI rule at the top of this file and CANNOT be filled by a generated image.
It needs a real photo of the roof from the owners. Until one arrives, the
"Sustainability" section runs without an image.
```

> ⚠️ This post is *about* the kitchen, so the usual rule matters more than usual:
> **no AI kitchen, dining room, bedroom or lodge interior.** The post uses the
> owners' real kitchen photo (`/images/lodge/720379827.jpg`) for that, and the
> prompts above stay on the surroundings — food, supplies, the shopping run.
> Add *"no building or lodge visible"* wherever a structure could creep in.
>
> ✅ Generated and wired into the post. Like the earlier sets they came out
> square (1024×1024) — fine in the body, and the **cover** survives the
> template's 16:9 centre-crop because the laid table sits mid-frame.
> One blemish: the supplies shot has garbled AI lettering on the mudflap and a
> sack. Re-render with *"no text, no lettering, no brand marks anywhere"* if it
> bothers you at full width.

---

### Turtle nesting season post — ✅ GENERATED & WIRED IN (5 slots)

> ✅ All five generated and in place at 1376×768 (16:9 — no centre-crop damage on
> the cover). They came out of the generator at 670 KB–1.07 MB each, ~4.3 MB for
> the page; re-encoded in place with sharp at `quality: 82, mozjpeg` down to
> **767 KB total** with no visible loss, including in the night shots where
> banding would show first. Worth doing for any future set — `output: export`
> means there's no runtime optimizer and the files ship exactly as committed.
>
> **These prompts are self-contained — paste them whole.** Do *not* append the
> shared style spec from §1: three of these are night or first-light scenes and
> the spec's "bright, airy, sun-drenched, NOT dark" line fights them. The palette
> and photorealism instructions are already written into each block below.
>
> **The two hard rules across the whole set**, because the post is *about* them:
> **no artificial light anywhere in frame** (no torches, lamps, windows, boats or
> town glow — a lit beach is the exact thing the article says kills hatchlings),
> and **no people touching, holding, lifting or standing over a turtle.** A
> generated image of someone "helping" a hatchling to the sea contradicts the
> guidance three paragraphs above it.

**1. `public/images/blog/turtle-nesting-season-pomene.jpg`** (cover — 16:9 matters here, the template centre-crops)
```
Photorealistic editorial wildlife photography, 35mm look, natural light, gentle
film grain. A large loggerhead sea turtle crawling back down an empty white-sand
beach toward calm turquoise water at first light, seen from behind and slightly
to one side, her wide flipper tracks trailing up the sand behind her. Low dune
scrub along the top of the beach and an empty horizon — no buildings, no boats,
no lights. Soft pastel dawn sky, pale coral and gold on the water.
Colour palette: lagoon turquoise, white sand, deep teal-green water, soft golden
light. Wild, quiet, documentary — not a postcard. Keep the turtle centred in the
frame. No people, no text, no logos, no watermark, no borders. 16:9.
```

**2. `public/images/blog/turtle-nesting-season-pomene-dark-beach.jpg`** (body — "Why Pomene's dark beach is ideal")
```
Photorealistic long-exposure night landscape photography, 35mm look, natural
darkness. A completely empty white-sand beach at night under a clear, star-dense
sky, the Milky Way arcing overhead, faint moonlight silvering gentle surf, dark
dune scrub silhouetted behind the beach. Absolutely no artificial light anywhere
in frame — no lamps, no lit windows, no torches, no buildings, no distant town
glow on the horizon. Deep teal-blue and indigo tones, luminous stars, pale sand
just catching starlight. Understated and real, not glowing, not neon, not
oversaturated. No people, no text, no logos, no watermark, no borders. 16:9.
```

**3. `public/images/blog/turtle-nesting-season-pomene-nesting-female.jpg`** (body — "Loggerhead vs leatherback")
```
Photorealistic night wildlife photography lit only by a bright full moon, 35mm
look, gentle film grain. A large loggerhead sea turtle high up a dark, empty
beach in the dry sand, settled into a shallow body pit she has dug, sand banked
around her, her rear flippers mid-excavation. Seen from behind and low down, at
a respectful distance — never in front of her head. Dune scrub behind, calm dark
sea and moonlit surf in the background. Cool silver-blue moonlight, deep shadow,
sand texture picked out by the low light. No torches, no lamps, no camera flash,
no artificial light of any kind, no people, no hands, no buildings, no text, no
logos, no watermark, no borders. 16:9.
```

**4. `public/images/blog/turtle-nesting-season-pomene-tracks.jpg`** (body — "How to watch responsibly")
```
Photorealistic editorial travel photography, 35mm look, high clarity, gentle
film grain. Fresh sea turtle tracks in smooth white sand at dawn: two parallel
bands of flipper marks, like wide tractor treads, running from the water's edge
up to a churned nesting hollow at the top of the beach. Low raking morning light
across the sand picking out every ridge of the texture. Empty beach, dune grass,
calm turquoise sea beyond, soft golden light. No turtle in frame — the tracks are
the subject. No people, no human footprints, no vehicle tracks, no buildings, no
text, no logos, no watermark, no borders. 16:9.
```

**5. `public/images/blog/turtle-nesting-season-pomene-hatchlings.jpg`** (body — "Why undeveloped, dark beaches matter")
```
Photorealistic wildlife photography, very low camera angle at sand level, shallow
depth of field, natural first light. A single tiny dark sea turtle hatchling,
palm-sized, crossing wet packed sand toward the surf, its small trail scribbled
behind it, a thin sheet of water ahead reflecting the pale pre-sunrise sky. The
ocean soft and out of focus in the background, white sand, cool turquoise and
pale gold tones. Fragile, determined, hopeful. Natural light only — no torch, no
flash, no artificial light. No hands, no people, no buildings, no text, no logos,
no watermark, no borders. 16:9.
```

*If a generation comes out looking too "AI" — plasticky sand, glowing water — add:
"subtle natural colours, realistic, understated documentary travel photography,
slightly imperfect."*
### Family / whole-lodge post — 🚫 REAL PHOTOS ONLY (prompts retired)

> **Decision (19 Aug 2026):** the post now runs on the **owners' real photographs
> only** — four slots, no AI imagery, no borrowed atmosphere frames:
>
> | Slot | File |
> | --- | --- |
> | Cover | `/images/lodge/720380574.jpg` — both units on the dune |
> | Whole-lodge stay | `/images/lodge/720380618.jpg` — shared dining space |
> | Self-catering | `/images/lodge/720379827.jpg` — kitchen |
> | Privacy / rooms | `/images/lodge-real-2.jpg` — bedroom onto the sea |
>
> The five AI prompts written for this post (empty beach with distant family,
> estuary shallows, sandcastle, mangrove kayak, long table at dusk) are **retired**
> — do not generate them. Two were generated before the decision and are still on
> disk but **unreferenced**: `family-holiday-mozambique-pomene-beach.jpg` and
> `family-holiday-mozambique-pomene-estuary-shallows.jpg`. Delete them or keep them
> as spares; nothing links to them.
>
> If more images are wanted here, they have to be the owners' own photos. The one
> worth asking for: a wide shot of both units **from the beach**.

---

## 3. Homepage — hero & story

**`public/images/hero.jpg`** (full-bleed hero — favour a 16:9 frame)
```
Sweeping aerial of a pristine Mozambican beach: vivid turquoise shallows over
white sand, gentle waves, palm-dotted dune, bright and airy, plenty of clean
sky and water. [+ shared style spec] 16:9.
```

**`public/images/beach-walk.jpg`** (Story section)
```
A quiet white-sand beach at first light, soft footprints leading toward calm
turquoise water, warm nostalgic golden glow, no people, intimate and timeless.
[+ shared style spec] 4:5 vertical.
```

---

## 4. Experiences & Seasons cards

**`public/images/ocean-aerial.jpg`** — Whale watching
```
Aerial of deep blue open ocean off Mozambique with a humpback whale just beneath
the surface, faint silhouette and ripple, bright daylight. [+ shared style spec]
```

**`public/images/turtle.jpg`** — Turtle nesting
```
A sea turtle gliding through clear sunlit turquoise water above pale sand and
coral, dappled light rays, serene. [+ shared style spec]
```

**`public/images/reef-diver.jpg`** — Fishing & diving
```
Underwater scene of a healthy untouched coral reef in clear blue water, colourful
reef fish, shafts of sunlight from above, vibrant but natural. [+ shared style spec]
```

**`public/images/kite.jpg`** — Kitesurfing
```
A single colourful kitesurf kite arcing over a wide, empty turquoise lagoon under
a bright sky, white-sand spit, steady wind. [+ shared style spec]
```

---

## 5. Things to Do tiles

**`public/images/snorkel.jpg`** — Snorkelling
```
Over-under shot in clear shallow turquoise water: coral and reef fish below, calm
sea and bright sky above. [+ shared style spec]
```

**`public/images/fishing-boat.jpg`** — Fishing charters
```
A small open fishing boat on calm, glassy turquoise water at golden hour off a
remote Mozambican coast, rods visible, no people. [+ shared style spec]
```

**`public/images/coast-rugged.jpg`** — Old Pomene hotel ruins
```
A weathered, sun-bleached abandoned colonial-era building shell near a wild
coastline, dune grass, bright sky, hauntingly beautiful, no people.
[+ shared style spec]
```

**`public/images/wave.jpg`** — The blow holes
```
Sea water surging and spouting upward through dark coastal rocks at the point,
spray catching the light, turquoise water around, dynamic but bright.
[+ shared style spec]
```

**`public/images/mangrove.jpg`** — Mangroves
```
Quiet mangrove channels behind a coastal peninsula, still reflective water, green
mangrove roots, soft morning light, serene, no people. [+ shared style spec]
```

---

## 6. Tips

- Generate at the largest resolution Gemini offers.
- Keep the shared style spec on every prompt so the set looks cohesive.
- Too "AI"? Add: *"subtle natural colours, realistic, understated documentary
  travel photography."*
- After dropping files in, run `npm run build` to confirm everything loads.

---

## 7. Komatipoort border crossing post (added 2026-08-24)

> These three use a **documentary/realism variant** of the style spec, not the coastal
> one. The first pass came back looking like postcards and was rejected — glossy golden
> hour, saturated colour, perfect tarmac. What worked was asking for the *flaws*: patched
> and cracked road surfaces, faded markings, dust haze, flat overcast light, sensor noise.
> Keep the "no text, no signage, no number plates" clause — road and border scenes are
> exactly where the model wants to letter a sign.

**Shared realism spec**
```
Shot on a full-frame DSLR with a 35mm lens, handheld, natural available light, straight out
of camera with no colour grading and no HDR. Realistic and slightly imperfect: patched and
repaired tarmac, faded worn road markings, gravel and dust on the verge, tyre scuff marks,
uneven horizon, ordinary flat daylight rather than dramatic golden hour, mild haze,
true-to-life muted colours, visible sensor noise in the shadows. Documentary photojournalism,
not travel-brochure photography. Nothing looks staged or retouched. No people, no text of any
kind, no road signs, no billboards, no number plates, no logos, no watermark, no borders.
```

**`public/images/blog/komatipoort-border-crossing-mozambique.jpg`** — cover, 16:9
```
Eye-level photograph taken from the shoulder of a two-lane tar highway in the South African
lowveld on an ordinary weekday morning. The road runs east into the distance, tarmac patched
in darker strips and cracked at the edges, faded white edge line, red gravel shoulder littered
with small stones. Thorn scrub and a few flat-topped acacias on the verge, dry winter grass,
an old wire fence line running parallel, wooden power poles with sagging cables receding along
the road. The low Lebombo ridge sits blue-grey and hazy on the horizon under a pale washed-out
sky. Overcast-bright light, no long shadows. Empty road, no vehicles. [+ realism spec] 16:9.
```

**`public/images/blog/komatipoort-border-crossing-mozambique-approach.jpg`** — square
```
Photograph taken from a rocky rise looking down over a river valley in the eastern lowveld of
South Africa. A brown-green river winds between reed beds and riverine trees; a narrow worn tar
road with a broken edge follows the far bank toward a gap in low bush-covered hills. Dry khaki
grass and grey rock in the foreground, sparse leafless thorn trees, hazy layered hills behind
under a flat white-blue midday sky. Slightly hazy air, ordinary daylight, muted natural colour.
No buildings, no vehicles, no signage. [+ realism spec] Square framing.
```

**`public/images/blog/komatipoort-border-crossing-mozambique-en1.jpg`** — square
```
Photograph from the driver's side shoulder of a narrow tar highway in coastal Mozambique, taken
on a hot overcast-bright afternoon. Weathered grey tarmac with pothole repairs and a crumbling
edge dropping to deep orange-red sand verges, thin worn centre line. Untidy rows of tall coconut
palms of uneven height on both sides, some leaning, dead brown fronds hanging, low scrappy scrub
and dry grass between the trunks, a faint sandy footpath worn alongside the road. Flat hazy
tropical light, pale sky, dust haze in the distance. Empty road, no vehicles, no signage, no
buildings. [+ realism spec] Square framing.
```
