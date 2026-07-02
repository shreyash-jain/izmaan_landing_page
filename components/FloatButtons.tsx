import { site } from "@/lib/site";

// Floating "Book on Booking.com" button (bottom-right), in Booking.com's
// brand blue with their "Booking.com" mark.
export function FloatButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <a
        href={site.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book on Booking.com"
        title="Book on Booking.com"
        className="flex items-center gap-2 rounded-full bg-[#003580] px-4 py-3 shadow-lift transition hover:scale-105 hover:bg-[#00224f]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white font-heading text-lg font-bold leading-none text-[#003580]">
          B.
        </span>
        <span className="pr-1 font-body text-sm font-semibold tracking-tight text-white">
          Booking<span className="text-[#0896ff]">.com</span>
        </span>
      </a>
    </div>
  );
}
