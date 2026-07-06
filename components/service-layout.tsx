import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Disclaimer } from "@/components/disclaimer";
import { CTASection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import {
  buildBreadcrumbLd,
  buildFaqLd,
  buildServiceLd,
  type Faq,
} from "@/lib/schema";

type Section = { heading: string; body: string };

/**
 * Shared layout for the four service sub-pages (SPEC §3, §7). Renders a
 * localized header, a checklist of features, optional prose sections, and —
 * required on every service page — the medical disclaimer + appointment CTA
 * (SPEC §6). `extra` lets a page inject service-specific compliance blocks
 * (e.g. GLP-1 safety / FDA framing) above the disclaimer. `imageSrc`/`imageAlt`
 * show the service photo in the hero; omit both to fall back to the icon panel.
 */
export async function ServiceLayout({
  eyebrow,
  title,
  intro,
  path,
  featuresHeading,
  features,
  sections = [],
  faqs = [],
  extra,
  imageSrc,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Locale-agnostic route (e.g. "/services/labs") for breadcrumb + Service schema. */
  path: string;
  featuresHeading: string;
  features: string[];
  sections?: Section[];
  faqs?: Faq[];
  extra?: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  const [t, tNav, locale] = await Promise.all([
    getTranslations("services"),
    getTranslations("nav"),
    getLocale(),
  ]);

  const crumbs = [
    { name: tNav("home"), path: "/" },
    { name: tNav("services"), path: "/services" },
    { name: title, path },
  ];

  return (
    <main id="main" className="flex-1">
      {/* SEO: Service tied to the clinic + breadcrumb trail; FAQ markup below. */}
      <JsonLd data={buildBreadcrumbLd(locale, crumbs)} />
      <JsonLd
        data={buildServiceLd({ locale, path, name: title, description: intro })}
      />
      {faqs.length > 0 ? <JsonLd data={buildFaqLd(faqs)} /> : null}

      <header className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_0.7fr]">
          <div>
            <nav
              aria-label={t("breadcrumbLabel")}
              className="text-muted mb-5 text-sm"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-cta hover:underline">
                    {tNav("home")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-cta hover:underline"
                  >
                    {tNav("services")}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <span aria-current="page" className="text-ink font-medium">
                    {title}
                  </span>
                </li>
              </ol>
            </nav>
            <p className="text-cta text-sm font-semibold tracking-widest uppercase">
              {eyebrow}
            </p>
            <h1 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
              {intro}
            </p>
          </div>
          {imageSrc && imageAlt ? (
            <div className="soft-panel relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 38vw, 0px"
                className="object-cover"
              />
              <div
                aria-hidden
                className="from-primary/25 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
              />
            </div>
          ) : (
            <div className="topographic soft-panel hidden min-h-64 rounded-2xl p-8 lg:flex lg:items-center lg:justify-center">
              <span className="bg-background/95 text-secondary inline-flex h-24 w-24 items-center justify-center rounded-2xl">
                <CheckCircle2 aria-hidden className="h-12 w-12" />
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <section aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="text-primary text-2xl font-bold tracking-tight"
          >
            {featuresHeading}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="border-border bg-background lift-card flex gap-3 rounded-2xl border p-4"
              >
                <CheckCircle2
                  aria-hidden
                  className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-ink text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {sections.length > 0 ? (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <section
                key={section.heading}
                className="border-border bg-surface rounded-2xl border p-6"
              >
                <h2 className="text-primary text-2xl font-bold tracking-tight">
                  {section.heading}
                </h2>
                <p className="text-muted mt-4 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        ) : null}

        {extra}

        {faqs.length > 0 ? (
          <section aria-labelledby="faq-heading" className="mt-14">
            <h2
              id="faq-heading"
              className="text-primary text-2xl font-bold tracking-tight"
            >
              {t("faqHeading")}
            </h2>
            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group border-border bg-surface rounded-2xl border p-5"
                >
                  <summary className="text-ink flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {faq.q}
                    <ChevronDown
                      aria-hidden
                      className="text-secondary h-5 w-5 shrink-0 transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="text-muted mt-3 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* COMPLIANCE (SPEC §6): every service page carries the medical disclaimer. */}
        <Disclaimer className="mt-12">{t("disclaimer")}</Disclaimer>
      </div>

      <CTASection />
    </main>
  );
}
