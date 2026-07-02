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
    <section className="border-border bg-surface/60 border-y">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="text-primary text-center text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {t("trustTitle")}
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {TRUST_ITEMS.map(({ key, icon: Icon }) => (
            <li
              key={key}
              className="lift-card border-border bg-background rounded-3xl border p-8"
            >
              <span className="bg-surface text-secondary inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon aria-hidden className="h-6 w-6" />
              </span>
              <h3 className="text-primary mt-5 text-lg font-semibold">
                {t(`trust.${key}.title`)}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {t(`trust.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
