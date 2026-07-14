import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarClock, Clock, MapPin, Phone } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { CalendlyInline } from "@/components/calendly-inline";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { CLINIC } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [tPages, t] = await Promise.all([
    getTranslations({ locale, namespace: "pages" }),
    getTranslations({ locale, namespace: "contact" }),
  ]);
  return buildPageMetadata({
    locale,
    path: "/contact",
    title: tPages("contact.title"),
    description: t("intro"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFooter] = await Promise.all([
    getTranslations("contact"),
    getTranslations("footer"),
  ]);

  return (
    <main id="main" className="flex-1">
      <header className="topographic">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-primary-foreground/80 text-sm font-semibold tracking-widest uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-primary-foreground mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-primary-foreground/85 mt-4 max-w-2xl text-lg text-pretty">
            {t("intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Practice contact details (NAP + hours). Values are placeholders — TODO. */}
        <aside className="border-border bg-surface rounded-2xl border p-6">
          <div className="space-y-6">
            <div className="bg-background rounded-2xl p-5">
              <h2 className="text-primary flex items-center gap-2 text-lg font-semibold">
                <MapPin aria-hidden className="text-secondary h-5 w-5" />
                {t("visitHeading")}
              </h2>
              <address className="text-ink mt-3 text-sm leading-relaxed not-italic">
                <p>{tFooter("addressPlaceholder")}</p>
                <p>{tFooter("cityPlaceholder")}</p>
              </address>
            </div>

            <div className="bg-background rounded-2xl p-5">
              <h2 className="text-primary flex items-center gap-2 text-lg font-semibold">
                <Phone aria-hidden className="text-secondary h-5 w-5" />
                {t("callHeading")}
              </h2>
              <p className="mt-3 text-sm">
                <a
                  href={`tel:${CLINIC.phoneTel}`}
                  className="text-cta font-medium hover:underline"
                >
                  {tFooter("phonePlaceholder")}
                </a>
              </p>
            </div>

            <div className="bg-background rounded-2xl p-5">
              <h2 className="text-primary flex items-center gap-2 text-lg font-semibold">
                <Clock aria-hidden className="text-secondary h-5 w-5" />
                {tFooter("hoursHeading")}
              </h2>
              <p className="text-ink mt-3 text-sm">
                {tFooter("hoursPlaceholder")}
              </p>
            </div>

            {/* Live Google Maps embed (keyless). Note: this sets third-party
              cookies; if a cookie-consent banner is added later, gate it. */}
            <iframe
              title={t("mapTitle")}
              src="https://www.google.com/maps?q=14024%20SW%208th%20St%2C%20Miami%2C%20FL%2033184&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-border h-72 w-full rounded-2xl border"
            />
          </div>
        </aside>

        <div className="space-y-8">
          {/* Scheduling path A: self-book a real slot via the Calendly embed. */}
          <section
            aria-labelledby="scheduler-heading"
            className="soft-panel border-border bg-background rounded-2xl border p-6 sm:p-8"
          >
            <h2
              id="scheduler-heading"
              className="text-primary flex items-center gap-2 text-xl font-semibold"
            >
              <CalendarClock aria-hidden className="text-secondary h-5 w-5" />
              {t("scheduler.heading")}
            </h2>
            {/* COMPLIANCE (SPEC §5): scheduling-only framing, no medical detail. */}
            <p className="text-muted mt-2 text-sm">{t("scheduler.intro")}</p>
            <div className="mt-4">
              <CalendlyInline />
            </div>
          </section>

          <div className="flex items-center gap-4" aria-hidden>
            <span className="bg-border h-px flex-1" />
            <span className="text-muted text-sm font-medium tracking-wide uppercase">
              {t("orDivider")}
            </span>
            <span className="bg-border h-px flex-1" />
          </div>

          {/* Scheduling path B: request a callback (the PHI-safe Supabase form). */}
          <section
            aria-labelledby="form-heading"
            className="soft-panel border-border bg-background rounded-2xl border p-6 sm:p-8"
          >
            <h2 id="form-heading" className="sr-only">
              {t("formHeading")}
            </h2>
            <AppointmentForm />
          </section>
        </div>
      </div>
    </main>
  );
}
