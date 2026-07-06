import { SITE_URL, BRAND, LOCATION_NAME } from "@/lib/seo";
import { CLINIC_ID } from "@/lib/schema";
import { JsonLd } from "@/components/json-ld";

/**
 * JSON-LD structured data describing the practice as a local medical clinic
 * (schema.org/MedicalClinic). Helps Google show the practice in local /
 * "near me" results with name, address, phone, hours, and geo. Rendered once,
 * sitewide, from the locale layout. The `@id` lets per-page Service schema
 * (lib/schema.ts) reference this same entity.
 *
 * The NAP + hours here mirror the UI copy but are kept as a language-neutral
 * canonical source for search engines. Keep in sync with messages/*.json.
 */

// Off-site profiles that describe the SAME practice (Google Business Profile,
// social, directories). Each strengthens the local entity. Add REAL URLs only —
// leave empty to omit the property. TODO (practice): fill after GBP is claimed.
const SAME_AS: string[] = [
  // Google Business Profile (share link). TODO: add Facebook/Instagram/etc. if
  // the practice has them.
  "https://share.google/fbEl7WKzAgWOIb9Hl",
];

const data = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "@id": CLINIC_ID,
  // Local entity name matches the Google Business Profile ("Center"); the Group
  // is the parent brand (parentOrganization below).
  name: LOCATION_NAME,
  parentOrganization: {
    "@type": "Organization",
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/sanos-logo-transparent.png`,
  },
  description:
    "Bilingual (English/Spanish) primary care practice in Miami, FL offering " +
    "annual physicals, preventive care, chronic condition management, lab " +
    "testing, and medically supervised weight management.",
  url: SITE_URL,
  telephone: "+1-786-292-1402",
  image: `${SITE_URL}/og.png`,
  logo: `${SITE_URL}/sanos-logo-transparent.png`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14024 SW 8th St, Unit B1",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33184",
    addressCountry: "US",
  },
  // TODO (practice): verify exact rooftop coordinates against the claimed
  // Google Business Profile; these are approximate for 33184.
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.7617,
    longitude: -80.4283,
  },
  hasMap:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("14024 SW 8th St Unit B1, Miami, FL 33184"),
  areaServed: "Miami-Dade County, FL",
  availableLanguage: ["English", "Spanish"],
  medicalSpecialty: "PrimaryCare",
  ...(SAME_AS.length > 0 ? { sameAs: SAME_AS } : {}),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "15:00",
    },
    {
      // Sunday closed (opens === closes signals closed to search engines).
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "00:00",
      closes: "00:00",
    },
  ],
};

export function StructuredData() {
  return <JsonLd data={data} />;
}
