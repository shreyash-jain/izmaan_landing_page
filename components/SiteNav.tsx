"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navLinks, headerLinks, site } from "@/lib/site";
import { AmbientSound } from "./AmbientSound";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

  // Drawer a11y: Escape closes it, focus moves into the drawer on open and
  // returns to the hamburger on close.
  useEffect(() => {
    if (!open) return;
    const openBtn = openBtnRef.current; // hamburger to restore focus to on close
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      openBtn?.focus();
    };
  }, [open]);

  const Wordmark = (
    <Link href="/" aria-label={`${site.name} home`} className="flex items-center gap-2.5">
      <Image
        src="/images/logo-mark.png"
        alt=""
        width={240}
        height={240}
        priority
        className="h-10 w-10 lg:h-11 lg:w-11"
      />
      <span className="font-heading text-lg font-semibold tracking-[0.3em] text-deepsea">
        {site.wordmark}
      </span>
    </Link>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-teal/15 bg-sand/90 backdrop-blur-md"
            : "bg-sand/70 backdrop-blur-sm"
        }`}
      >
        <nav className="inner container-px flex items-center justify-between py-3">
          {Wordmark}

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

          {/* mobile hamburger — opens the drawer */}
          <button
            ref={openBtnRef}
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-teal/25 bg-white/70 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <div className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-deepsea" />
              <span className="block h-0.5 w-5 bg-deepsea" />
              <span className="block h-0.5 w-5 bg-deepsea" />
            </div>
          </button>
        </nav>
      </header>

      {/* mobile drawer — sibling of the (blurred) header so it covers the full viewport */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[70] flex flex-col bg-sand px-6 pb-10 pt-4 transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          {Wordmark}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-teal/25 bg-white/70 text-xl text-deepsea"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="mt-6 flex flex-col">
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
        <div className="mt-auto flex items-center justify-between gap-4 pt-8">
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
    </>
  );
}
