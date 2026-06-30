import { useTranslations } from "next-intl";

/**
 * Scaffold-stage placeholder for routes whose full content lands in a later
 * phase. Renders a localized title + an "under construction" note so every
 * route in the IA exists and is reachable in both languages (SPEC §3, §9).
 */
export function PagePlaceholder({ title }: { title: string }) {
  const t = useTranslations("common");
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <h1 className="text-primary text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted mt-4 text-lg">{t("underConstruction")}</p>
      </div>
    </main>
  );
}
