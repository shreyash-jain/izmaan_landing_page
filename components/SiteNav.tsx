"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, headerLinks, site } from "@/lib/site";
import { AmbientSound } from "./AmbientSound";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-teal/15 bg-sand/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="inner container-px flex items-center justify-between py-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-[0.26em] text-deepsea"
          aria-label={`${site.name} home`}
        >
          {site.wordmark}
        </Link>

        {/* desktop links — centred, generous spacing */}
        <ul className="hidden items-center gap-9 font-heading text-[11px] font-semibold uppercase tracking-[0.13em] text-deepsea/70 lg:flex">
          {headerLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-teal">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <AmbientSound compact />
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-coral !px-5 !py-2.5 text-xs"
          >
            Check availability
          </a>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-teal/25 bg-white/60 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-deepsea transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-5 bg-deepsea transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-5 bg-deepsea transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-sand px-6 pb-10 pt-24 transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-teal/10 py-4 font-heading text-2xl font-medium text-deepsea"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center justify-between gap-4">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn-coral flex-1"
          >
            Check availability
          </a>
          <AmbientSound compact />
        </div>
      </div>
    </header>
  );
}
