import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Recurring "Request an appointment" band shown at the foot of content pages.
 * Routes to the contact form — it does not collect any data itself (SPEC §5).
 */
export async function CTASection() {
  const t = await getTranslations("cta");

  return (
    <section className="bg-background px-6 py-16">
      <div className="border-secondary/50 soft-panel mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-5 rounded-2xl border bg-background p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-primary text-2xl font-bold tracking-tight text-balance">
            {t("title")}
          </h2>
          <p className="text-muted mt-2 max-w-2xl text-pretty">{t("body")}</p>
        </div>
        <Link
          href="/contact"
          className="bg-secondary text-secondary-foreground inline-flex shrink-0 rounded-full px-6 py-3 font-semibold transition hover:opacity-90"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
