// Central site configuration — single source of truth for brand, contact and booking.
// Anything that might change before launch lives here so it's a one-line edit.

export const site = {
  name: "Izmaan Lodge",
  wordmark: "IZMAAN", // letter-spaced logotype
  // KT note: standardise "Izmaan" vs "Iz-Ma-An" to match the renamed Google listing.
  tagline: "Never want to go home",
  location: "Pomene · Mozambique",
  description:
    "A luxury self-catering beachfront lodge on a dune above the Indian Ocean in Pomene, Mozambique. Four en-suite bedrooms across two units, solar-powered, 100m from white sand.",
  url: "https://izmaan.co.za",

  // Booking engine — Booking.com listing (client-supplied link).
  bookingUrl:
    "https://www.booking.com/hotel/mz/izmaan-lodge-pomene.en-gb.html?label=gen173nr-10CAsoogFCE2l6bWFhbi1sb2RnZS1wb21lbmVIM1gEaGyIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AqDJ-dEGwAIB0gIkYTg3NDJkMTAtY2ZiYi00MzA4LWJlMjQtMDc1ZDIzYjgzODJi2AIB4AIB&sid=1ff73efaedfbebae15dd643171487e38&dist=0&keep_landing=1&sb_price_type=total&type=total&",

  // ⚠️ VERIFY BEFORE LAUNCH (KT flags two numbers):
  //   +27 82 374 4676  (South Africa)  ·  +258 84 570 5769 (Mozambique)
  // Using the SA number, as in the approved design. Swap here if needed.
  whatsappNumber: "27823744676",
  // Human-readable form of whatsappNumber — used anywhere the number is shown.
  // Keep in sync with whatsappNumber above (single source for the displayed value).
  whatsappDisplay: "+27 82 374 4676",
  whatsappText:
    "Hi Izmaan Lodge, I'd love to enquire about a stay in Pomene.",

  // Location — Pomene peninsula, Inhambane Province, Mozambique.
  // Exact pin from the lodge's Google listing ("Izmaan Madelaine").
  geo: { lat: -22.9288118, lng: 35.6012083, approximate: false },
  address: {
    locality: "Pomene",
    region: "Inhambane Province",
    country: "Mozambique",
    countryCode: "MZ",
  },
  nearestAirport: "Vilankulo (VNX) — approx. 106 km",

  social: {
    facebook: "https://www.facebook.com/izmaanlodge",
  },

  press: {
    indico:
      "https://www.indico-lam.com/en/2020/12/17/iz-ma-an-lodge-with-an-open-mind",
  },

  builtBy: "Vidyayatan Technologies",
} as const;

export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappText
)}`;

// Google Maps link to the lodge's named listing at its exact pin
// (opens the "Izmaan Madelaine" place in the user's map app).
export const mapsUrl = `https://www.google.com/maps/place/Izmaan+Madelaine/@${site.geo.lat},${site.geo.lng},17z`;

// Full set — used in the footer and the mobile menu (which have room).
export const navLinks = [
  { href: "/#story", label: "Story" },
  { href: "/#lodge", label: "The Lodge" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#things-to-do", label: "Things to Do" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/#getting-there", label: "Getting There" },
];

// Concise set — used in the desktop top bar so it stays spacious.
export const headerLinks = [
  { href: "/#lodge", label: "The Lodge" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/journal", label: "Journal" },
  { href: "/#getting-there", label: "Getting There" },
];
