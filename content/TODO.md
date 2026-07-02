# Content & Data TODOs

Every item below is a **placeholder** that a human must replace with verified,
practice-approved information before launch. Search the codebase for `TODO` and
`POR DEFINIR` to find inline markers.

> ⚠️ **NOTE TO HUMAN:** This scaffolding follows common medical-advertising and
> privacy practices but is **NOT legal advice** and is **NOT a substitute for
> review by a licensed healthcare attorney and the practice's compliance officer
> before launch.** (SPEC §6)

## Practice identity (NAP)

- [ ] Confirm legal practice name. The site/logo use "Sanos Medical **Group**",
      but the Google Business Profile reads "Sanos Medical **Center**" — decide
      which is correct (and set DBA accordingly).
- [x] Street address — 14024 SW 8th St, Unit B1 (`footer.addressPlaceholder`)
- [x] City / state / ZIP — Miami, FL 33184 (`footer.cityPlaceholder`)
- [x] Phone — (786) 292-1402, `tel:+17862921402` in footer + contact page
- [x] Office hours — Mon–Fri 9–5, Sat 10–3, Sun closed (`footer.hoursPlaceholder`)
- [x] Map embed on the Contact page — live keyless Google Maps iframe for the
      address. NOTE: it sets third-party cookies; add a cookie-consent gate if a
      consent banner is introduced (SPEC §6).

## Providers (SPEC §3 — "Our Providers")

- [ ] Provider names
- [ ] Credentials / NPI numbers (mark each for verification — no unverified
      board-certification or "specialist" claims, SPEC §6)
- [ ] Bios
- [ ] Languages spoken
- [ ] Headshots (with alt text)

## Services & clinical detail

- [ ] Lab partner name(s) — Blood Testing & Labs page
- [ ] **LAUNCH GATE (legal review 2026-07-02):** confirm exact GLP-1 offering,
      branded vs. compounded, BEFORE the GLP-1 page goes live. If compounded,
      `services.glp1.fdaNote` (both locales) must state explicitly that it is a
      compounded drug and **not FDA-approved** (FTC/FDA treat silence as
      deceptive omission). If a brand is ever named, the side-effects copy
      needs fair-balance re-review. Also revisit the injector-pen imagery
      (`/images/services/glp.png`) — pen imagery implies a branded product; if
      compounded (vial/syringe), swap the image.
- [ ] Weight-management program specifics (eligibility framing only — no
      outcome promises)

## Home page

- [x] Removed the unverified "Board-certified providers" trust-band claim from
      `home.trust.providers` and `home.heroSubtitle`; the UI now uses licensed
      provider language instead.
- [ ] Real patient testimonials — the Home "What our patients say" section is a
      placeholder (`home.testimonialsNote`).

## Insurance & resources

- [ ] Accepted insurance carriers — Patient Resources page. The live copy now
      says "we work with many major plans" and offers benefit verification —
      confirm this is accurate and add the actual carrier list when available.
- [ ] Confirm operational claims in the new-patient / insurance copy
      (`resources.newPatient`, `resources.insurance`): 15-minute early-arrival
      guidance, benefit verification before visits, and self-pay availability.
- [ ] New-patient forms (downloadable) — currently placeholder
- [ ] Patient portal URL — `NEXT_PUBLIC_PORTAL_URL`
- [ ] Telehealth consent note (only if telemedicine is offered)

## SEO

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real production domain — canonical URLs,
      hreflang, sitemap, and OG image URLs all derive from it (defaults to
      `http://localhost:3000`).
- [ ] After launch: submit `https://<domain>/sitemap.xml` in Google Search
      Console; verify the JSON-LD with the Rich Results Test.

## Testimonials (before flipping SHOW_TESTIMONIALS to true)

From the FTC/HIPAA legal review (2026-07-02). The section is gated in
`app/[locale]/page.tsx` and the fabricated star row was removed:

- [ ] Signed HIPAA marketing authorization (45 CFR 164.508) per patient — scope,
      website use in both languages, revocable; keep forms + takedown process.
- [ ] FTC: written consent, disclose any material connection (ideally none);
      real verbatim quotes only — no composites/staff-drafted/AI (16 CFR 465).
