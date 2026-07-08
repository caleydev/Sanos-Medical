import Image from "next/image";
import {
  CheckCircle2,
  Phone,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { Disclaimer } from "@/components/disclaimer";
import { Link } from "@/i18n/navigation";

export type FunnelFounder = {
  name: string;
  role: string;
  email: string;
  emailNote: string;
};

// A single reassurance tile. Non-linked (no outbound CTA) so the funnel keeps
// the visitor with the appointment form. Falls back to an icon when no image
// fits. `badge` renders a small localized label (e.g. "Opening soon").
export type FunnelPillar = {
  title: string;
  summary: string;
  icon: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
};

/**
 * Shared appointment-funnel layout: split hero (pitch + trust on the left,
 * the PHI-safe form on the right), an insurance/self-pay band, and a grid of
 * non-linked service reassurance tiles. Content is passed in as props so
 * multiple funnels (primary care, recovery & regen) can reuse it — no strings
 * are hard-coded here (SPEC §10).
 */
export function FunnelLayout({
  eyebrow,
  title,
  subtitle,
  trustBullets,
  founder,
  formHeading,
  formSubhead,
  formHeadingId,
  insuranceHeading,
  insuranceBody,
  servicesHeading,
  callPrompt,
  phone,
  pillars,
  crossLink,
  heroDisclaimer,
  disclaimer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  trustBullets: string[];
  founder: FunnelFounder;
  formHeading: string;
  formSubhead: string;
  formHeadingId: string;
  insuranceHeading: string;
  insuranceBody: string;
  servicesHeading: string;
  callPrompt: string;
  phone: string;
  pillars: FunnelPillar[];
  // Subtle link to the other funnel so visitors can switch tracks.
  crossLink?: { href: string; label: string };
  // COMPLIANCE: optional short hedge rendered directly under the hero subtitle,
  // in proximity to the hero claims (the full disclaimer block sits below).
  heroDisclaimer?: string;
  // Optional visible medical disclaimer (COMPLIANCE) rendered under the tiles.
  disclaimer?: React.ReactNode;
}) {
  return (
    <main id="main" className="flex-1">
      {/* Split hero: pitch + trust on the left, the PHI-safe form on the right. */}
      <section className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-start gap-8 px-6 py-12 sm:py-16 lg:grid-cols-[1fr_0.95fr] lg:gap-10 lg:py-20">
          <div className="order-1">
            <p className="text-cta text-sm font-semibold tracking-widest uppercase">
              {eyebrow}
            </p>
            <h1 className="text-primary mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {title}
            </h1>
            <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed text-pretty">
              {subtitle}
            </p>
            {heroDisclaimer ? (
              <p className="text-muted mt-4 max-w-xl text-xs leading-relaxed">
                {heroDisclaimer}
              </p>
            ) : null}
            {crossLink ? (
              <p className="mt-6 text-sm">
                <Link
                  href={crossLink.href}
                  className="text-cta font-medium underline-offset-4 hover:underline"
                >
                  {crossLink.label}
                </Link>
              </p>
            ) : null}
          </div>

          {/* Form card. AppointmentForm is PHI-safe and wired to Supabase + Sheet.
              On mobile it renders last (order-3) so trust signals come first;
              on desktop it returns to the right rail spanning both rows. */}
          <div className="soft-panel border-border bg-background order-3 rounded-3xl border p-6 sm:p-8 lg:order-2 lg:row-span-2">
            <h2
              id={formHeadingId}
              className="text-primary text-2xl font-bold tracking-tight"
            >
              {formHeading}
            </h2>
            <p className="text-muted mt-1 text-sm">{formSubhead}</p>
            <div className="mt-6">
              {/* Coverage reassurance lives in its own section below on this
                  page, so suppress the in-form note to avoid duplicate copy. */}
              <AppointmentForm
                ariaLabelledBy={formHeadingId}
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
              {trustBullets.map((item) => (
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
              {callPrompt}{" "}
              <a
                href="tel:+17862921402"
                className="text-cta font-semibold hover:underline"
              >
                <Phone aria-hidden className="mr-1 inline h-4 w-4 align-[-2px]" />
                {phone}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* COMPLIANCE (SPEC §5): factual coverage statement only — no pricing
          promises or outcome claims. */}
      <section aria-labelledby="funnel-insurance-heading" className="bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-3 px-6 py-8 sm:flex-row sm:items-center sm:gap-4">
          <ShieldCheck aria-hidden className="text-secondary h-6 w-6 shrink-0" />
          <div>
            <h2
              id="funnel-insurance-heading"
              className="text-primary text-base font-semibold"
            >
              {insuranceHeading}
            </h2>
            <p className="text-muted text-sm">{insuranceBody}</p>
          </div>
        </div>
      </section>

      {/* Services grid — the "what you're signing up for" reassurance below the
          form. Non-linked tiles (no outbound CTA) so the funnel stays intact. */}
      <section
        aria-labelledby="funnel-services-heading"
        className="mx-auto w-full max-w-6xl px-6 py-16"
      >
        <h2
          id="funnel-services-heading"
          className="text-primary text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl"
        >
          {servicesHeading}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map(({ title: pTitle, summary, icon: Icon, imageSrc, imageAlt, badge }) => (
            <div
              key={pTitle}
              className="border-border bg-background flex h-full flex-col rounded-2xl border p-3"
            >
              <div className="bg-surface relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
                {badge ? (
                  <span className="bg-primary text-primary-foreground absolute top-2 left-2 z-10 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm">
                    {badge}
                  </span>
                ) : null}
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={imageAlt ?? ""}
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
                  {pTitle}
                </h3>
                <p className="text-muted mt-2 flex-1 text-sm leading-relaxed">
                  {summary}
                </p>
              </div>
            </div>
          ))}
        </div>
        {disclaimer ? <Disclaimer className="mt-12">{disclaimer}</Disclaimer> : null}
      </section>
    </main>
  );
}
