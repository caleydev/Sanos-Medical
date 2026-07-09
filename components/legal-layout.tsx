import { getTranslations } from "next-intl/server";
import { Disclaimer } from "@/components/disclaimer";

// A section may lead with a paragraph (`body`), a bulleted list (`bullets`),
// and/or a trailing paragraph (`note`) — any combination. Plain placeholder
// legal pages still pass just `{ heading, body }`, which keeps working.
type Section = {
  heading: string;
  body?: string;
  bullets?: string[];
  note?: string;
};

/**
 * Shared layout for the legal/policy pages (SPEC §3, §7). Renders the title, a
 * "last updated" line, the counsel-review banner (when the page is still
 * placeholder), the intro, the document sections, and an optional closing line.
 *
 * COMPLIANCE (SPEC §6): placeholder legal copy must be reviewed by a licensed
 * healthcare attorney before launch — surfaced via the banner. Pass
 * `showReviewNotice={false}` only for a page whose final, practice-approved copy
 * has been supplied (and give that page its own `lastUpdated` effective date).
 */
export async function LegalLayout({
  title,
  intro,
  sections,
  closing,
  lastUpdated,
  showReviewNotice = true,
}: {
  title: string;
  intro: string;
  sections: Section[];
  closing?: string;
  // Per-document effective date; falls back to the shared placeholder date.
  lastUpdated?: string;
  showReviewNotice?: boolean;
}) {
  const t = await getTranslations("legal");

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-primary text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="text-muted mt-2 text-sm">
          {t("lastUpdatedLabel")}: {lastUpdated ?? t("lastUpdated")}
        </p>

        {showReviewNotice ? (
          <Disclaimer variant="warning" className="mt-6">
            <p className="font-medium">{t("reviewNotice")}</p>
          </Disclaimer>
        ) : null}

        <p className="text-muted mt-8 leading-relaxed whitespace-pre-line">
          {intro}
        </p>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-primary text-xl font-bold tracking-tight">
                {section.heading}
              </h2>
              {section.body ? (
                <p className="text-muted mt-3 leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              ) : null}
              {section.bullets ? (
                <ul className="text-muted mt-3 list-disc space-y-1 pl-6 leading-relaxed">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.note ? (
                <p className="text-muted mt-3 leading-relaxed">{section.note}</p>
              ) : null}
            </section>
          ))}
        </div>

        {closing ? (
          <p className="text-muted mt-10 text-sm leading-relaxed italic">
            {closing}
          </p>
        ) : null}
      </div>
    </main>
  );
}
