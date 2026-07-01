// Central image manifest.
//
// LODGE & ROOM photos (real) — the owners' own photographs, sourced from their
// official listings: the Booking.com gallery (cf.bstatic.com) and the LAM /
// Revista Índico press feature. These are genuine Iz-Ma-An Lodge images.
//
// ATMOSPHERE photos (ocean / reef / wildlife / activities) — licensed Unsplash
// imagery used only for surrounding location & activity context, per KT rules.
// Several of these filenames may be overwritten with AI-generated images
// (see AI-IMAGE-PROMPTS.md) — the slots don't care, they just load the file.

export type Img = { src: string; alt: string; ownerSlot?: boolean };

const L = "/images/lodge"; // real lodge photos (Booking.com + press feature)

export const img = {
  // ── Hero (AI-generated coastal hero, or fallback beach photo) ───────
  hero: { src: "/images/hero.jpg", alt: "The turquoise Indian Ocean and white-sand beach at Pomene, Mozambique" },
  // Real lodge exterior (used in the Lodge section & gallery):
  lodgeOnDune: { src: `${L}/724091683.jpg`, alt: "Iz-Ma-An Lodge — thatched beach house on the dune above the Indian Ocean, Pomene" },

  // ── Real lodge photos ──────────────────────────────────────────────
  lodgeExterior: { src: `${L}/720380574.jpg`, alt: "The lodge's elevated unit with its blue wraparound balcony on the dune" },
  deck: { src: "/images/lodge-real-2.jpg", alt: "The lodge's open, sea-facing living space" },
  roomSeaBreeze: { src: `${L}/720379117.jpg`, alt: "En-suite bedroom with twin wooden beds and white mosquito netting" },
  roomPalmShade: { src: `${L}/720380286.jpg`, alt: "En-suite bedroom with a wooden headboard and draped mosquito net" },
  bathroom: { src: `${L}/720380435.jpg`, alt: "Wood-panelled en-suite bathroom with a glass shower" },
  kitchen: { src: `${L}/720379827.jpg`, alt: "Self-catering kitchen and dining area with thatched ceiling" },
  dining: { src: `${L}/720380618.jpg`, alt: "Wood-panelled dining area under the thatch" },

  // ── Atmosphere / location ──────────────────────────────────────────
  sunrise: { src: "/images/sunrise.jpg", alt: "Sunrise over the ocean on the Mozambique coast" },
  beachWalk: { src: "/images/beach-walk.jpg", alt: "Walking a quiet white-sand beach at first light" },

  whale: { src: "/images/ocean-aerial.jpg", alt: "Open ocean off Pomene where humpback whales migrate" },
  turtle: { src: "/images/turtle.jpg", alt: "Sea turtle swimming over a reef" },
  reef: { src: "/images/reef-diver.jpg", alt: "Diver above an untouched coral reef" },
  kite: { src: "/images/kite.jpg", alt: "Kitesurfing on a wide coastal lagoon" },

  diving: { src: "/images/reef-diver.jpg", alt: "Scuba diving over coral off Pomene" },
  snorkel: { src: "/images/snorkel.jpg", alt: "Snorkelling in clear shallow water" },
  fishing: { src: "/images/fishing-boat.jpg", alt: "Fishing boat on calm coastal water" },
  ruins: { src: "/images/coast-rugged.jpg", alt: "Rugged shoreline near the old Pomene hotel ruins" },
  blowholes: { src: "/images/wave.jpg", alt: "Sea surging through rocks at the point" },
  mangroves: { src: "/images/mangrove.jpg", alt: "Quiet mangrove channels behind the peninsula" },

  // ── Gallery — all real Iz-Ma-An Lodge photos (8 from Booking.com + 2 press) ──
  gallery: [
    { src: `${L}/724091683.jpg`, alt: "Iz-Ma-An Lodge on the dune with the ocean beyond" },
    { src: `${L}/720380574.jpg`, alt: "The lodge unit with its blue wraparound balcony" },
    { src: "/images/lodge-real-1.jpg", alt: "The lodge above the beach at Pomene" },
    { src: `${L}/720379117.jpg`, alt: "En-suite bedroom with twin wooden beds and mosquito nets" },
    { src: `${L}/720380286.jpg`, alt: "En-suite bedroom with a draped mosquito net" },
    { src: `${L}/720379827.jpg`, alt: "Self-catering kitchen and dining space" },
    { src: `${L}/720380618.jpg`, alt: "Dining area beneath the thatch" },
    { src: `${L}/720380435.jpg`, alt: "Wood-panelled en-suite bathroom with a glass shower" },
    { src: `${L}/720379382.jpg`, alt: "En-suite bathroom with pedestal basin" },
    { src: "/images/lodge-real-2.jpg", alt: "The lodge's open, sea-facing living space" },
  ],

  // ── Journal default covers by category ─────────────────────────────
  journal: {
    "Travel Guide": { src: "/images/coast-aerial.jpg", alt: "Aerial view of the Pomene coastline" },
    "Getting There": { src: "/images/beach-walk.jpg", alt: "Sand track and shoreline near Pomene" },
    Seasons: { src: "/images/ocean-aerial.jpg", alt: "Open ocean where whales migrate" },
    "Pack List": { src: "/images/tropical.jpg", alt: "Tropical beach scene" },
    "Off-Grid": { src: "/images/sunrise.jpg", alt: "Off-grid sunrise over the sea" },
    Wildlife: { src: "/images/turtle.jpg", alt: "Sea turtle in clear water" },
    default: { src: "/images/beach-turq.jpg", alt: "Pomene coastal scene" },
  } as Record<string, Img>,
} as const;

export function journalCover(category: string): Img {
  return img.journal[category] ?? img.journal.default;
}
