import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { FloatButtons } from "@/components/FloatButtons";
import { Photo } from "@/components/Photo";
import { IconWhatsApp } from "@/components/Icons";
import { journalCover } from "@/lib/images";
import { site, availabilityUrl } from "@/lib/site";
import { getAllPosts, getPost, formatDate } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  const ogImage = post.cover ?? journalCover(post.category).src;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [{ url: ogImage }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const coverSrc = post.cover ?? journalCover(post.category).src;
  const coverAlt = post.coverAlt || journalCover(post.category).alt;

  // JSON-LD for SEO — Article + (optional) FAQPage
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${site.url}${coverSrc}`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    keywords: post.keywords.join(", "),
    mainEntityOfPage: `${site.url}/journal/${post.slug}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name },
  };
  const faqLd = post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <SiteNav />
      <main id="top">
        <article className="container-px pt-32">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/journal"
              className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-teal hover:text-coral"
            >
              ← All field notes
            </Link>

            <div className="mt-6 flex flex-wrap gap-3 font-heading text-[11px] font-semibold uppercase tracking-[0.16em] text-coral">
              <span>{post.category}</span>
              <span className="text-golden">·</span>
              <span className="text-deepsea/50">{formatDate(post.date)}</span>
              <span className="text-golden">·</span>
              <span className="text-deepsea/50">{post.readingTime}</span>
            </div>

            <h1 className="mt-4 font-heading text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] text-deepsea">
              {post.title}
            </h1>
            <p className="mt-5 font-body text-lg leading-relaxed text-deepsea/70">
              {post.description}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <Photo
              src={coverSrc}
              alt={coverAlt}
              priority
              className="aspect-[3/2] w-full sm:aspect-[16/9]"
              sizes="(max-width:896px) 100vw, 896px"
            />
          </div>

          <div className="prose-izmaan mx-auto mt-12 max-w-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* FAQ — rendered + emitted as FAQPage schema */}
          {post.faq.length > 0 && (
            <section className="mx-auto mt-14 max-w-3xl">
              <h2 className="font-heading text-2xl font-semibold text-deepsea sm:text-3xl">
                Frequently asked questions
              </h2>
              <div className="mt-6 divide-y divide-teal/15 overflow-hidden rounded-2xl border border-teal/15 bg-white">
                {post.faq.map((f, i) => (
                  <details key={i} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-semibold text-deepsea">
                      {f.q}
                      <span className="text-coral transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 font-body text-[15px] leading-relaxed text-deepsea/70">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-mist/50 p-8 text-center sm:p-10">
            <h2 className="font-heading text-2xl font-semibold text-deepsea">
              Planning a trip to Pomene?
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed text-deepsea/70">
              We'll help you plan every step — the drive, the dates, the season.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a href={availabilityUrl()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                <IconWhatsApp className="h-4 w-4" />
                Check availability
              </a>
              <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-coral">
                Book on Booking.com ↗
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <FloatButtons />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </>
  );
}
