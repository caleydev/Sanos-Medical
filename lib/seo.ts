import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * SEO helpers. `metadataBase` (set in the locale layout) makes the relative
 * image/canonical paths below resolve to absolute URLs.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const BRAND = "Sanos Medical Group";

/**
 * The Group is the parent brand/organization; each physical location is a
 * "Center". This name is the LOCAL entity (this address/phone/GBP) and must
 * match the Google Business Profile exactly for local-SEO entity matching. As
 * more centers open, each gets its own location page + MedicalClinic/@id, all
 * under `parentOrganization` = BRAND.
 */
export const LOCATION_NAME = "Sanos Medical Center";

export function localizedUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
}

/** Canonical (current locale) + hreflang alternates for every locale. */
export function buildAlternates(
  locale: string,
  path: string,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}

/** Per-page metadata: title, description, canonical/hreflang, Open Graph, Twitter. */
export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: BRAND,
      url: localizedUrl(locale, path),
      title: `${title} | ${BRAND}`,
      description,
      images: ["/og.png"],
      locale: locale === "es" ? "es_US" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BRAND}`,
      description,
      images: ["/og.png"],
    },
  };
}
