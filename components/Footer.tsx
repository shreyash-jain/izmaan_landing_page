import Link from "next/link";
import { navLinks, site, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-deepsea text-sand">
      <div className="inner container-px grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="font-heading text-2xl font-semibold tracking-[0.34em] text-sand">
            {site.wordmark}
          </div>
          <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-mist/80">
            A family-run luxury lodge on a dune in Pomene, Mozambique. Open doors,
            no locks — never want to go home.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="pill !border-mist/20 !bg-white/5 !text-mist">Beachfront</span>
            <span className="pill !border-mist/20 !bg-white/5 !text-mist">Solar powered</span>
            <span className="pill !border-mist/20 !bg-white/5 !text-mist">4 en-suite rooms</span>
          </div>
        </div>

        <div>
          <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-golden">
            Explore
          </div>
          <ul className="mt-4 flex flex-col gap-3 font-body text-sm text-mist/80">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-sand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-heading text-[11px] font-semibold uppercase tracking-[0.18em] text-golden">
            Connect
          </div>
          <ul className="mt-4 flex flex-col gap-3 font-body text-sm text-mist/80">
            <li>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-sand">
                WhatsApp ↗
              </a>
            </li>
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="transition hover:text-sand">
                Facebook ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-mist/15">
        <div className="inner container-px flex flex-wrap justify-between gap-3 py-6 font-body text-xs text-mist/60">
          <span>© {new Date().getFullYear()} {site.name} · Pomene, Mozambique</span>
        </div>
      </div>
    </footer>
  );
}
