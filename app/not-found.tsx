import Link from "next/link";

export default function NotFound() {
  return (
    <main id="top" className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <div className="eyebrow">Pomene · Mozambique</div>
      <h1 className="mt-4 font-heading text-5xl font-bold text-deepsea">
        Lost on the dune
      </h1>
      <p className="mt-4 max-w-md font-body text-[17px] leading-relaxed text-deepsea/70">
        This page drifted out with the tide. Let's get you back to the lodge.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-coral">
          Back to the lodge
        </Link>
        <Link href="/journal" className="btn-outline">
          Read the journal
        </Link>
      </div>
    </main>
  );
}
