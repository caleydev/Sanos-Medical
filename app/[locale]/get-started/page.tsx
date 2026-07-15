import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Activity,
  FlaskConical,
  HeartPulse,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { FunnelLayout, type FunnelPillar } from "@/components/funnel-layout";
import { buildPageMetadata } from "@/lib/seo";

// Primary-care (PCP) service tiles — non-linked reassurance tiles on the funnel
// (no outbound "Learn more" CTA) so visitors stay with the appointment form.
// Reuse existing photography where it fits; icon fallback otherwise.
const PILLARS: {
  key: string;
  icon: LucideIcon;
  imageSrc?: string;
  // Marks a tile as not-yet-open (localized badge). See `t("openingSoon")`.
  comingSoon?: boolean;
}[] = [
  { key: "familyMedicine", icon: HeartPulse, imageSrc: "/images/services/doctorBlue.png" },
  { key: "labs", icon: FlaskConical, imageSrc: "/images/services/labwork.png" },
  { key: "medicine", icon: Stethoscope, imageSrc: "/images/services/general-medicine.png" },
  {
    key: "painManagement",
    icon: Activity,
    imageSrc: "/images/services/pain-management.jpg",
    comingSoon: true,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return buildPageMetadata({
    locale,
    path: "/get-started",
    title: t("seoTitle"),
    description: t("seoDescription"),
  });
}

export default async function GetStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFooter, tContact] = await Promise.all([
    getTranslations("getStarted"),
    getTranslations("footer"),
    getTranslations("contact"),
  ]);
  const bullets = t.raw("trustBullets") as string[];
  const founder = t.raw("founder") as {
    name: string;
    role: string;
    email: string;
    emailNote: string;
  };

  const pillars: FunnelPillar[] = PILLARS.map(
    ({ key, icon, imageSrc, comingSoon }) => ({
      title: t(`tiles.${key}.title`),
      summary: t(`tiles.${key}.summary`),
      icon,
      imageSrc,
      imageAlt: imageSrc ? t(`tiles.${key}.imageAlt`) : undefined,
      badge: comingSoon ? t("openingSoon") : undefined,
    }),
  );

  return (
    <FunnelLayout
      eyebrow={t("eyebrow")}
      title={t("title")}
      subtitle={t("subtitle")}
      trustBullets={bullets}
      founder={founder}
      schedulerHeading={tContact("scheduler.heading")}
      schedulerIntro={tContact("scheduler.intro")}
      orDivider={tContact("orDivider")}
      formHeading={t("formHeading")}
      formSubhead={t("formSubhead")}
      formHeadingId="get-started-form-heading"
      insuranceHeading={t("insuranceHeading")}
      insuranceBody={t("insuranceBody")}
      servicesHeading={t("servicesHeading")}
      callPrompt={t("callPrompt")}
      phone={tFooter("phonePlaceholder")}
      pillars={pillars}
      defaultReason="newPatient"
      crossLink={{
        href: "/get-started/recovery-regen",
        label: t("crossLink"),
      }}
    />
  );
}
