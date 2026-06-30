import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Recurring "Request an appointment" band shown at the foot of content pages.
 * Routes to the contact form — it does not collect any data itself (SPEC §5).
 */
export async function CTASection() {
  const t = await getTranslations("cta");

  return (
    <section className="bg-primary">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-20">
        <h2 className="text-primary-foreground text-3xl font-bold tracking-tight text-balance">
          {t("title")}
        </h2>
        <p className="text-primary-foreground/80 mx-auto mt-4 max-w-2xl text-lg text-pretty">
          {t("body")}
        </p>
        <Link
          href="/contact"
          className="bg-secondary text-secondary-foreground mt-8 inline-block rounded-full px-6 py-3 font-semibold transition hover:opacity-90"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
