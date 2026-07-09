import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Recurring "Request an appointment" band shown at the foot of content pages.
 * Routes to the focused appointment funnel; it does not collect any data itself.
 */
export async function CTASection() {
  const t = await getTranslations("cta");

  return (
    <section className="bg-background px-6 py-16">
      <div
        className="topographic soft-panel mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl p-8 ring-1 ring-white/10 sm:flex-row sm:items-center sm:p-10"
        style={{ backgroundColor: "var(--color-cta)" }}
      >
        <div>
          <h2 className="text-primary-foreground text-2xl font-bold tracking-tight text-balance sm:text-3xl">
            {t("title")}
          </h2>
          <p className="text-primary-foreground/90 mt-2 max-w-2xl text-pretty">
            {t("body")}
          </p>
        </div>
        <Link
          href="/get-started"
          className="bg-background text-cta inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 font-semibold shadow-lg shadow-black/10 transition hover:translate-x-0.5 hover:opacity-95"
        >
          {t("button")}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
