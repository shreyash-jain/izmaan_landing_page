"use client";

import { site } from "@/lib/site";

// Hero booking bar. Dates/guests are a friendly hand-off to the Booking.com
// engine, which handles real availability.
export function BookingBar() {
  function checkAvailability(e: React.FormEvent) {
    e.preventDefault();
    window.open(site.bookingUrl, "_blank", "noopener,noreferrer");
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
        <input id="arrive" name="arrive" type="date" className={field} />
      </div>
      <div className="min-w-[130px] flex-1">
        <label htmlFor="depart" className={label}>
          Depart
        </label>
        <input id="depart" name="depart" type="date" className={field} />
      </div>
      <div className="min-w-[130px] flex-1">
        <label htmlFor="guests" className={label}>
          Guests
        </label>
        <select id="guests" name="guests" className={field}>
          <option>2 adults</option>
          <option>2 adults · 2 children</option>
          <option>4 adults</option>
          <option>Whole lodge (8)</option>
        </select>
      </div>
      <button type="submit" className="btn-coral min-w-[170px] flex-1 !py-3">
        Check availability
      </button>
    </form>
  );
}
