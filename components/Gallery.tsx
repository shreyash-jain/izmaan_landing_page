"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "./Photo";
import { img } from "@/lib/images";

const shots = img.gallery;

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      if (active === null) return;
      if (e.key === "ArrowRight") setActive((i) => ((i ?? 0) + 1) % shots.length);
      if (e.key === "ArrowLeft")
        setActive((i) => ((i ?? 0) - 1 + shots.length) % shots.length);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Move focus into the lightbox on open; restore it to the thumbnail on close.
  useEffect(() => {
    if (active !== null) {
      closeRef.current?.focus();
    } else {
      lastFocused.current?.focus();
      lastFocused.current = null;
    }
  }, [active]);

  function open(i: number, e: React.MouseEvent<HTMLButtonElement>) {
    lastFocused.current = e.currentTarget;
    setActive(i);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {shots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => open(i, e)}
            className={`group focus:outline-none ${i % 5 === 0 ? "col-span-2" : ""}`}
            aria-label={`Open image: ${s.alt}`}
          >
            <Photo
              src={s.src}
              alt={s.alt}
              className="aspect-[4/3] w-full transition duration-500 group-hover:shadow-lift"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-deepsea/80 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={shots[active].alt}
        >
          <button
            ref={closeRef}
            type="button"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 font-heading text-lg text-deepsea"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Photo
              src={shots[active].src}
              alt={shots[active].alt}
              className="aspect-[16/10] w-full"
              sizes="90vw"
            />
            <p className="mt-3 text-center font-body text-sm text-mist/90">
              {shots[active].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
