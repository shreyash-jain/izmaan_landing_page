import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { FloatButtons } from "@/components/FloatButtons";
import { BookingBar } from "@/components/BookingBar";
import { Gallery } from "@/components/Gallery";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import {
  IconDiving,
  IconSnorkel,
  IconFish,
  IconRuins,
  IconBlowhole,
  IconMangrove,
  IconWave,
  IconSun,
  IconPin,
  IconWhatsApp,
} from "@/components/Icons";
import { site, whatsappUrl, mapsUrl, availabilityUrl } from "@/lib/site";
import { img, journalCover } from "@/lib/images";
import { getAllPostMeta, formatDate } from "@/lib/posts";

// LodgingBusiness structured data — lets Google understand this is a lodge in
// Pomene with a location, rooms and amenities (local-SEO / rich results).
const lodgingLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  image: [
    `${site.url}/og.jpg`,
    `${site.url}${img.lodgeExterior.src}`,
    `${site.url}${img.roomSeaBreeze.src}`,
  ],
  telephone: site.whatsappDisplay,
  address: {
    "@type": "PostalAddress",
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.lat,
    longitude: site.geo.lng,
  },
  hasMap: mapsUrl,
  numberOfRooms: 4,
  petsAllowed: false,
  smokingAllowed: false,
  currenciesAccepted: "ZAR, USD, MZN",
  sameAs: [site.social.facebook],
  amenityFeature: [
    "Beachfront",
    "Solar power",
    "Self-catering kitchen",
    "En-suite bathrooms",
    "Sea view",
    "Free parking",
  ].map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
};

export default function HomePage() {
  const posts = getAllPostMeta();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingLd) }}
      />
      <SiteNav />
      <main>
        <Hero />
        <Story />
        <Philosophy />
        <Lodge />
        <Experiences />
        <ThingsToDo />
        <GallerySection />
        <GettingThere />
        <Packages />
        <Journal featured={featured} rest={rest} />
        <BookConnect />
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* full-bleed lodge photo, dimmed so the text reads clearly */}
      <div className="absolute inset-0 -z-10">
        <Photo
          src={img.hero.src}
          alt={img.hero.alt}
          priority
          rounded="rounded-none"
          sizes="100vw"
          className="h-full w-full"
          imgClassName="object-[center_56%]"
        />
        {/* dim + teal tint → photo recedes, text pops */}
        <div className="absolute inset-0 bg-deepsea/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-deepsea/75 via-deepsea/35 to-deepsea/55" />
      </div>

      <div className="inner container-px flex flex-1 flex-col justify-center pb-10 pt-28 text-center">
        <Reveal>
          <div className="mx-auto mb-5 flex flex-wrap items-center justify-center gap-2.5">
            <Pill icon={<IconPin className="h-3.5 w-3.5" />}>{site.location}</Pill>
            <Pill icon={<IconWave className="h-3.5 w-3.5" />}>Beachfront · 100m to sand</Pill>
            <Pill icon={<IconSun className="h-3.5 w-3.5" />}>Solar powered</Pill>
          </div>
          <h1 className="mx-auto max-w-4xl font-heading text-[clamp(2.5rem,6.4vw,4.8rem)] font-semibold leading-[1.04] tracking-tight text-white [text-shadow:0_2px_24px_rgba(11,58,64,0.45)]">
            Wake to the sound of the <span className="italic text-golden">waves</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-white/90 sm:text-lg [text-shadow:0_1px_12px_rgba(11,58,64,0.5)]">
            A family-run, self-catering lodge on a dune above the Indian Ocean —
            four en-suite rooms across two thatched units, solar-powered, your own
            stretch of white sand.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-9 w-full">
          <BookingBar />
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-0 right-0 z-10 animate-bob text-center font-heading text-[10px] font-semibold uppercase tracking-[0.3em] text-white/75">
        Scroll
      </div>
    </section>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-white/75 px-4 py-2 font-heading text-xs font-medium text-deepsea/80 backdrop-blur">
      <span className="text-teal">{icon}</span>
      {children}
    </span>
  );
}

