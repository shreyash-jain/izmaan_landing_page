import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { FloatButtons } from "@/components/FloatButtons";
import { Reveal } from "@/components/Reveal";
import { Photo } from "@/components/Photo";
import { journalCover } from "@/lib/images";
import { getAllPostMeta, formatDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Journal — Field notes from Pomene",
  description:
    "Travel guides, season notes and stories from Pomene, Mozambique — how to get there, when to visit, what to pack, and life off-grid at Izmaan Lodge.",
  alternates: { canonical: "/journal" },
};

export default function JournalIndex() {
  const posts = getAllPostMeta();

  return (
    <>
      <SiteNav />
      <main id="top">
        {/* header */}
        <section className="container-px pb-4 pt-32">
          <div className="inner max-w-3xl">
            <Link
              href="/"
              className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal hover:text-coral"
            >
              ← Back to lodge
            </Link>
            <h1 className="mt-6 font-heading text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[1.05] text-deepsea">
              The Journal
            </h1>
            <p className="mt-5 font-body text-[17px] leading-relaxed text-deepsea/70">
              Field notes from the dune — travel guides, season notes and stories
              from one of the last quiet corners of the Mozambican coast.
            </p>
          </div>
        </section>

        {/* grid */}
        <section className="section container-px pt-10">
          <div className="inner grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => {
              const c = journalCover(p.category);
              return (
                <Reveal key={p.slug} delay={(i % 3) * 90}>
                  <Link
                    href={`/journal/${p.slug}`}
                    className="card group flex h-full flex-col overflow-hidden hover:shadow-lift"
                  >
                    <Photo
                      src={p.cover ?? c.src}
                      alt={p.coverAlt || c.alt}
                      className="aspect-[16/10] w-full"
                      rounded="rounded-none"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex gap-3 font-heading text-[11px] font-semibold uppercase tracking-[0.14em] text-coral">
                        <span>{p.category}</span>
                        <span className="text-golden">·</span>
                        <span className="text-deepsea/50">{p.readingTime}</span>
                      </div>
                      <h2 className="mt-3 font-heading text-xl font-semibold leading-snug text-deepsea">
                        {p.title}
                      </h2>
                      <p className="mt-2 flex-1 font-body text-[14px] leading-relaxed text-deepsea/65">
                        {p.description}
                      </p>
                      <div className="mt-4 font-body text-xs text-deepsea/45">
                        {formatDate(p.date)}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
      <FloatButtons />
    </>
  );
}
