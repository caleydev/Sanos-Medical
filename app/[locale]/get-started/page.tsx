import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import {
  CheckCircle2,
  HeartPulse,
  FlaskConical,
  Phone,
  Scale,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { ServiceCard } from "@/components/service-card";
import { AppointmentForm } from "@/components/appointment-form";
import { buildPageMetadata } from "@/lib/seo";

// Same four services as the home grid — reused so copy/images stay in sync.
const PILLARS: {
  key: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: string;
}[] = [
  { key: "primaryCare", href: "/services/primary-care", icon: HeartPulse, imageSrc: "/images/services/doctorBlue.png" },
  { key: "labs", href: "/services/labs", icon: FlaskConical, imageSrc: "/images/services/labwork.png" },
  { key: "weightManagement", href: "/services/weight-management", icon: Scale, imageSrc: "/images/services/weight-management-2.jpg" },
  { key: "glp1", href: "/services/glp-1", icon: Syringe, imageSrc: "/images/services/glp.png" },
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
          <div>
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

          {/* Form card. AppointmentForm is PHI-safe and wired to Supabase + Sheet. */}
          <div className="soft-panel border-border bg-background rounded-3xl border p-6 sm:p-8 lg:row-span-2">
            <h2
              id="get-started-form-heading"
              className="text-primary text-2xl font-bold tracking-tight"
            >
              {t("formHeading")}
            </h2>
            <p className="text-muted mt-1 text-sm">{t("formSubhead")}</p>
            <div className="mt-6">
              <AppointmentForm ariaLabelledBy="get-started-form-heading" />
            </div>
          </div>

          <div>
            <div className="border-border bg-background/70 flex max-w-md items-center gap-4 rounded-2xl border p-4 shadow-sm">
              <Image
                src="/images/team/angel-leyva.png"
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

      {/* Services grid — the "what you're signing up for" reassurance below the form. */}
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
          {PILLARS.map(({ key, href, icon, imageSrc }) => (
            <ServiceCard
              key={key}
              icon={icon}
              href={href}
              title={tServices(`cards.${key}.title`)}
              summary={tServices(`cards.${key}.summary`)}
              cta={tServices("learnMore")}
              imageSrc={imageSrc}
              imageAlt={imageSrc ? tServices(`cardImages.${key}`) : undefined}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
