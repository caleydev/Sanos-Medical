/**
 * Feature flags for site surfaces that aren't ready to show yet. Kept as plain
 * `boolean`-typed consts (not literal `false`) so the guarded branches still
 * type-check — mirrors the local `SHOW_TELEHEALTH` / `SHOW_TESTIMONIALS` flags.
 */

// The practice has no patient portal yet. Patients are tracked temporarily in an
// internal, staff-only Google Sheet that is deliberately NOT linked from this
// site (it would expose PHI). Hide every "Patient Portal" entry until a real
// portal exists, then set NEXT_PUBLIC_PORTAL_URL and flip this to true.
// See content/TODO.md ("Patient portal URL").
export const SHOW_PORTAL: boolean = false;
