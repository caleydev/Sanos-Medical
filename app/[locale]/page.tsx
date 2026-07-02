import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  FlaskConical,
  Phone,
  Quote,
  Search,
  Scale,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ServiceCard } from "@/components/service-card";
import { TrustBand } from "@/components/trust-band";
import { CTASection } from "@/components/cta-section";
import { AppointmentForm } from "@/components/appointment-form";

const PILLARS: {
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
    imageSrc: "/images/services/glp.png",
  },
];

// COMPLIANCE (FTC endorsement rules / SPEC §6): the testimonial cards are
// placeholders with fabricated 5-star ratings. Rendering fake reviews on a
// medical site is an endorsement-liability risk, so the section stays hidden
// until real, practice-approved patient stories replace the placeholder copy
// in messages/*.json → home.testimonialCards. Flip this flag once they land.
const SHOW_TESTIMONIALS: boolean = false;

type TestimonialCard = {
  quote: string;
  name: string;
  role: string;
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tServices, tContact, tFooter] = await Promise.all([
    getTranslations("home"),
    getTranslations("services"),
    getTranslations("contact"),
    getTranslations("footer"),
  ]);
  const steps = t.raw("steps.items") as {
    title: string;
    description: string;
  }[];
  const specialtyPills = t.raw("specialtyPills") as string[];
  const whyItems = t.raw("whyItems") as string[];
  const testimonialCards = t.raw("testimonialCards") as TestimonialCard[];

  return (
    <main id="main" className="flex-1">
      <section className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
          <div>
            <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
              {t("heroEyebrow")}
            </p>
            <h1 className="text-primary mt-4 max-w-2xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              {t.rich("heroTitle", {
                accent: (chunks) => (
                  <span className="text-secondary">{chunks}</span>
                ),
              })}
            </h1>
            <p className="text-muted mt-6 max-w-xl text-xl leading-relaxed text-pretty">
              {t("heroSubtitle")}
            </p>

            <form
              action={`/${locale}/services`}
              aria-label={t("searchLabel")}
              className="soft-panel bg-background mt-8 flex max-w-xl flex-col gap-3 rounded-2xl p-3 sm:flex-row"
            >
              <label htmlFor="home-service-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3">
                <Search
                  aria-hidden
                  className="text-secondary h-5 w-5 shrink-0"
                />
                <input
                  id="home-service-search"
                  name="q"
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className="text-ink placeholder:text-muted h-12 min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-secondary text-secondary-foreground shadow-secondary/25 rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
              >
                {t("searchButton")}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="bg-secondary text-secondary-foreground shadow-secondary/25 inline-flex justify-center rounded-full px-6 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
              >
                {t("heroCta")}
              </Link>
              <Link
                href="/services"
                className="border-border text-primary hover:border-secondary/40 hover:bg-background inline-flex justify-center rounded-full border bg-transparent px-6 py-3 font-semibold transition hover:-translate-y-0.5"
              >
                {t("heroSecondaryCta")}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md self-end lg:max-w-lg">
            {/* Decorative dotted accents (mockup-style), hidden from AT. */}
            <span
              aria-hidden
              className="dot-grid absolute top-8 -left-8 h-24 w-24"
            />
            <span
              aria-hidden
              className="dot-grid absolute right-0 bottom-20 h-28 w-20"
            />
            {/* Arch backdrop the cutout stands in front of. */}
            <div
              aria-hidden
              className="from-secondary/25 via-surface to-background absolute inset-x-8 bottom-0 h-4/5 rounded-t-full bg-gradient-to-b"
            />
            <div
              aria-hidden
              className="border-background/80 absolute inset-x-12 bottom-0 h-3/4 rounded-t-full border-4"
            />
            <div
              aria-hidden
              className="bg-primary/10 absolute inset-x-10 bottom-0 h-16 rounded-[100%] blur-2xl"
            />

            {/* Transparent hero cutout blends into the section background.
                NOTE: /background.png is the real alpha cutout despite the
                name; "doctortransparent.png" had a baked-in checkerboard. */}
            <div className="relative aspect-[4/5]">
              <Image
                src="/background.png"
                alt={t("heroMediaAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-contain object-bottom drop-shadow-[0_28px_45px_rgba(28,44,89,0.18)]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Quick "3 simple steps" strip — anchors to the real form below. */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="soft-panel border-border bg-background -mt-8 rounded-3xl border p-8 sm:p-10">
          <h2 className="text-primary text-2xl font-bold tracking-tight text-balance">
            {t("steps.title")}
          </h2>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1fr_1fr_1fr_auto]">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <span className="bg-surface text-secondary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-primary text-sm font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted mt-1 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            <a
              href="#appointment"
              className="bg-secondary text-secondary-foreground shadow-secondary/25 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg transition hover:-translate-y-0.5 hover:opacity-95"
            >
              {t("steps.cta")}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {t("pillarsEyebrow")}
          </p>
          <h2 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance">
            {t("specialtiesTitle")}
          </h2>
          <p className="text-muted mt-5 text-lg leading-relaxed text-pretty">
            {t("specialtiesBody")}
          </p>
        </div>

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

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {specialtyPills.map((pill) => (
            <span
              key={pill}
              className="border-secondary/20 bg-surface/70 text-primary rounded-full border px-4 py-2 text-sm font-semibold"
            >
              {pill}
            </span>
          ))}
        </div>
      </section>

      <TrustBand />

      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <h2 className="text-primary text-4xl font-bold tracking-tight text-balance">
            {t("whyTitle")}
          </h2>
          <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed text-pretty">
            {t("whyBody")}
          </p>
          <ul className="mt-8 space-y-4">
            {whyItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  aria-hidden
                  className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-ink">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/about"
              className="border-border text-primary hover:bg-surface inline-flex justify-center rounded-full border px-6 py-3 font-semibold transition hover:-translate-y-0.5"
            >
              {t("whyPrimaryCta")}
            </Link>
            <Link
              href="/contact"
              className="bg-secondary text-secondary-foreground inline-flex justify-center rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:opacity-95"
            >
              {t("whySecondaryCta")}
            </Link>
          </div>
        </div>
        {/* TODO: swap stock photo for approved clinic photography (content/TODO.md). */}
        <div className="soft-panel relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="/images/services/bluedoc.png"
            alt={t("clinicMediaAlt")}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="from-primary/35 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
          />
        </div>
      </section>

      {/* Testimonials — gated until real approved patient stories exist (see SHOW_TESTIMONIALS). */}
      {SHOW_TESTIMONIALS ? (
        <section className="bg-surface overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6 py-20">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-primary text-3xl font-bold tracking-tight">
                  {t("testimonialsTitle")}
                </h2>
                <p className="text-muted mt-3 max-w-2xl text-lg">
                  {t("testimonialsNote")}
                </p>
              </div>
              <div className="flex gap-3" aria-hidden>
                <span className="bg-background text-secondary inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </span>
                <span className="bg-secondary text-secondary-foreground inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonialCards.map((card, index) => (
                <article
                  key={`${card.name}-${index}`}
                  className="soft-panel bg-background rounded-2xl p-6"
                >
                  <Quote aria-hidden className="text-secondary h-8 w-8" />
                  <p className="text-ink mt-5 text-sm leading-relaxed">
                    {card.quote}
                  </p>
                  {/* COMPLIANCE (FTC 16 CFR Part 465): star ratings were removed
                    on legal review — fabricated uniform 5-star rows are a
                    civil-penalty violation. Reintroduce stars ONLY driven by a
                    real per-testimonial rating from a documented rating
                    system, or a sourced/dated aggregate. */}
                  <div className="mt-6 flex items-center gap-3">
                    <span className="bg-surface text-secondary inline-flex h-11 w-11 items-center justify-center rounded-full">
                      <Stethoscope aria-hidden className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-primary text-sm font-semibold">
                        {card.name}
                      </h3>
                      <p className="text-muted text-xs">{card.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection />

      <section id="appointment" className="topographic scroll-mt-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <p className="text-primary-foreground/85 text-sm font-semibold tracking-widest uppercase">
              {t("heroEyebrow")}
            </p>
            <h2 className="text-primary-foreground mt-3 text-4xl font-bold tracking-tight">
              {t("heroCta")}
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-lg">
              {t("heroSubtitle")}
            </p>

            {/* Prefer-to-call panel: same details as the footer, in context. */}
            <div className="mt-8 space-y-4">
              <a
                href="tel:+17862921402"
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur transition hover:bg-white/15"
              >
                <span className="text-primary-foreground inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Phone aria-hidden className="h-5 w-5" />
                </span>
                <span>
                  <span className="text-primary-foreground/85 block text-xs font-semibold tracking-wide uppercase">
                    {tContact("callHeading")}
                  </span>
                  <span className="text-primary-foreground font-semibold">
                    {tFooter("phonePlaceholder")}
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <span className="text-primary-foreground inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Clock aria-hidden className="h-5 w-5" />
                </span>
                <span>
                  <span className="text-primary-foreground/85 block text-xs font-semibold tracking-wide uppercase">
                    {tFooter("hoursHeading")}
                  </span>
                  <span className="text-primary-foreground font-semibold">
                    {tFooter("hoursPlaceholder")}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="soft-panel bg-background rounded-3xl p-6 sm:p-8">
            <AppointmentForm />
          </div>
        </div>
      </section>
    </main>
  );
}
