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
  const title = tPages("privacy.title");
  return buildPageMetadata({
    locale,
    path: "/legal/privacy",
    title,
    description: t("metaDescription", { document: title }),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [tPages, t] = await Promise.all([
    getTranslations("pages.legal"),
    getTranslations("legal.privacy"),
  ]);

  return (
    <LegalLayout
      title={tPages("privacy.title")}
      intro={t("intro")}
      sections={t.raw("sections") as { heading: string; body: string }[]}
    />
  );
}
