import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  HeartPulse,
  FlaskConical,
  Scale,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { Disclaimer } from "@/components/disclaimer";
import { CTASection } from "@/components/cta-section";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [tPages, t] = await Promise.all([
    getTranslations({ locale, namespace: "pages" }),
    getTranslations({ locale, namespace: "services" }),
  ]);
  return buildPageMetadata({
    locale,
    path: "/services",
    title: tPages("services.title"),
    description: t("overview.intro"),
  });
}

const SERVICES: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "primaryCare", href: "/services/primary-care", icon: HeartPulse },
  { key: "labs", href: "/services/labs", icon: FlaskConical },
  { key: "weightManagement", href: "/services/weight-management", icon: Scale },
  { key: "glp1", href: "/services/glp-1", icon: Syringe },
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {t("overview.eyebrow")}
          </p>
          <h1 className="text-primary mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {t("overview.title")}
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-lg text-pretty">
            {t("overview.intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map(({ key, href, icon }) => (
            <ServiceCard
              key={key}
              icon={icon}
              href={href}
              title={t(`cards.${key}.title`)}
              summary={t(`cards.${key}.summary`)}
              cta={t("learnMore")}
            />
          ))}
        </div>
        <Disclaimer className="mt-12">{t("disclaimer")}</Disclaimer>
      </div>

      <CTASection />
    </main>
  );
}
