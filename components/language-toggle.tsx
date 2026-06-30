"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

// Switches locale while preserving the current path (SPEC §9: the toggle
// preserves the current page). usePathname() from next-intl returns the
// pathname without the locale prefix, so router.replace re-adds the new one.
export function LanguageToggle() {
  const t = useTranslations("languageToggle");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const target = locale === "en" ? "es" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: target })}
      aria-label={t("switchTo")}
      className="border-border text-primary hover:bg-surface rounded-full border px-3 py-1.5 text-sm font-semibold transition"
    >
      {t(target)}
    </button>
  );
}
