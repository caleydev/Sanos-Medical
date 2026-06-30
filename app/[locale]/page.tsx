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
import { TrustBand } from "@/components/trust-band";
import { CTASection } from "@/components/cta-section";

const PILLARS: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "primaryCare", href: "/services/primary-care", icon: HeartPulse },
  { key: "labs", href: "/services/labs", icon: FlaskConical },
  { key: "weightManagement", href: "/services/weight-management", icon: Scale },
  { key: "glp1", href: "/services/glp-1", icon: Syringe },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices] = await Promise.all([
    getTranslations("home"),
    getTranslations("services"),
  ]);

  return (
    <main id="main" className="flex-1">
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-24 text-center sm:py-32">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {t("heroEyebrow")}
          </p>
          <h1 className="text-primary mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="text-muted mx-auto mt-6 max-w-2xl text-lg text-pretty">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="bg-secondary text-secondary-foreground rounded-full px-6 py-3 font-semibold transition hover:opacity-90"
            >
              {t("heroCta")}
            </Link>
            <Link
              href="/services"
              className="text-primary rounded-full px-6 py-3 font-semibold underline-offset-4 hover:underline"
            >
              {t("heroSecondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {t("pillarsEyebrow")}
          </p>
          <h2 className="text-primary mt-3 text-3xl font-bold tracking-tight text-balance">
            {t("pillarsTitle")}
          </h2>
          <p className="text-muted mt-4 text-lg text-pretty">
            {t("pillarsSubtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ key, href, icon }) => (
            <ServiceCard
              key={key}
              icon={icon}
              href={href}
              title={tServices(`cards.${key}.title`)}
              summary={tServices(`cards.${key}.summary`)}
              cta={tServices("learnMore")}
            />
          ))}
        </div>
      </section>

      <TrustBand />

      {/* Testimonials placeholder — real patient stories land in a later pass (SPEC §3). */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
          <h2 className="text-primary text-3xl font-bold tracking-tight">
            {t("testimonialsTitle")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("testimonialsNote")}</p>
        </div>
      </section>

      <CTASection />
    </main>
  );
}
