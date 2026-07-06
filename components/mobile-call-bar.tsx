import { getTranslations } from "next-intl/server";
import { CalendarCheck, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";

/**
 * Sticky, mobile-only call / appointment bar (SPEC §5 conversion). Most
 * local-health searches happen on phones, and many people would rather tap to
 * call than fill a form — this keeps both one tap away. Hidden on md+ where the
 * header utility bar already exposes the phone number. The in-flow spacer
 * reserves height so the fixed bar never covers footer content.
 */
export async function MobileCallBar() {
  const t = await getTranslations("common");

  return (
    <>
      <div aria-hidden className="h-16 md:hidden" />
      <nav
        aria-label={t("mobileActionsLabel")}
        className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      >
        <a
          href="tel:+17862921402"
          className="bg-cta text-cta-foreground flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
        >
          <Phone aria-hidden className="h-4 w-4 shrink-0" />
          {t("callNow")}
        </a>
        <Link
          href="/get-started"
          className="bg-primary text-primary-foreground flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
        >
          <CalendarCheck aria-hidden className="h-4 w-4 shrink-0" />
          {t("requestShort")}
        </Link>
      </nav>
    </>
  );
}
