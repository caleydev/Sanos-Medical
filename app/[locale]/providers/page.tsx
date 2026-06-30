import { getTranslations, setRequestLocale } from "next-intl/server";
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
      <header className="bg-surface">
        <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">
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

      <div className="mx-auto w-full max-w-5xl px-6 py-16">
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
