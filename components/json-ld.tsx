/**
 * Renders a JSON-LD structured-data <script>. Server-safe and reusable for the
 * sitewide MedicalClinic entity as well as per-page schema (FAQPage,
 * BreadcrumbList, Service). Keep the emitted data in sync with visible page
 * content — Google requires FAQ/breadcrumb markup to match what users see.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
