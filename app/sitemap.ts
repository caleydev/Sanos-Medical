import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

// Every public route (locale-agnostic paths). Both locales are emitted, each
// with hreflang alternates pointing at its siblings.
const PATHS = [
  "",
  "/get-started",
  // "/get-started/recovery-regen" is intentionally omitted: the Recovery & Regen
  // funnel must stay non-crawlable while its LAUNCH GATE is pending (see
  // content/TODO.md). Re-add this path as part of the launch-gate checklist once
  // licensed-provider + healthcare-attorney sign-off clears.
  "/about",
  "/services",
  "/services/primary-care",
  "/services/labs",
  "/services/weight-management",
  "/services/glp-1",
  "/patient-resources",
  "/contact",
  "/legal/privacy",
  "/legal/hipaa-notice",
  "/legal/terms",
  "/legal/accessibility",
  "/legal/medical-disclaimer",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
