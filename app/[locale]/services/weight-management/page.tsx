import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceLayout } from "@/components/service-layout";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildPageMetadata({
    locale,
    path: "/services/weight-management",
    title: t("weightManagement.seoTitle"),
    description: t("weightManagement.seoDescription"),
  });
}

export default async function WeightManagementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices] = await Promise.all([
    getTranslations("services.weightManagement"),
    getTranslations("services"),
  ]);

  return (
    <ServiceLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      path="/services/weight-management"
      featuresHeading={t("featuresHeading")}
      features={t.raw("features") as string[]}
      faqs={t.raw("faqs") as { q: string; a: string }[]}
      // COMPLIANCE (SPEC §6): eligibility-by-evaluation framing, no outcome promises.
      sections={[
        { heading: t("eligibilityHeading"), body: t("eligibilityBody") },
      ]}
      imageSrc="/images/services/weight-management-2.jpg"
      imageAlt={tServices("cardImages.weightManagement")}
    />
  );
}
