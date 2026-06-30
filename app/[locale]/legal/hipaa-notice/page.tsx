import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalLayout } from "@/components/legal-layout";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [tPages, t] = await Promise.all([
    getTranslations({ locale, namespace: "pages.legal" }),
    getTranslations({ locale, namespace: "legal" }),
  ]);
  const title = tPages("hipaa.title");
  return buildPageMetadata({
    locale,
    path: "/legal/hipaa-notice",
    title,
    description: t("metaDescription", { document: title }),
  });
}

export default async function HipaaNoticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tPages, t] = await Promise.all([
    getTranslations("pages.legal"),
    getTranslations("legal.hipaa"),
  ]);

  return (
    <LegalLayout
      title={tPages("hipaa.title")}
      intro={t("intro")}
      sections={t.raw("sections") as { heading: string; body: string }[]}
    />
  );
}
