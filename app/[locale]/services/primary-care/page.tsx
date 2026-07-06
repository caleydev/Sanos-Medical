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
    path: "/services/primary-care",
    title: t("primaryCare.seoTitle"),
    description: t("primaryCare.seoDescription"),
  });
}

export default async function PrimaryCarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices] = await Promise.all([
    getTranslations("services.primaryCare"),
    getTranslations("services"),
  ]);

  return (
    <ServiceLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      path="/services/primary-care"
      featuresHeading={t("featuresHeading")}
      features={t.raw("features") as string[]}
      faqs={t.raw("faqs") as { q: string; a: string }[]}
      sections={[{ heading: t("expectHeading"), body: t("expectBody") }]}
      imageSrc="/images/services/doctorBlue.png"
      imageAlt={tServices("cardImages.primaryCare")}
    />
  );
}
