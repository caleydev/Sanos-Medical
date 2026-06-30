import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { CTASection } from "@/components/cta-section";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "resources" }),
  ]);
  return buildPageMetadata({
    locale,
    path: "/patient-resources",
    title: tNav("resources"),
    description: t("intro"),
  });
}

const RESOURCE_KEYS = ["insurance", "newPatient", "forms", "telehealth"] as const;

export default async function PatientResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");

  // External patient portal (SPEC §3). TODO: set NEXT_PUBLIC_PORTAL_URL.
  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.example.com";

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-primary mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {t("title")}
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-lg text-pretty">
            {t("intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        {/* Featured: patient portal link-out. */}
        <section className="border-border bg-surface rounded-card flex flex-col items-start gap-4 border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-primary text-xl font-bold">
              {t("portal.heading")}
            </h2>
            <p className="text-muted mt-2 text-sm">{t("portal.body")}</p>
          </div>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-secondary-foreground inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 font-semibold transition hover:opacity-90"
          >
            {t("portal.button")}
            <ExternalLink aria-hidden className="h-4 w-4" />
          </a>
        </section>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {RESOURCE_KEYS.map((key) => (
            <section
              key={key}
              className="border-border bg-background rounded-card border p-6"
            >
              <h2 className="text-primary text-lg font-semibold">
                {t(`${key}.heading`)}
              </h2>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {t(`${key}.body`)}
              </p>
            </section>
          ))}
        </div>
      </div>

      <CTASection />
    </main>
  );
}
