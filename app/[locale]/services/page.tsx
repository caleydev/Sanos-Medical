import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  HeartPulse,
  FlaskConical,
  Search,
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
    imageSrc: "/images/services/glp-consult.jpg",
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
  const [t, tHome] = await Promise.all([
    getTranslations("services"),
    getTranslations("home"),
  ]);

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
      <header className="topographic overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-end gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-primary-foreground/80 text-sm font-semibold tracking-widest uppercase">
              {t("overview.eyebrow")}
            </p>
            <h1 className="text-primary-foreground mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("overview.title")}
            </h1>
            <p className="text-primary-foreground/85 mt-4 max-w-2xl text-lg leading-relaxed text-pretty">
              {t("overview.intro")}
            </p>
          </div>
          <div className="bg-background/95 soft-panel hidden rounded-3xl p-4 backdrop-blur lg:block">
            <div className="grid gap-2">
              {SERVICES.map(({ key, href, icon: Icon }) => (
                <Link
                  key={key}
                  href={href}
                  className="group text-primary hover:bg-surface flex items-center gap-3 rounded-2xl p-3 text-sm font-semibold transition"
                >
                  <span className="bg-surface text-secondary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <Icon aria-hidden className="h-4 w-4" />
                  </span>
                  {t(`cards.${key}.title`)}
                  <ArrowRight
                    aria-hidden
                    className="text-secondary ml-auto h-4 w-4 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <form
          action={`/${locale}/services`}
          aria-label={tHome("searchLabel")}
          className="border-border soft-panel bg-background mb-10 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row"
        >
          <label htmlFor="services-search" className="sr-only">
            {tHome("searchLabel")}
          </label>
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3">
            <Search aria-hidden className="text-secondary h-5 w-5 shrink-0" />
            <input
              id="services-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder={tHome("searchPlaceholder")}
              className="text-ink placeholder:text-muted h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-cta text-cta-foreground rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:opacity-95"
          >
            {tHome("searchButton")}
          </button>
        </form>

        {query ? (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-primary text-xl font-semibold">
              {hasMatches
                ? t("search.resultsFor", { query })
                : t("search.noResults", { query })}
            </h2>
            <Link
              href="/services"
              className="text-cta text-sm font-semibold underline-offset-4 hover:underline"
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
