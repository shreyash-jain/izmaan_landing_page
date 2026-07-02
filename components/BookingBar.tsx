"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/site";

// Hero booking bar. The dates/guests the visitor picks are carried straight
// into the Booking.com engine as deep-link params, so they don't have to
// re-enter them — Booking.com then handles real availability + pricing.
type GuestKey = "2a" | "2a2c" | "4a" | "lodge";
const GUESTS: Record<GuestKey, { label: string; adults: number; children: number }> = {
  "2a": { label: "2 adults", adults: 2, children: 0 },
  "2a2c": { label: "2 adults · 2 children", adults: 2, children: 2 },
  "4a": { label: "4 adults", adults: 4, children: 0 },
  lodge: { label: "Whole lodge (8)", adults: 8, children: 0 },
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export function BookingBar() {
  const today = todayISO();
  const [arrive, setArrive] = useState("");
  const [depart, setDepart] = useState("");
  const [guests, setGuests] = useState<GuestKey>("2a");

  // Keep depart valid whenever arrive changes.
  function onArrive(v: string) {
    setArrive(v);
    if (v && (!depart || depart <= v)) setDepart(addDays(v, 1));
  }

  const bookingHref = useMemo(() => {
    const g = GUESTS[guests];
    const url = new URL(site.bookingUrl);
    if (arrive) url.searchParams.set("checkin", arrive);
    if (depart) url.searchParams.set("checkout", depart);
    url.searchParams.set("group_adults", String(g.adults));
    url.searchParams.set("group_children", String(g.children));
    url.searchParams.set("no_rooms", "1");
    return url.toString();
  }, [arrive, depart, guests]);

  function checkAvailability(e: React.FormEvent) {
    e.preventDefault();
    window.open(bookingHref, "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full rounded-xl border border-teal/20 bg-white px-3.5 py-3 font-body text-sm text-deepsea outline-none focus:border-teal focus:ring-2 focus:ring-teal/20";
  const label =
    "mb-2 block font-heading text-[10px] font-semibold uppercase tracking-[0.16em] text-teal";

  return (
    <form
      onSubmit={checkAvailability}
      className="mx-auto flex max-w-3xl flex-wrap items-end gap-3 rounded-2xl border border-teal/15 bg-white/80 p-4 shadow-card backdrop-blur-md sm:gap-4 sm:p-5"
    >
      <div className="min-w-[130px] flex-1">
        <label htmlFor="arrive" className={label}>
          Arrive
        </label>
        <input
          id="arrive"
          name="arrive"
          type="date"
          min={today}
          value={arrive}
          onChange={(e) => onArrive(e.target.value)}
          className={field}
        />
      </div>
      <div className="min-w-[130px] flex-1">
        <label htmlFor="depart" className={label}>
          Depart
        </label>
        <input
          id="depart"
          name="depart"
          type="date"
          min={arrive ? addDays(arrive, 1) : addDays(today, 1)}
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
          className={field}
        />
      </div>
      <div className="min-w-[130px] flex-1">
        <label htmlFor="guests" className={label}>
          Guests
        </label>
        <select
          id="guests"
          name="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value as GuestKey)}
          className={field}
        >
          {(Object.keys(GUESTS) as GuestKey[]).map((k) => (
            <option key={k} value={k}>
              {GUESTS[k].label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-coral min-w-[170px] flex-1 !py-3">
        Check availability
      </button>
    </form>
  );
}
