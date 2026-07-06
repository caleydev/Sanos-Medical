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
    path: "/services/labs",
    title: t("labs.seoTitle"),
    description: t("labs.seoDescription"),
  });
}

export default async function LabsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices] = await Promise.all([
    getTranslations("services.labs"),
    getTranslations("services"),
  ]);

  return (
    <ServiceLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      path="/services/labs"
      featuresHeading={t("featuresHeading")}
      features={t.raw("features") as string[]}
      faqs={t.raw("faqs") as { q: string; a: string }[]}
      sections={[{ heading: t("processHeading"), body: t("processBody") }]}
      imageSrc="/images/services/labwork.png"
      imageAlt={tServices("cardImages.labs")}
    />
  );
}
