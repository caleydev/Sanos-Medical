import { SITE_URL, BRAND } from "@/lib/seo";

/**
 * JSON-LD structured data describing the practice as a local medical clinic
 * (schema.org/MedicalClinic). Helps Google show the practice in local /
 * "near me" results with name, address, phone, and hours. Rendered once,
 * sitewide, from the locale layout.
 *
 * The NAP + hours here mirror the UI copy but are kept as a language-neutral
 * canonical source for search engines. Keep in sync with messages/*.json.
 */
const data = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: BRAND,
  url: SITE_URL,
  telephone: "+1-786-292-1402",
  image: `${SITE_URL}/og.png`,
  logo: `${SITE_URL}/sano-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "14024 SW 8th St, Unit B1",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33184",
    addressCountry: "US",
  },
  areaServed: "Miami-Dade County, FL",
  availableLanguage: ["English", "Spanish"],
  medicalSpecialty: "PrimaryCare",
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
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
