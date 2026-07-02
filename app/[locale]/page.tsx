import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  FlaskConical,
  Languages,
  MapPinned,
  Play,
  Quote,
  Search,
  Scale,
  ShieldCheck,
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

const STAT_ICONS = [Languages, CalendarDays, MapPinned];

// COMPLIANCE (FTC endorsement rules / SPEC §6): the testimonial cards are
// placeholders with fabricated 5-star ratings. Rendering fake reviews on a
// medical site is an endorsement-liability risk, so the section stays hidden
// until real, practice-approved patient stories replace the placeholder copy
// in messages/*.json → home.testimonialCards. Flip this flag once they land.
const SHOW_TESTIMONIALS: boolean = false;

type HomeStat = {
  value: string;
  label: string;
};

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
  const [t, tServices] = await Promise.all([
    getTranslations("home"),
    getTranslations("services"),
  ]);
  const stats = t.raw("stats") as HomeStat[];
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
              {t("heroTitle")}
            </h1>
            <p className="text-muted mt-6 max-w-xl text-xl leading-relaxed text-pretty">
              {t("heroSubtitle")}
            </p>

            <form
              action={`/${locale}/services`}
              aria-label={t("searchLabel")}
              className="soft-panel mt-8 flex max-w-xl flex-col gap-3 rounded-2xl bg-background p-3 sm:flex-row"
            >
              <label htmlFor="home-service-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3">
                <Search aria-hidden className="text-secondary h-5 w-5 shrink-0" />
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
                className="bg-secondary text-secondary-foreground rounded-full px-6 py-3 text-sm font-semibold transition hover:opacity-90"
              >
                {t("searchButton")}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="bg-secondary text-secondary-foreground inline-flex justify-center rounded-full px-6 py-3 font-semibold transition hover:opacity-90"
              >
                {t("heroCta")}
              </Link>
              <Link
                href="/services"
                className="text-primary inline-flex justify-center rounded-full px-6 py-3 font-semibold underline-offset-4 hover:underline"
              >
                {t("heroSecondaryCta")}
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px]">
            <div className="absolute inset-8 rounded-full bg-secondary/20 blur-2xl" />
            <div className="topographic soft-panel relative mx-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-full">
              <div
                aria-label={t("heroMediaAlt")}
                role="img"
                className="flex h-[78%] w-[78%] items-center justify-center rounded-full bg-background/95"
              >
                <Stethoscope aria-hidden className="text-secondary h-28 w-28" />
              </div>
              <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/40" />
              <span className="absolute right-[18%] bottom-[28%] inline-flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-lg">
                <Play
                  aria-hidden
                  className="text-secondary ml-1 h-7 w-7 fill-current"
                />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid w-full max-w-6xl gap-0 px-6 py-10 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = STAT_ICONS[index] ?? ShieldCheck;
            return (
              <div
                key={stat.label}
                className="relative flex items-center gap-4 py-5 sm:justify-center"
              >
                <span className="bg-surface text-secondary inline-flex h-11 w-11 items-center justify-center rounded-full">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-primary text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted text-sm">{stat.label}</p>
                </div>
                {index < stats.length - 1 ? (
                  <span
                    aria-hidden
                    className="bg-border absolute top-6 right-4 hidden h-16 w-px rotate-[18deg] sm:block"
                  />
                ) : null}
              </div>
            );
          })}
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

        <div className="orbit-stage mx-auto mt-14 hidden lg:block">
          <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/30" />
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20" />
          <div className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/10" />
          <div className="bg-secondary text-secondary-foreground soft-panel absolute top-1/2 left-1/2 flex h-44 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-2xl font-bold leading-tight">
            {t("pillarsEyebrow")}
          </div>
          {PILLARS.map(({ key, icon: Icon }, index) => {
            const angles = ["0deg", "90deg", "180deg", "270deg"];
            const panelPositions = [
              "left-1/2 top-20",
              "left-1/2 top-20",
              "left-1/2 bottom-20",
              "left-1/2 top-20",
            ];
            return (
              <Link
                key={key}
                href={PILLARS[index].href}
                className="orbit-service group z-10"
                style={{ "--orbit-angle": angles[index] } as CSSProperties}
              >
                <span className="bg-background text-secondary soft-panel inline-flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-110 group-focus-visible:scale-110">
                  <Icon aria-hidden className="h-8 w-8" />
                </span>
                <span className="sr-only">
                  {tServices(`cards.${key}.title`)}
                </span>
                <span
                  aria-hidden
                  className={`orbit-popover border-border soft-panel pointer-events-none absolute z-20 w-72 rounded-2xl border bg-background p-5 text-left opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 ${panelPositions[index]}`}
                >
                  <span className="text-primary block text-lg font-semibold">
                    {tServices(`cards.${key}.title`)}
                  </span>
                  <span className="text-muted mt-2 block text-sm leading-relaxed">
                    {tServices(`cards.${key}.summary`)}
                  </span>
                  <span className="text-secondary mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                    {tServices("learnMore")}
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 lg:hidden">
          <div className="mt-8 flex flex-wrap gap-3">
            {specialtyPills.map((pill, index) => (
              <span
                key={pill}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  index % 3 === 0
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-background text-ink"
                }`}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
                {t("pillarsEyebrow")}
              </p>
              <h2 className="text-primary mt-3 text-3xl font-bold tracking-tight text-balance">
                {t("pillarsTitle")}
              </h2>
              <p className="text-muted mt-4 max-w-2xl text-lg text-pretty">
                {t("pillarsSubtitle")}
              </p>
            </div>
            <Link
              href="/services"
              className="text-secondary inline-flex items-center gap-2 font-semibold"
            >
              {t("viewAllServices")}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ key, href, icon, imageSrc }) => (
              <ServiceCard
                key={key}
                icon={icon}
                href={href}
                title={tServices(`cards.${key}.title`)}
                summary={tServices(`cards.${key}.summary`)}
                cta={tServices("learnMore")}
                imageSrc={imageSrc}
                imageAlt={
                  imageSrc ? tServices(`cardImages.${key}`) : undefined
                }
              />
            ))}
          </div>
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
              className="border-border text-primary inline-flex justify-center rounded-full border px-6 py-3 font-semibold transition hover:bg-surface"
            >
              {t("whyPrimaryCta")}
            </Link>
            <Link
              href="/contact"
              className="bg-secondary text-secondary-foreground inline-flex justify-center rounded-full px-6 py-3 font-semibold transition hover:opacity-90"
            >
              {t("whySecondaryCta")}
            </Link>
          </div>
        </div>
        {/* TODO: replace placeholder media with approved clinic photography. */}
        <div
          role="img"
          aria-label={t("clinicMediaAlt")}
          className="topographic soft-panel flex aspect-[4/3] items-center justify-center rounded-2xl"
        >
          <span className="bg-background/95 text-secondary inline-flex h-24 w-24 items-center justify-center rounded-2xl">
            <ShieldCheck aria-hidden className="h-12 w-12" />
          </span>
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
                className="soft-panel rounded-2xl bg-background p-6"
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

      <section className="topographic">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]">
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
          </div>
          <div className="soft-panel rounded-2xl bg-background p-6 sm:p-8">
            <AppointmentForm />
          </div>
        </div>
      </section>
    </main>
  );
}
