import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  HeartPulse,
  FlaskConical,
  Scale,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
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

const SERVICES: {
  key: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
}[] = [
  {
    key: "primaryCare",
    href: "/services/primary-care",
    icon: HeartPulse,
    imageSrc: "/images/services/doctorBlue.png",
  },
  {
    key: "labs",
    href: "/services/labs",
    icon: FlaskConical,
    imageSrc: "/images/services/labwork.png",
  },
  {
    key: "weightManagement",
    href: "/services/weight-management",
    icon: Scale,
    imageSrc: "/images/services/weight-management-2.jpg",
  },
  {
    key: "glp1",
    href: "/services/glp-1",
    icon: Syringe,
    imageSrc: "/images/services/glp.png",
  },
];

/** Case- and accent-insensitive match ("analisis" finds "análisis"). */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default async function ServicesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const [{ locale }, { q }] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const t = await getTranslations("services");

  // Filter by the ?q= query submitted from the home hero search (matched
  // against each service's localized title + summary). Next delivers repeated
  // params (?q=a&q=b) as an array — take the first.
  const raw = Array.isArray(q) ? q[0] : q;
  const query = raw?.trim() ?? "";
  const needle = normalize(query);
  const matches = needle
    ? SERVICES.filter(({ key }) =>
        normalize(
          `${t(`cards.${key}.title`)} ${t(`cards.${key}.summary`)}`,
        ).includes(needle),
      )
    : SERVICES;
  // On no matches, fall back to the full list so the page is never empty —
  // the heading tells the visitor nothing matched.
  const hasMatches = matches.length > 0;
  const visibleServices = hasMatches ? matches : SERVICES;

  return (
    <main id="main" className="flex-1">
      <header className="topographic">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
          <p className="text-primary-foreground/80 text-sm font-semibold tracking-widest uppercase">
            {t("overview.eyebrow")}
          </p>
          <h1 className="text-primary-foreground mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t("overview.title")}
          </h1>
          <p className="text-primary-foreground/85 mt-4 max-w-2xl text-lg text-pretty">
            {t("overview.intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        {query ? (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-primary text-xl font-semibold">
              {hasMatches
                ? t("search.resultsFor", { query })
                : t("search.noResults", { query })}
            </h2>
            <Link
              href="/services"
              className="text-secondary text-sm font-semibold underline-offset-4 hover:underline"
            >
              {t("search.clear")}
            </Link>
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map(({ key, href, icon, imageSrc }) => (
            <ServiceCard
              key={key}
              icon={icon}
              href={href}
              title={t(`cards.${key}.title`)}
              summary={t(`cards.${key}.summary`)}
              cta={t("learnMore")}
              imageSrc={imageSrc}
              imageAlt={imageSrc ? t(`cardImages.${key}`) : undefined}
            />
          ))}
        </div>
        <Disclaimer className="mt-12">{t("disclaimer")}</Disclaimer>
      </div>

      <CTASection />
    </main>
  );
}
