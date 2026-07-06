import { SITE_URL, LOCATION_NAME, localizedUrl } from "@/lib/seo";

/**
 * Per-page schema.org builders (JSON-LD). These complement the sitewide
 * MedicalClinic entity in `components/structured-data.tsx` and are rendered via
 * the `JsonLd` component. Service pages use all three: a Service tied to the
 * clinic, a BreadcrumbList, and a FAQPage (rich-result eligible).
 */

/** Stable @id for the clinic entity so per-page schema can reference it. */
export const CLINIC_ID = `${SITE_URL}/#clinic`;

export type Faq = { q: string; a: string };

/** FAQPage schema — can earn rich-result FAQ dropdowns in search. The Q&A here
 *  must match FAQs visibly rendered on the page (Google guideline). */
export function buildFaqLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList schema mirroring the visible breadcrumb trail. */
export function buildBreadcrumbLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

/** Service schema tying a service page to the clinic as its provider. */
export function buildServiceLd({
  locale,
  path,
  name,
  description,
}: {
  locale: string;
  path: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: localizedUrl(locale, path),
    provider: { "@type": "MedicalClinic", "@id": CLINIC_ID, name: LOCATION_NAME },
    areaServed: "Miami-Dade County, FL",
    availableLanguage: ["English", "Spanish"],
  };
}
