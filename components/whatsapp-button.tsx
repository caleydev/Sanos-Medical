import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { CLINIC } from "@/lib/site";

/**
 * Site-wide floating WhatsApp button. A plain `wa.me` deep link — no embedded
 * widget, so zero third-party script, no consent banner, no extra vendor on a
 * medical site. Opens the app (mobile) or WhatsApp Web (desktop) with a
 * scheduling-oriented pre-filled message.
 *
 * COMPLIANCE: WhatsApp is NOT a HIPAA-eligible channel. The prefill steers
 * people toward booking, not sharing symptoms/history — keep it that way.
 *
 * Renders nothing when no number is configured. Positioned above the mobile
 * call bar (`h-16`, `md:hidden`) on small screens so the two never overlap.
 */
export async function WhatsAppButton() {
  const number = CLINIC.whatsappNumber;
  if (!number) return null;

  const t = await getTranslations("common");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    t("whatsapp.prefill"),
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp.label")}
      className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none md:right-6 md:bottom-6"
    >
      <WhatsAppIcon aria-hidden className="h-7 w-7" />
    </a>
  );
}
