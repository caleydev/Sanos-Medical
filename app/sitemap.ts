import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { routing } from "@/i18n/routing";

// Every public route (locale-agnostic paths). Both locales are emitted, each
// with hreflang alternates pointing at its siblings.
const PATHS = [
  "",
  "/get-started",
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
