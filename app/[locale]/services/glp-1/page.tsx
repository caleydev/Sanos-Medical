import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceLayout } from "@/components/service-layout";
import { Disclaimer } from "@/components/disclaimer";
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
    path: "/services/glp-1",
    title: t("cards.glp1.title"),
    description: t("glp1.intro"),
  });
}

export default async function Glp1Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services.glp1");

  return (
    <ServiceLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      featuresHeading={t("featuresHeading")}
      features={t.raw("features") as string[]}
      // COMPLIANCE (SPEC §6): prescription-only + provider-evaluated framing,
      // common-side-effects "talk to your provider" disclaimer.
      sections={[
        { heading: t("howHeading"), body: t("howBody") },
        { heading: t("safetyHeading"), body: t("safetyBody") },
      ]}
      // COMPLIANCE (SPEC §6): FDA-status accuracy. Copy is brand-agnostic and
      // makes no approval claim. Confirm the exact product (branded vs.
      // compounded) before launch — see content/TODO.md. If compounded, the
      // copy must label it "compounded and not FDA-approved".
      extra={<Disclaimer className="mt-12">{t("fdaNote")}</Disclaimer>}
    />
  );
}
