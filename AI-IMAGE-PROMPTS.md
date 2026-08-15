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