/* ───────────────────────── STORY / ABOUT ───────────────────────── */
function Story() {
  return (
    <section id="story" className="section container-px">
      <div className="inner grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="eyebrow mb-6">01 — The Story</div>
          <blockquote className="font-heading text-[clamp(1.6rem,3.2vw,2.5rem)] font-medium leading-[1.25] text-deepsea">
            “I came just after the war, and I just knew I would never want to
            stay in any other place.”
          </blockquote>
          <p className="mt-7 max-w-lg font-body text-[17px] leading-relaxed text-deepsea/70">
            Madelaine first arrived in Pomene in the late nineties. Months later
            she came back with her father — he'd heard it was the finest fishing
            on the coast. He bought his first property soon after, the family
            followed, and Pomene quietly became home across three generations.
          </p>
          <p className="mt-5 max-w-lg font-body text-[17px] leading-relaxed text-deepsea/70">
            A father-and-daughter journey that became a family home — and the
            reason we build for people who come back, not just people who visit
            once.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <Photo
            src={img.deck.src}
            alt={img.deck.alt}
            className="aspect-[4/5] w-full shadow-card"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── PHILOSOPHY (teal band) ───────────────────────── */
function Philosophy() {
  return (
    <section id="philosophy" className="bg-teal text-white">
      <div className="section container-px text-center">
        <Reveal className="mx-auto max-w-3xl">
          <div className="mb-7 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-mist">
            02 — The Philosophy
          </div>
          <p className="font-heading text-[clamp(1.8rem,4vw,3rem)] font-medium leading-[1.2] text-white">
            An open mind, <span className="italic text-golden">no locks.</span>{" "}
            Doors here stay open — and so do the people who walk through them.
          </p>
          <p className="mx-auto mt-8 max-w-xl font-body text-[17px] leading-relaxed text-mist/90">
            Featured in Revista Índico's "open mind, no locks" piece, Izmaan was
            built on a simple idea: trust, space, and the quiet that only a place
            this remote can give you.
          </p>
          <a
            href={site.press.indico}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border-b border-white/50 pb-1 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-golden hover:text-golden"
          >
            Read the feature
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── THE LODGE / ROOMS ───────────────────────── */
const stats = [
  { n: "4", l: "En-suite bedrooms" },
  { n: "2", l: "Private units" },
  { n: "100%", l: "Solar powered" },
  { n: "100m", l: "To white sand" },
];

const rooms = [
  {
    name: "Sea Breeze Unit",
    detail: "Two en-suite bedrooms · sleeps 4",
    blurb:
      "Twin wooden-framed beds under white mosquito nets, a private bathroom, and the balcony with the blue rail looking straight out to sea.",
    image: img.roomSeaBreeze,
    pills: ["En-suite", "Sea-facing balcony", "Mosquito nets"],
  },
  {
    name: "Palm Shade Unit",
    detail: "Two en-suite bedrooms · sleeps 4",
    blurb:
      "Wood-panelled rooms with draped mosquito nets and their own en-suite, tucked into the dune a few barefoot steps from the path.",
    image: img.roomPalmShade,
    pills: ["En-suite", "Self-catering", "Solar power"],
  },
];

function Lodge() {
  return (
    <section id="lodge" className="section container-px">
      <div className="inner">
        <div className="grid items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="eyebrow mb-6">03 — The Lodge</div>
            <h2 className="font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.08] text-deepsea">
              Thatch, timber and the open sea
            </h2>
            <p className="mt-6 max-w-lg font-body text-[17px] leading-relaxed text-deepsea/70">
              Two timber-and-thatch units sit right on the dune, their blue
              balconies opening to nothing but the Indian Ocean. Inside: four
              en-suite bedrooms with wooden beds under white mosquito nets, a
              full self-catering kitchen, and a thatched dining space made for
              long, slow lunches. Solar-powered, barefoot, and entirely your own.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Photo
              src={img.lodgeExterior.src}
              alt={img.lodgeExterior.alt}
              className="aspect-[16/10] w-full shadow-card"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>

        {/* room cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {rooms.map((r, i) => (
            <Reveal key={r.name} delay={i * 100}>
              <article className="card overflow-hidden hover:shadow-lift">
                <Photo
                  src={r.image.src}
                  alt={r.image.alt}
                  rounded="rounded-none"
                  className="aspect-[16/10] w-full"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="p-7">
                  <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
                    {r.detail}
                  </div>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-deepsea">
                    {r.name}
                  </h3>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-deepsea/65">
                    {r.blurb}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.pills.map((p) => (
                      <span key={p} className="pill">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* stat strip */}
        <Reveal delay={120} className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-teal/15 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.l}
              className={`bg-mist/40 p-6 ${i !== 0 ? "border-teal/15 sm:border-l" : ""}`}
            >
              <div className="font-heading text-4xl font-semibold text-teal">{s.n}</div>
              <div className="mt-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-deepsea/60">
                {s.l}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── EXPERIENCES & SEASONS ───────────────────────── */
const experiences = [
  { when: "Jul – Nov", title: "Whale watching", blurb: "Humpbacks pass close on their migration north — often near enough to watch from the deck with a coffee." },
  { when: "Oct – Mar", title: "Turtle nesting", blurb: "Loggerheads and leatherbacks haul ashore after dark to lay, on a beach dark enough for the hatchlings to find the sea." },
  { when: "All year", title: "Fishing & diving", blurb: "The reef and game fishing Madelaine's father first came for, and dives off a coast few people ever reach." },
  { when: "All year", title: "Kitesurfing", blurb: "Steady cross-shore wind over a wide, empty lagoon — and, more often than not, no one else on the water." },
];

function Experiences() {
  return (
    <section id="experiences" className="bg-mist/40">
      <div className="section container-px">
        <div className="inner">
          <Reveal className="max-w-2xl">
            <div className="eyebrow mb-6">04 — Experiences &amp; Seasons</div>
            <h2 className="font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.1] text-deepsea">
              The ocean keeps its own calendar
            </h2>
            <p className="mt-5 max-w-xl font-body text-[17px] leading-relaxed text-deepsea/70">
              Come for the whales, stay for the quiet. Every season brings
              something different — and the water stays warm right through.
            </p>
          </Reveal>

          {/* editorial almanac — season on the left, what's on to the right */}
          <div className="mt-12 border-t border-teal/15">
            {experiences.map((e, i) => (
              <Reveal key={e.title} delay={i * 70}>
                <div className="grid items-baseline gap-x-10 gap-y-2 border-b border-teal/15 py-7 sm:grid-cols-[200px_1fr]">
                  <div className="font-heading text-xl font-semibold uppercase tracking-[0.08em] text-teal">
                    {e.when}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-deepsea">
                      {e.title}
                    </h3>
                    <p className="mt-2 max-w-2xl font-body text-[16px] leading-relaxed text-deepsea/70">
                      {e.blurb}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── THINGS TO DO ───────────────────────── */
const thingsToDo = [
  { Icon: IconDiving, title: "Diving", text: "Untouched reefs and warm, clear water off a coast few divers ever reach." },
  { Icon: IconSnorkel, title: "Snorkeling", text: "Step off the beach into coral gardens and shoals of reef fish." },
  { Icon: IconFish, title: "Fishing charters", text: "Reef and game fishing — Pomene is known up the coast for it." },
  { Icon: IconRuins, title: "Old Pomene hotel ruins", text: "Wander the haunting shell of the abandoned colonial-era hotel." },
  { Icon: IconBlowhole, title: "The blow holes", text: "Watch the sea surge and spout through the rocks at the point." },
  { Icon: IconMangrove, title: "Mangroves", text: "Paddle the quiet mangrove channels behind the peninsula." },
];

function ThingsToDo() {
  return (
    <section id="things-to-do" className="section container-px">
      <div className="inner">
        <Reveal className="max-w-2xl">
          <div className="eyebrow mb-6">05 — Things to Do</div>
          <h2 className="font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.1] text-deepsea">
            Days that fill themselves
          </h2>
          <p className="mt-5 max-w-xl font-body text-[17px] leading-relaxed text-deepsea/70">
            Everything is a short walk or a short boat ride away — and just as
            often the best plan is no plan at all.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {thingsToDo.map((t, i) => (
            <Reveal key={t.title} delay={(i % 3) * 90}>
              <article className="card h-full p-7 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist/60 text-teal">
                  <t.Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-deepsea">
                  {t.title}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-deepsea/65">
                  {t.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── GALLERY ───────────────────────── */
function GallerySection() {
  return (
    <section id="gallery" className="bg-mist/40">
      <div className="section container-px">
        <div className="inner">
          <Reveal className="max-w-2xl">
            <div className="eyebrow mb-6">06 — Gallery</div>
            <h2 className="font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.1] text-deepsea">
              A few frames from the dune
            </h2>
            <p className="mt-5 max-w-xl font-body text-[17px] leading-relaxed text-deepsea/70">
              The thatched units, the mosquito-net bedrooms, the kitchen and the
              view from the balcony. Tap any image to see it larger.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <Gallery />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── GETTING THERE ───────────────────────── */
const journeyFacts = [
  { n: "106 km", t: "From Vilankulo airport — your nearest arrival point by air." },
  { n: "4×4", t: "Essential for the final sand sections. High clearance, low pressure." },
  { n: "Off-grid", t: "Solar power, no crowds, and the kind of dark sky you'd forgotten existed." },
];

function GettingThere() {
  return (
    <section id="getting-there" className="section container-px">
      <div className="inner grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="eyebrow mb-6">07 — Getting There</div>
          <h2 className="font-heading text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.1] text-deepsea">
            Remote, honestly
          </h2>
          <p className="mt-6 max-w-lg font-body text-[17px] leading-relaxed text-deepsea/70">
            The reward for a place this untouched is the journey to reach it.
            Pomene sits about 106 km from Vilankulo airport on sand tracks — a
            4×4 is essential, not optional. Tell us your plans and we'll guide
            you in, step by step.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-teal"
            >
              Ask us about the drive
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal transition hover:text-coral"
            >
              <IconPin className="h-4 w-4" />
              View on map
            </a>
          </div>
          <p className="mt-4 font-body text-sm text-deepsea/50">
            {site.address.locality}, {site.address.region},{" "}
            {site.address.country}
            {site.geo.approximate ? " · pin approximate" : ""}
          </p>
        </Reveal>
        <Reveal delay={120} className="flex flex-col gap-4">
          {journeyFacts.map((f) => (
            <div
              key={f.n}
              className="flex items-baseline gap-5 rounded-2xl border border-teal/15 bg-mist/30 p-6"
            >
              <div className="min-w-[96px] font-heading text-3xl font-semibold text-teal">
                {f.n}
              </div>
              <p className="font-body text-[15px] leading-relaxed text-deepsea/70">
                {f.t}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── STAYS / PACKAGES ───────────────────────── */
const stays = [
  {
    title: "Fishing weeks",
    when: "All year",
    blurb:
      "The reef and game fishing Pomene is known for, up the coast. Base yourself at the lodge, self-cater the catch, and fish a coastline few boats ever reach.",
  },
  {
    title: "Whale season",
    when: "Jul – Nov",
    blurb:
      "Humpbacks pass close on their migration north — often near enough to watch from the deck. Come for the season the ocean puts on its best show.",
  },
  {
    title: "Whole-lodge family stays",
    when: "All year",
    blurb:
      "Take both thatched units — four en-suite rooms, sleeps eight — and have the dune, the kitchen and your own stretch of sand entirely to yourselves.",
  },
];

function Packages() {
  return (
    <section id="packages" className="bg-mist/40">
      <div className="section container-px">
        <div className="inner">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="eyebrow mb-6">08 — Stays</div>
            <h2 className="font-heading text-[clamp(1.9rem,4.2vw,3rem)] font-semibold leading-[1.1] text-deepsea">
              Stays, curated
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-body text-[17px] leading-relaxed text-deepsea/70">
              However you like to travel, we'll help you shape the stay around it.
              Tell us your dates and we'll do the rest.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {stays.map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <article className="card flex h-full flex-col p-7 hover:-translate-y-1 hover:shadow-lift">
                  <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
                    {s.when}
                  </div>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-deepsea">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 font-body text-[15px] leading-relaxed text-deepsea/65">
                    {s.blurb}
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-block font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal transition hover:text-coral"
                  >
                    Enquire about this stay →
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── JOURNAL ───────────────────────── */
function Journal({
  featured,
  rest,
}: {
  featured: ReturnType<typeof getAllPostMeta>[number] | undefined;
  rest: ReturnType<typeof getAllPostMeta>;
}) {
  if (!featured) return null;
  const fc = journalCover(featured.category);
  return (
    <section id="journal" className="section container-px">
      <div className="inner">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <div className="eyebrow mb-6">09 — Field Notes</div>
            <h2 className="font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-semibold leading-[1.1] text-deepsea">
              Notes from the dune
            </h2>
            <p className="mt-5 font-body text-[17px] leading-relaxed text-deepsea/70">
              Travel guides, season notes and stories from Pomene — everything
              you need to plan a trip to one of the last quiet corners of the
              Mozambican coast.
            </p>
          </div>
          <Link
            href="/journal"
            className="whitespace-nowrap border-b border-teal/50 pb-1 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-teal transition hover:border-coral hover:text-coral"
          >
            View all posts
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {/* featured */}
          <Reveal className="lg:col-span-2">
            <Link href={`/journal/${featured.slug}`} className="card group block h-full overflow-hidden hover:shadow-lift">
              <Photo src={featured.cover ?? fc.src} alt={featured.coverAlt || fc.alt} rounded="rounded-none" className="aspect-[16/9] w-full" sizes="(max-width:1024px) 100vw, 66vw" />
              <div className="p-7">
                <div className="flex gap-3 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
                  <span>{featured.category}</span>
                  <span className="text-golden">·</span>
                  <span className="text-deepsea/50">{featured.readingTime}</span>
                </div>
                <h3 className="mt-3 max-w-xl font-heading text-2xl font-semibold leading-snug text-deepsea sm:text-3xl">
                  {featured.title}
                </h3>
                <span className="mt-4 inline-block font-heading text-xs font-semibold uppercase tracking-[0.14em] text-teal">
                  Read the guide →
                </span>
              </div>
            </Link>
          </Reveal>

          {/* side stack */}
          <div className="flex flex-col gap-5">
            {rest.slice(0, 2).map((p, i) => {
              const c = journalCover(p.category);
              return (
                <Reveal key={p.slug} delay={i * 100} className="flex-1">
                  <Link href={`/journal/${p.slug}`} className="card group flex h-full flex-col overflow-hidden hover:shadow-lift">
                    <Photo src={p.cover ?? c.src} alt={p.coverAlt || c.alt} rounded="rounded-none" className="h-36 w-full" sizes="(max-width:1024px) 100vw, 33vw" />
                    <div className="p-5">
                      <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                        {p.category}
                      </div>
                      <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-deepsea">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* three-up recent */}
        {rest.length > 2 && (
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {rest.slice(2, 5).map((p, i) => {
              const c = journalCover(p.category);
              return (
                <Reveal key={p.slug} delay={i * 90}>
                  <Link href={`/journal/${p.slug}`} className="card group block h-full overflow-hidden hover:shadow-lift">
                    <Photo src={p.cover ?? c.src} alt={p.coverAlt || c.alt} rounded="rounded-none" className="h-44 w-full" sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="p-6">
                      <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                        {p.category}
                      </div>
                      <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-deepsea">
                        {p.title}
                      </h3>
                      <div className="mt-3 font-body text-xs text-deepsea/50">
                        {formatDate(p.date)} · {p.readingTime}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────── BOOK / CONNECT ───────────────────────── */
function BookConnect() {
  return (
    <section id="book" className="relative overflow-hidden bg-teal text-white">
      {/* soft light wash — no stock imagery */}
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(255,255,255,0.14),transparent_60%)]" />
      <div className="section container-px relative text-center">
        <Reveal className="mx-auto max-w-2xl">
          <div className="mb-7 font-heading text-xs font-semibold uppercase tracking-[0.22em] text-mist">
            Book · Connect
          </div>
          <h2 className="font-heading text-[clamp(2.2rem,5.5vw,3.8rem)] font-semibold leading-[1.08] text-white">
            Come and stay a few times a year
          </h2>
          <p className="mx-auto mt-6 max-w-md font-body text-[17px] leading-relaxed text-mist/90">
            Madelaine's wish is simple — that guests become almost like family,
            and keep coming back. Check dates with our booking partner, or just
            message us and we'll help you plan it.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href={availabilityUrl()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <IconWhatsApp className="h-4 w-4" />
              Check availability
            </a>
            <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-coral">
              Book on Booking.com ↗
            </a>
          </div>
          <div className="mt-6 font-body text-sm text-mist/70">
            Booking via Booking.com · WhatsApp {site.whatsappDisplay}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
