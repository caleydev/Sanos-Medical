import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2, MapPin, Clock } from "lucide-react";
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
    getTranslations({ locale, namespace: "about" }),
  ]);
  return buildPageMetadata({
    locale,
    path: "/about",
    title: tNav("about"),
    description: t("intro"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFooter] = await Promise.all([
    getTranslations("about"),
    getTranslations("footer"),
  ]);
  const expectItems = t.raw("expect.items") as string[];

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
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

      <div className="mx-auto w-full max-w-4xl space-y-12 px-6 py-16">
        <section>
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("story.heading")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("story.body")}</p>
        </section>

        <section>
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("mission.heading")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("mission.body")}</p>
        </section>

        <section>
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("expect.heading")}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {expectItems.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2
                  aria-hidden
                  className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-ink text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-border bg-surface rounded-card border p-6">
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("visit.heading")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("visit.body")}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <p className="text-ink flex items-start gap-2 text-sm not-italic">
              <MapPin aria-hidden className="text-secondary mt-0.5 h-5 w-5 shrink-0" />
              <span>
                {tFooter("addressPlaceholder")}
                <br />
                {tFooter("cityPlaceholder")}
              </span>
            </p>
            <p className="text-ink flex items-start gap-2 text-sm">
              <Clock aria-hidden className="text-secondary mt-0.5 h-5 w-5 shrink-0" />
              <span>{tFooter("hoursPlaceholder")}</span>
            </p>
          </div>
        </section>
      </div>

      <CTASection />
    </main>
  );
}
