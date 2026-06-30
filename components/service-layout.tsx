import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { CTASection } from "@/components/cta-section";

type Section = { heading: string; body: string };

/**
 * Shared layout for the four service sub-pages (SPEC §3, §7). Renders a
 * localized header, a checklist of features, optional prose sections, and —
 * required on every service page — the medical disclaimer + appointment CTA
 * (SPEC §6). `extra` lets a page inject service-specific compliance blocks
 * (e.g. GLP-1 safety / FDA framing) above the disclaimer.
 */
export async function ServiceLayout({
  eyebrow,
  title,
  intro,
  featuresHeading,
  features,
  sections = [],
  extra,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  featuresHeading: string;
  features: string[];
  sections?: Section[];
  extra?: React.ReactNode;
}) {
  const t = await getTranslations("services");

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface">
        <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
          <p className="text-secondary text-sm font-semibold tracking-widest uppercase">
            {eyebrow}
          </p>
          <h1 className="text-primary mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="text-muted mt-4 max-w-2xl text-lg text-pretty">
            {intro}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-6 py-16">
        <section aria-labelledby="features-heading">
          <h2
            id="features-heading"
            className="text-primary text-2xl font-bold tracking-tight"
          >
            {featuresHeading}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3">
                <CheckCircle2
                  aria-hidden
                  className="text-secondary mt-0.5 h-5 w-5 shrink-0"
                />
                <span className="text-ink text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="text-primary text-2xl font-bold tracking-tight">
              {section.heading}
            </h2>
            <p className="text-muted mt-4 leading-relaxed">{section.body}</p>
          </section>
        ))}

        {extra}

        {/* COMPLIANCE (SPEC §6): every service page carries the medical disclaimer. */}
        <Disclaimer className="mt-12">{t("disclaimer")}</Disclaimer>
      </div>

      <CTASection />
    </main>
  );
}
