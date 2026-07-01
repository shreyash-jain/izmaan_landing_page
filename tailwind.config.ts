import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Iz-Ma-An brand palette — bright, breezy coastal luxury
        sand: "#FBF7EF", // main page background
        teal: {
          DEFAULT: "#16B5AC", // Lagoon Teal — primary brand
          deep: "#0E948C",
        },
        coral: {
          DEFAULT: "#FF7A59", // Coral Sunset — actions/CTAs only
          deep: "#F0603C",
        },
        deepsea: "#0B3A40", // text + headings (never pure black)
        mist: "#CFEAE7", // Sky Mist — section tints / cards
        golden: "#F6C56B", // Golden Sand — small sunny highlights
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(11,58,64,0.08)",
        card: "0 16px 44px rgba(11,58,64,0.10)",
        lift: "0 22px 60px rgba(11,58,64,0.14)",
      },
      maxWidth: {
        content: "1160px",
      },
      keyframes: {
        kenburns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.12)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(7px)" },
        },
        floatUp: {
          from: { opacity: "0", transform: "translateY(26px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        kenburns: "kenburns 22s ease-in-out infinite alternate",
        bob: "bob 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
