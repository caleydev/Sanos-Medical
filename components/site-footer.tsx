import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SHOW_PORTAL } from "@/lib/features";

const NAV_LINKS = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/get-started", key: "getStarted" },
  { href: "/patient-resources", key: "resources" },
  { href: "/contact", key: "contact" },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/hipaa-notice", key: "hipaa" },
  { href: "/legal/terms", key: "terms" },
  { href: "/legal/accessibility", key: "accessibility" },
  { href: "/legal/medical-disclaimer", key: "medicalDisclaimer" },
] as const;

export async function SiteFooter() {
  const [t, tNav, tLegal] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("pages.legal"),
  ]);
  // External patient portal (Healthie etc.) — link out, not a locale route.
  // Hidden until a real portal exists (SHOW_PORTAL); see lib/features.ts.
  const portalUrl =
    process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.example.com";

  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pt-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* NAP — name / address / phone (SPEC §3 global footer). */}
        <div>
          <Image
            src="/sanos-logo-transparent.png"
            alt={tNav("brandWordmark")}
            width={794}
            height={317}
            className="h-10 w-auto"
          />
          <p className="text-muted mt-3 text-sm">{t("tagline")}</p>
          <address className="text-ink mt-4 text-sm not-italic">
            <p>{t("addressPlaceholder")}</p>
            <p>{t("cityPlaceholder")}</p>
            <p className="mt-2">
              {t("phoneLabel")}:{" "}
              <a
                href="tel:+17862921402"
                className="text-cta font-medium hover:underline"
              >
                {t("phonePlaceholder")}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label={t("navHeading")}>
          <h2 className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("navHeading")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-ink hover:text-cta inline-flex transition hover:translate-x-0.5"
                >
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
            {SHOW_PORTAL ? (
              <li>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-cta inline-flex transition hover:translate-x-0.5"
                >
                  {tNav("portal")}
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        <nav aria-label={t("legalHeading")}>
          <h2 className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("legalHeading")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {LEGAL_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="text-ink hover:text-cta inline-flex transition hover:translate-x-0.5"
                >
                  {tLegal(`${link.key}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-primary text-sm font-semibold tracking-wide uppercase">
            {t("hoursHeading")}
          </h2>
          <p className="text-ink mt-3 text-sm">{t("hoursPlaceholder")}</p>
        </div>
      </div>

      {/* COMPLIANCE (SPEC §6): required medical disclaimer + emergency notice. */}
      <div className="border-border border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <p className="text-muted text-xs leading-relaxed">
            {t("disclaimer")}
          </p>
          <p className="text-muted mt-3 text-xs">
            © {new Date().getFullYear()} {tNav("brandWordmark")}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
