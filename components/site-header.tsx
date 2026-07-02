import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileNav } from "@/components/mobile-nav";

const NAV_LINKS = [
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/providers", key: "providers" },
  { href: "/patient-resources", key: "resources" },
  { href: "/contact", key: "contact" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const mobileLinks = NAV_LINKS.map((link) => ({
    href: link.href,
    label: t(link.key),
  }));

  return (
    <header className="border-border bg-background/90 sticky top-0 z-40 border-b backdrop-blur-xl">
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
          aria-label={t("home")}
          className="hidden items-center gap-6 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-ink hover:text-secondary text-sm font-medium transition"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/contact"
            className="bg-secondary text-secondary-foreground hidden rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90 sm:inline-flex"
          >
            {t("requestAppointment")}
          </Link>
          <MobileNav
            links={mobileLinks}
            ctaLabel={t("requestAppointment")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </div>
    </header>
  );
}
