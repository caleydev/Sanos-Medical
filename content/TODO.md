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
- [ ] Confirm exact GLP-1 offering: branded vs. compounded. If compounded, copy
      must label it "compounded and not FDA-approved" (SPEC §6). Default copy is
      provider-evaluated and brand-agnostic until confirmed.
- [ ] Weight-management program specifics (eligibility framing only — no
      outcome promises)

## Home page

- [ ] Verify the "Board-certified providers" trust-band claim before launch — it
      is placeholder copy (`home.trust.providers`, also `home.heroSubtitle`). No
      unverified board-certification claims (SPEC §6).
- [ ] Real patient testimonials — the Home "What our patients say" section is a
      placeholder (`home.testimonialsNote`).

## Insurance & resources

- [ ] Accepted insurance carriers — Patient Resources page
- [ ] New-patient forms (downloadable) — currently placeholder
- [ ] Patient portal URL — `NEXT_PUBLIC_PORTAL_URL`
- [ ] Telehealth consent note (only if telemedicine is offered)

## SEO

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real production domain — canonical URLs,
      hreflang, sitemap, and OG image URLs all derive from it (defaults to
      `http://localhost:3000`).
- [ ] After launch: submit `https://<domain>/sitemap.xml` in Google Search
      Console; verify the JSON-LD with the Rich Results Test.

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

- [x] Sanos logo asset — `public/sano-logo.png` (trimmed from `sano.png`), used
      in the header and footer via next/image. Source `sano.png` kept at repo root.
- [x] Favicon / app icons — `app/favicon.ico`, `app/icon.png`,
      `app/apple-icon.png` derived from the logo's shield mark. OG/social image
      at `public/og.png`.
- [ ] Confirm a warm accent color if desired — current palette is all navy/blue
      (see `app/globals.css`).