- [ ] Experience-of-care quotes only — NO weight-loss numbers, before/after, or
      "cured" language (unsubstantiatable efficacy claims).
- [ ] Stars only if driven by a real per-patient rating or a sourced, dated
      aggregate (e.g. Google). Never hard-coded.
- [ ] Add a nearby typicality note ("results vary…") in both locales.
- [ ] Mark translated quotes "(translated)"/"(traducido)"; counsel sign-off on
      each testimonial before it enters `home.testimonialCards`.

## Privacy launch gates (privacy review 2026-07-02)

- [ ] **PHI determination + BAAs.** Counsel to determine in writing whether
      appointment leads (identity + "reason for visit" at a medical practice)
      are PHI. Conservative reading says yes → need Google Workspace BAA for
      the Sheets sink (consumer service account is NOT covered), Supabase
      HIPAA add-on/BAA + US region. If BAAs aren't viable, drop the Sheets
      sink and use a covered channel.
- [ ] **Retention policy.** Define + implement (30–90 days post-contact is
      typical): Supabase purge job (pg_cron) + documented Sheet cleanup; state
      the period in the Privacy Policy.
- [ ] **Google Sheet governance SOP:** named-account sharing only, no link
      sharing, quarterly access review, no re-export to personal email/WhatsApp.
- [ ] Maps embed: cookie disclosure in the Privacy Policy was corrected to be
      truthful (2026-07-02); counsel to confirm approach (or switch to a
      static-image map / click-to-load to avoid third-party cookies entirely).
- [ ] Privacy Policy completion (attorney): named vendors (Supabase, Google,
      host/EC2, Resend if wired), IP/server-log disclosure, retention section,
      rights-request channel + timeframe, FIPA (Fla. Stat. 501.171) breach
      duties, effective date.
- [ ] HIPAA NPP completion (attorney): full 45 CFR 164.520 element list —
      TPO examples, all no-authorization disclosure categories, authorization +
      revocation statements, out-of-pocket restriction right (164.522), breach
      notification, right-to-change-notice, rights mechanics, HHS OCR complaint
      channel, Privacy Officer + effective date; professional translation of
      the completed notice; §1557 taglines assessment.

## Forms & data (appointment requests)

- [ ] Provision a Supabase project and run
      `supabase/migrations/0001_appointment_requests.sql` (creates the table +
      insert-only RLS). Fill `NEXT_PUBLIC_SUPABASE_*` in `.env.local`.
- [ ] Create the Google Sheet + service account for lead capture, share the
      sheet with the service-account email, and set `GOOGLE_SHEETS_*` /
      `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` in `.env`. Add the
      header row (see README). Until set, the sheet sink no-ops.
- [ ] (Optional) Wire the email notification point in
      `app/api/appointment-request/route.ts` (Resend) using `RESEND_API_KEY` /
      `APPOINTMENT_NOTIFY_TO` — keys via env only.
- [ ] EC2: provision the instance, install Docker, set production `.env`, run
      `docker compose up -d --build`, and configure TLS (certbot or ALB/ACM).

## Legal (flagged for counsel — SPEC §3, §6)

Placeholder bodies now exist for all five (in `messages/*.json → legal.*`), each
showing a "REVIEW BY LEGAL COUNSEL BEFORE LAUNCH" banner. Before launch:

- [ ] Have a licensed healthcare attorney review/complete all five: Privacy
      Policy, HIPAA Notice of Privacy Practices, Terms of Use, Accessibility
      Statement, Medical Disclaimer.
- [ ] Fill inline placeholders in the legal copy: `legal.lastUpdated` (date),
      Privacy Officer / contact details, vendor list, governing-law confirmation.
- [ ] Confirm the Accessibility Statement reflects a real a11y audit.

## Brand assets

- [x] Sanos logo asset — `public/sanos-logo-transparent.png`, used in the
      header, footer, and JSON-LD via next/image. Source `sano.png` kept at
      repo root (also feeds the favicon/app icons).
- [x] Favicon / app icons — `app/favicon.ico`, `app/icon.png`,
      `app/apple-icon.png` derived from the logo's shield mark. OG/social image
      at `public/og.png`.
- [ ] Confirm a warm accent color if desired — current palette is all navy/blue
      (see `app/globals.css`).
