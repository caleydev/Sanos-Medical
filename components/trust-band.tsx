import { getTranslations } from "next-intl/server";
import { Languages, ShieldCheck, BadgeCheck, type LucideIcon } from "lucide-react";

const TRUST_ITEMS: { key: string; icon: LucideIcon }[] = [
  { key: "bilingual", icon: Languages },
  // COMPLIANCE (SPEC §6): copy deliberately says "Licensed providers" — do NOT
  // upgrade to "board-certified"/"specialist" unless independently verified.
  { key: "providers", icon: BadgeCheck },
  { key: "insurance", icon: ShieldCheck },
];

/** Home-page trust band: bilingual care, providers, insurance accepted (SPEC §3). */
export async function TrustBand() {
  const t = await getTranslations("home");

  return (
    <section className="border-border border-y">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="text-primary text-center text-2xl font-bold tracking-tight sm:text-3xl">
          {t("trustTitle")}
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {TRUST_ITEMS.map(({ key, icon: Icon }) => (
            <li key={key} className="text-center">
              <span className="bg-surface text-secondary inline-flex h-12 w-12 items-center justify-center rounded-full">
                <Icon aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="text-primary mt-4 text-lg font-semibold">
                {t(`trust.${key}.title`)}
              </h3>
              <p className="text-muted mx-auto mt-2 max-w-xs text-sm leading-relaxed">
                {t(`trust.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
