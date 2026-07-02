import { getTranslations, setRequestLocale } from "next-intl/server";
import { BadgeCheck } from "lucide-react";
import { ProviderCard } from "@/components/provider-card";
import { Disclaimer } from "@/components/disclaimer";
import { CTASection } from "@/components/cta-section";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [tPages, t] = await Promise.all([
    getTranslations({ locale, namespace: "pages" }),
    getTranslations({ locale, namespace: "providers" }),
  ]);
  return buildPageMetadata({
    locale,
    path: "/providers",
    title: tPages("providers.title"),
    description: t("intro"),
  });
}

type Provider = {
  name: string;
  credentials: string;
  bio: string;
  languages: string;
};

export default async function ProvidersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("providers");
  const providers = t.raw("list") as Provider[];

  return (
    <main id="main" className="flex-1">
      <header className="bg-surface overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[1fr_0.7fr]">
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
          <div className="topographic soft-panel hidden min-h-56 rounded-2xl p-8 lg:flex lg:items-center lg:justify-center">
            <span className="bg-background/95 text-secondary inline-flex h-24 w-24 items-center justify-center rounded-2xl">
              <BadgeCheck aria-hidden className="h-12 w-12" />
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider, i) => (
            <ProviderCard
              key={i}
              name={provider.name}
              credentials={provider.credentials}
              bio={provider.bio}
              languages={provider.languages}
              languagesLabel={t("languagesLabel")}
            />
          ))}
        </div>
        {/* COMPLIANCE (SPEC §6): placeholder provider data flagged for verification. */}
        <Disclaimer className="mt-12">{t("placeholderNote")}</Disclaimer>
      </div>

      <CTASection />
    </main>
  );
}
