import Script from "next/script";
import { site } from "@/lib/site";

// ── Google Analytics 4 tag ──────────────────────────────────────────────
// Baked in at build time (this is a static export, so there is no runtime
// env). The ID is public by design — it ships in the page source of every
// GA-tracked site on the web — unlike the Data API service-account
// credentials, which are server-side only and live in the Pages Function.
//
// Defaults to the ID in lib/site.ts so the tag can't go missing just because
// an environment variable wasn't set on some host; NEXT_PUBLIC_GA_MEASUREMENT_ID
// overrides it for a build that should report to a different property.

const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || site.gaMeasurementId;

export function Analytics() {
  if (!MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
