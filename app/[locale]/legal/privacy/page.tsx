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

  // COMPLIANCE: the practice supplied this as its final, approved Privacy Policy
  // & Notice of Privacy Practices (with its own effective date), so the generic
  // "placeholder — review by counsel" banner is suppressed for this page only.
  // Note: this document blends the website Privacy Policy with HIPAA NPP content;
  // the separate /legal/hipaa-notice route remains a placeholder. The Spanish
  // rendering is a faithful translation pending native legal review (content/TODO.md).
  return (
    <LegalLayout
      title={tPages("privacy.title")}
      intro={t("intro")}
      sections={
        t.raw("sections") as {
          heading: string;
          body?: string;
          bullets?: string[];
          note?: string;
        }[]
      }
      closing={t("closing")}
      lastUpdated={t("effectiveDate")}
      showReviewNotice={false}
    />
  );
}
