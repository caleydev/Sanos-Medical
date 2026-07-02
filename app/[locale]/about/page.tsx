import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Target,
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
      <header className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_0.75fr]">
          <div>
            <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-muted mt-5 max-w-2xl text-lg leading-relaxed text-pretty">
              {t("intro")}
            </p>
          </div>
          <div className="topographic soft-panel hidden min-h-64 rounded-2xl p-8 lg:flex lg:items-end">
            <div className="bg-background/95 rounded-2xl p-5">
              <HeartHandshake aria-hidden className="text-secondary h-8 w-8" />
              <p className="text-primary mt-4 text-lg font-semibold">
                {t("mission.heading")}
              </p>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {t("mission.body")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="border-border bg-background lift-card rounded-2xl border p-6">
            <HeartHandshake aria-hidden className="text-secondary h-7 w-7" />
            <h2 className="text-primary mt-4 text-2xl font-bold tracking-tight">
              {t("story.heading")}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">{t("story.body")}</p>
          </article>

          <article className="border-border bg-background lift-card rounded-2xl border p-6">
            <Target aria-hidden className="text-secondary h-7 w-7" />
            <h2 className="text-primary mt-4 text-2xl font-bold tracking-tight">
              {t("mission.heading")}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">
              {t("mission.body")}
            </p>
          </article>
        </section>

        <section className="mt-12">
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("expect.heading")}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {expectItems.map((item) => (
              <li
                key={item}
                className="border-border bg-surface flex gap-3 rounded-2xl border p-4"
              >
                <CheckCircle2
                  aria-hidden
                  className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-ink text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-border bg-surface mt-12 rounded-2xl border p-6">
          <h2 className="text-primary text-2xl font-bold tracking-tight">
            {t("visit.heading")}
          </h2>
          <p className="text-muted mt-4 leading-relaxed">{t("visit.body")}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <p className="text-ink flex items-start gap-2 text-sm not-italic">
              <MapPin
                aria-hidden
                className="text-secondary mt-0.5 h-5 w-5 shrink-0"
              />
              <span>
                {tFooter("addressPlaceholder")}
                <br />
                {tFooter("cityPlaceholder")}
              </span>
            </p>
            <p className="text-ink flex items-start gap-2 text-sm">
              <Clock
                aria-hidden
                className="text-secondary mt-0.5 h-5 w-5 shrink-0"
              />
              <span>{tFooter("hoursPlaceholder")}</span>
            </p>
          </div>
        </section>
      </div>

      <CTASection />
    </main>
  );
}
