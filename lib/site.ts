/**
 * Single source of truth for clinic contact/config values that appear in
 * multiple components (SPEC §3 NAP consistency). These are configuration, not
 * UI copy, so they live here — display strings (formatted phone, address) stay
 * in messages/{en,es}.json. One transposed digit in one file is a silent
 * lead-loss bug; keep the dialable number here and only here.
 */
export const CLINIC = {
  /** Dialable E.164 number for `tel:` links. Display string lives in messages. */
  phoneTel: "+17862921402",
  /** External patient portal (Healthie etc.) — link out, not a locale route. */
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://portal.example.com",
  /**
   * Calendly event link for the inline scheduler on /contact. Client-side embed
   * only — no API key. `undefined` when unset (local dev / not yet provisioned),
   * which makes the widget render a friendly placeholder instead of failing.
   */
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL,
  /**
   * WhatsApp Business line for the floating click-to-chat button — same number
   * as `phoneTel`, but digits only (no `+`) as `wa.me` requires. Override via
   * env if the WhatsApp line ever diverges from the main phone; unset disables
   * the button.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "17862921402",
} as const;

/**
 * The two appointment funnels each render the PHI-safe form on-page. The global
 * "Request an appointment" CTAs should scroll to the on-page form on these
 * routes rather than navigating to the primary-care funnel (which silently
 * dropped recovery-regen visitors onto the wrong form). Keyed by the
 * locale-stripped pathname from next-intl's `usePathname()`.
 */
export const FUNNEL_FORM_ANCHORS: Record<string, string> = {
  "/get-started": "#get-started-form-heading",
  "/get-started/recovery-regen": "#recovery-regen-form-heading",
};
