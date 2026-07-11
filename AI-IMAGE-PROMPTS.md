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
