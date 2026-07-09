import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Clock, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { NavLinks } from "@/components/nav-links";
import { SHOW_PORTAL } from "@/lib/features";

const NAV_LINKS = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/patient-resources", key: "resources" },
  { href: "/contact", key: "contact" },
] as const;

export async function SiteHeader() {
  const [t, tFooter] = await Promise.all([
    getTranslations("nav"),
    getTranslations("footer"),
  ]);
  const mobileLinks = NAV_LINKS.map((link) => ({
    href: link.href,
    label: t(link.key),
  }));
  // External patient portal (Healthie etc.) — link out, not a locale route.
  // Hidden until a real portal exists (SHOW_PORTAL); see lib/features.ts.
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL;

  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 border-b shadow-[0_10px_30px_rgb(28_44_89_/_0.04)] backdrop-blur-xl">
      {/* Utility bar: phone / hours / address at a glance (desktop only). */}
      <div className="bg-cta text-cta-foreground hidden text-xs md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-2">
          <div className="flex items-center gap-6">
            <a
              href="tel:+17862921402"
              className="flex items-center gap-1.5 font-medium transition hover:opacity-80"
            >
              <Phone aria-hidden className="h-3.5 w-3.5 opacity-75" />
              {tFooter("phonePlaceholder")}
            </a>
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock aria-hidden className="h-3.5 w-3.5 opacity-75" />
              {tFooter("hoursPlaceholder")}
            </span>
          </div>
          <span className="hidden items-center gap-1.5 opacity-90 lg:flex">
            <MapPin aria-hidden className="h-3.5 w-3.5 opacity-75" />
            {tFooter("addressPlaceholder")}, {tFooter("cityPlaceholder")}
          </span>
        </div>
      </div>
      {/* Compact utility bar for mobile: tap-to-call phone + the clinic address
          so location is visible near the top of every page on small screens. */}
      <div className="bg-cta text-cta-foreground text-[11px] md:hidden">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-0.5 px-6 py-1.5">
          <a
            href="tel:+17862921402"
            className="flex items-center gap-1 font-medium transition hover:opacity-80"
          >
            <Phone aria-hidden className="h-3 w-3 opacity-75" />
            {tFooter("phonePlaceholder")}
          </a>
          <span className="flex items-center gap-1 text-center opacity-90">
            <MapPin aria-hidden className="h-3 w-3 shrink-0 opacity-75" />
            {tFooter("addressPlaceholder")}, {tFooter("cityPlaceholder")}
          </span>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center">
          <Image
            src="/sanos-logo-transparent.png"
            alt={t("brandWordmark")}
            width={794}
            height={317}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav
          aria-label={t("primaryLabel")}
          className="hidden items-center gap-6 md:flex"
        >
          <NavLinks links={mobileLinks} />
        </nav>

        <div className="flex items-center gap-3">
          {SHOW_PORTAL ? (
            <a
              href={portalUrl ?? "https://portal.example.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-cta hidden text-sm font-medium transition md:inline-flex"
            >
              {t("portal")}
            </a>
          ) : null}
          <LanguageToggle />
          <Link
            href="/get-started"
            className="bg-cta text-cta-foreground shadow-cta/25 hidden rounded-full px-4 py-2 text-sm font-semibold shadow-md transition hover:-translate-y-0.5 hover:opacity-95 sm:inline-flex"
          >
            {t("requestAppointment")}
          </Link>
          <MobileNav
            links={mobileLinks}
            ctaLabel={t("requestAppointment")}
            navLabel={t("primaryLabel")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            portalHref={
              SHOW_PORTAL
                ? (portalUrl ?? "https://portal.example.com")
                : undefined
            }
            portalLabel={SHOW_PORTAL ? t("portal") : undefined}
          />
        </div>
      </div>
    </header>
  );
}
