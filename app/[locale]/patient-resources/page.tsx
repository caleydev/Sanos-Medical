import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ClipboardList,
  Clock,
  FileText,
  MonitorSmartphone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
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

// COMPLIANCE / accuracy: the telehealth card is hidden until the practice
// confirms it actually offers telemedicine (content/TODO.md). Flip this flag
// and the consent copy in messages/*.json → resources.telehealth together.
const SHOW_TELEHEALTH: boolean = false;

const RESOURCE_KEYS = SHOW_TELEHEALTH
  ? (["insurance", "newPatient", "forms", "telehealth"] as const)
  : (["insurance", "newPatient", "forms"] as const);
const RESOURCE_ICONS: Record<(typeof RESOURCE_KEYS)[number], LucideIcon> = {
  insurance: ShieldCheck,
  newPatient: ClipboardList,
  forms: FileText,
  telehealth: MonitorSmartphone,
};

export default async function PatientResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 sm:py-20">
          <div>
            <p className="text-cta text-sm font-semibold tracking-widest uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
              {t("intro")}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        {/* Featured: patient portal — coming soon (not yet live). */}
        <section
          className="topographic soft-panel mb-8 flex flex-col items-start gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          style={{ backgroundColor: "var(--color-cta)" }}
        >
          <div>
            <h2 className="text-primary-foreground text-2xl font-bold tracking-tight">
              {t("portal.heading")}
            </h2>
            <p className="text-primary-foreground/90 mt-2 max-w-2xl text-sm leading-relaxed">
              {t("portal.body")}
            </p>
          </div>
          <span className="bg-primary-foreground/15 text-primary-foreground inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ring-1 ring-white/25">
            <Clock aria-hidden className="h-4 w-4" />
            {t("portal.comingSoon")}
          </span>
        </section>

        <div
          className={`grid gap-6 sm:grid-cols-2 ${
            RESOURCE_KEYS.length === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {RESOURCE_KEYS.map((key) => {
            const Icon = RESOURCE_ICONS[key];
            return (
              <section
                key={key}
                className="border-border bg-background lift-card rounded-2xl border p-6"
              >
                <span className="bg-surface text-secondary inline-flex h-11 w-11 items-center justify-center rounded-2xl">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h2 className="text-primary mt-4 text-lg font-semibold">
                  {t(`${key}.heading`)}
                </h2>
                <p className="text-muted mt-2 text-sm leading-relaxed">
                  {t(`${key}.body`)}
                </p>
              </section>
            );
          })}
        </div>
      </div>

      <CTASection />
    </main>
  );
}
