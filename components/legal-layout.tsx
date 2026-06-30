import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";

type Section = { heading: string; body: string };

/**
 * Shared layout for the legal/policy pages (SPEC §3, §7). Renders the title, a
 * "last updated" line, the required counsel-review banner, the intro, and the
 * document sections.
 *
 * COMPLIANCE (SPEC §6): all legal copy is placeholder and must be reviewed by a
 * licensed healthcare attorney before launch — surfaced via the banner below.
 */
export async function LegalLayout({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Section[];
}) {
  const t = await getTranslations("legal");

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-primary text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {t("lastUpdatedLabel")}: {t("lastUpdated")}
        </p>

        <div
          role="note"
          className="rounded-card mt-6 flex gap-3 border border-amber-300 bg-amber-50 p-4"
        >
          <TriangleAlert
            aria-hidden
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          />
          <p className="text-sm font-medium text-amber-900">
            {t("reviewNotice")}
          </p>
        </div>

        <p className="text-muted mt-8 leading-relaxed">{intro}</p>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-primary text-xl font-bold tracking-tight">
                {section.heading}
              </h2>
              <p className="text-muted mt-3 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
