import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  CheckCircle2,
  HeartPulse,
  FlaskConical,
  Phone,
  Scale,
  ShieldCheck,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { AppointmentForm } from "@/components/appointment-form";
import { buildPageMetadata } from "@/lib/seo";

// Same four services as the home grid — same copy/images, but on the funnel
// page these are non-linked reassurance tiles (no outbound "Learn more" CTA) so
// visitors stay with the appointment form instead of leaking to service pages.
const PILLARS: {
  key: string;
  icon: LucideIcon;
  imageSrc?: string;
}[] = [
  { key: "primaryCare", icon: HeartPulse, imageSrc: "/images/services/doctorBlue.png" },
  { key: "labs", icon: FlaskConical, imageSrc: "/images/services/labwork.png" },
  { key: "weightManagement", icon: Scale, imageSrc: "/images/services/weight-management-2.jpg" },
  { key: "glp1", icon: Syringe, imageSrc: "/images/services/glp-consult.jpg" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return buildPageMetadata({
    locale,
    path: "/get-started",
    title: t("seoTitle"),
    description: t("seoDescription"),
  });
}

export default async function GetStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices, tFooter] = await Promise.all([
    getTranslations("getStarted"),
    getTranslations("services"),
    getTranslations("footer"),
  ]);
  const bullets = t.raw("trustBullets") as string[];
  const founder = t.raw("founder") as {
    name: string;
    role: string;
    email: string;
    emailNote: string;
  };

  return (
    <main id="main" className="flex-1">
      {/* Split hero: pitch + trust on the left, the PHI-safe form on the right. */}
      <section className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-6 py-12 sm:py-16 lg:grid-cols-[1fr_0.95fr] lg:gap-10 lg:py-20">
          <div className="order-1">
            <p className="text-cta text-sm font-semibold tracking-widest uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed text-pretty">
              {t("subtitle")}
            </p>
          </div>

          {/* Form card. AppointmentForm is PHI-safe and wired to Supabase + Sheet.
              On mobile it renders last (order-3) so trust signals come first;
              on desktop it returns to the right rail spanning both rows. */}
          <div className="soft-panel border-border bg-background order-3 rounded-3xl border p-6 sm:p-8 lg:order-2 lg:row-span-2">
            <h2
              id="get-started-form-heading"
              className="text-primary text-2xl font-bold tracking-tight"
            >
              {t("formHeading")}
            </h2>
            <p className="text-muted mt-1 text-sm">{t("formSubhead")}</p>
            <div className="mt-6">
              {/* Coverage reassurance lives in its own section below on this
                  page, so suppress the in-form note to avoid duplicate copy. */}
              <AppointmentForm
                ariaLabelledBy="get-started-form-heading"
                showCoverageNote={false}
              />
            </div>
          </div>

          <div className="order-2 lg:order-3">
            <div className="border-border bg-background/70 flex max-w-md items-center gap-4 rounded-2xl border p-4 shadow-sm">
              <Image
                src="/images/team/barbara-patino.png"
                alt=""
                width={72}
                height={72}
                className="border-border h-[72px] w-[72px] shrink-0 rounded-full border object-cover"
              />
              <div className="min-w-0">
                <p className="text-primary font-semibold">{founder.name}</p>
                <p className="text-muted text-sm">{founder.role}</p>
                <a
                  href={`mailto:${founder.email}`}
                  className="text-cta mt-1 inline-block truncate text-sm font-medium hover:underline"
                >
                  {founder.email}
                </a>
                <p className="text-muted mt-1 text-xs">{founder.emailNote}</p>
              </div>
            </div>
            <ul className="mt-8 space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden
                    className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                  />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-muted mt-8 text-sm">
              {t("callPrompt")}{" "}
              <a
                href="tel:+17862921402"
                className="text-cta font-semibold hover:underline"
              >
                <Phone aria-hidden className="mr-1 inline h-4 w-4 align-[-2px]" />
                {tFooter("phonePlaceholder")}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE (SPEC §5): factual coverage statement only — no pricing
          promises or outcome claims. */}
      <section aria-labelledby="gs-insurance-heading" className="bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-6 py-8 sm:flex-row sm:items-center sm:gap-4">
          <ShieldCheck
            aria-hidden
            className="text-secondary h-6 w-6 shrink-0"
          />
          <div>
            <h2
              id="gs-insurance-heading"
              className="text-primary text-base font-semibold"
            >
              {t("insuranceHeading")}
            </h2>
            <p className="text-muted text-sm">{t("insuranceBody")}</p>
          </div>
        </div>
      </section>

      {/* Services grid — the "what you're signing up for" reassurance below the
          form. Non-linked tiles (no outbound CTA) so the funnel stays intact. */}
      <section
        aria-labelledby="gs-services-heading"
        className="mx-auto w-full max-w-6xl px-6 py-16"
      >
        <h2
          id="gs-services-heading"
          className="text-primary text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {t("servicesHeading")}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ key, icon: Icon, imageSrc }) => (
            <div
              key={key}
              className="border-border bg-background flex h-full flex-col rounded-2xl border p-3"
            >
              <div className="bg-surface relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={tServices(`cardImages.${key}`)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="bg-background text-secondary relative inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm">
                    <Icon aria-hidden className="h-8 w-8" />
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h3 className="text-primary text-lg leading-snug font-semibold">
                  {tServices(`cards.${key}.title`)}
                </h3>
                <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                  {tServices(`cards.${key}.summary`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
