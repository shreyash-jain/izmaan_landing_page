// Minimal line icons (currentColor, 1.6 stroke) — replaces emoji for a
// calmer, more premium feel.
type P = { className?: string };
const base = (className = "") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const IconDiving = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 16c2 0 2 1.5 4 1.5S11 16 13 16s2 1.5 4 1.5S20 16 21 16" />
    <circle cx="12" cy="7" r="3" />
    <path d="M12 10v3M7 11l-2-2M17 11l2-2" />
  </svg>
);

export const IconSnorkel = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M4 9a4 4 0 0 1 8 0v2a3 3 0 0 0 6 0V8" />
    <path d="M18 8V5M3 18c2 0 2 1.5 4 1.5S11 18 13 18s2 1.5 4 1.5S20 18 21 18" />
  </svg>
);

export const IconFish = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 12c3-5 9-6 14-3 1.5.9 3 2.2 4 3-1 .8-2.5 2.1-4 3-5 3-11 2-14-3Z" />
    <path d="M17 9.5l3-2.5M17 14.5l3 2.5" />
    <circle cx="8" cy="11" r=".6" fill="currentColor" />
  </svg>
);

export const IconRuins = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 21V8l3-2 3 2v13M15 21V8l3-2 3 2v13" />
    <path d="M3 21h18M6 11v6M18 11v6M9 21V13h6v8" />
  </svg>
);

export const IconBlowhole = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 3c0 3-3 3-3 6a3 3 0 0 0 6 0c0-3-3-3-3-6Z" />
    <path d="M3 19c2 0 2 1.5 4 1.5S11 19 13 19s2 1.5 4 1.5S20 19 21 19" />
  </svg>
);

export const IconMangrove = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 21v-7M12 14c-2-1-3-3-3-5M12 14c2-1 3-3 3-5" />
    <path d="M5 21c0-3 2-4 3-6M19 21c0-3-2-4-3-6M9 21c0-2 1-3 3-4 2 1 3 2 3 4" />
  </svg>
);

export const IconWave = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M3 14c2 0 2-1.5 4-1.5S11 14 13 14s2-1.5 4-1.5S20 14 21 14" />
    <path d="M3 18c2 0 2-1.5 4-1.5S11 18 13 18s2-1.5 4-1.5S20 18 21 18" />
  </svg>
);

export const IconSun = ({ className }: P) => (
  <svg {...base(className)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
  </svg>
);

export const IconPin = ({ className }: P) => (
  <svg {...base(className)}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

// WhatsApp brand glyph — filled (uses currentColor so it inherits button text).
export const IconWhatsApp = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden={true}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15c-1.52 0-3.01-.41-4.3-1.18l-.31-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.35c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01a.92.92 0 00-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
  </svg>
);
