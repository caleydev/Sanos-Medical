import { getTranslations, setRequestLocale } from "next-intl/server";
import { Activity, Dna, FlaskConical, Syringe, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { FunnelLayout, type FunnelPillar } from "@/components/funnel-layout";
import { buildPageMetadata } from "@/lib/seo";

// COMPLIANCE (SPEC §6 — LAUNCH GATE, see content/TODO.md): Recovery & Regen is
// among the most FTC/FDA-enforced categories in medical advertising. Copy here
// is deliberately brand-agnostic and provider-evaluation framed: no efficacy or
// outcome promises, no anti-aging/peak-performance hype, and NO stated or
// implied FDA approval. A visible medical disclaimer + a TODO-gated regulatory
// note render on the page. This funnel must NOT go live without licensed-
// provider and healthcare-attorney sign-off (see the TODO LAUNCH GATE entry).
const PILLARS: { key: string; icon: LucideIcon }[] = [
  { key: "growthHormones", icon: Syringe },
  { key: "regen", icon: Dna },
  { key: "endurance", icon: Activity },
  { key: "peptides", icon: FlaskConical },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getStartedRegen" });
  // COMPLIANCE: keep this funnel non-indexable while the LAUNCH GATE is pending
  // (belt-and-suspenders with the sitemap omission). Remove `robots` only as
  // part of the launch-gate checklist.
  return {
    ...buildPageMetadata({
      locale,
      path: "/get-started/recovery-regen",
      title: t("seoTitle"),
      description: t("seoDescription"),
    }),
    robots: { index: false, follow: false },
  };
}

export default async function RecoveryRegenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFooter] = await Promise.all([
    getTranslations("getStartedRegen"),
    getTranslations("footer"),
  ]);
  const bullets = t.raw("trustBullets") as string[];
  const founder = t.raw("founder") as {
    name: string;
    role: string;
    email: string;
    emailNote: string;
  };

  const pillars: FunnelPillar[] = PILLARS.map(({ key, icon }) => ({
    title: t(`tiles.${key}.title`),
    summary: t(`tiles.${key}.summary`),
    icon,
  }));

  return (
    <FunnelLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      trustBullets={bullets}
      founder={founder}
      formHeading={t("formHeading")}
      formSubhead={t("formSubhead")}
      formHeadingId="recovery-regen-form-heading"
      insuranceHeading={t("insuranceHeading")}
      insuranceBody={t("insuranceBody")}
      servicesHeading={t("servicesHeading")}
      callPrompt={t("callPrompt")}
      phone={tFooter("phonePlaceholder")}
      pillars={pillars}
      // COMPLIANCE: short hedge surfaced near the hero claims (full block below).
      heroDisclaimer={t("heroDisclaimer")}
      crossLink={{ href: "/get-started", label: t("crossLink") }}
      // COMPLIANCE: visible medical disclaimer + TODO-gated regulatory note.
      disclaimer={
        <>
          <p>{t("disclaimer")}</p>
          <p className="mt-2">{t("regulatoryNote")}</p>
        </>
      }
    />
  );
}
