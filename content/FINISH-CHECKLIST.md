# Finish Checklist — getting Sanos to launch

Handover written 2026-07-02. This is the "what's left to go live" list, ordered.
Granular content placeholders live in [`TODO.md`](./TODO.md); this file is the
sequenced plan. Owner tags: **[DEV]** = engineering, **[PRACTICE]** = the client
must supply info/decision, **[LAWYER]** = healthcare attorney sign-off.

## Status snapshot (done)

- ✅ Full bilingual site: all pages, i18n (/en /es), SEO, JSON-LD, sitemap.
- ✅ UI modernization pass (fonts, imagery, header/footer, copy cleanup).
- ✅ **Supabase lead capture — working & verified** (table created, RLS
  insert-only, keys in local `.env.local`, real insert confirmed).
  - ⚠️ One test row (`source = connection-test`) to delete from Table Editor.

---

## 1. Google Sheets lead sink — [DEV], ~20 min (in progress, optional)

Resume where we stopped (blocked on Google Workspace org permissions). Simplest
path is a **personal Gmail** — the Cloud project only hosts the "robot writer";
the sheet itself can live in the practice's account.

1. console.cloud.google.com on a **personal @gmail** → New Project `sanos-medical`.
2. Enable **Google Sheets API**.
3. Create a **service account** → **Keys → Add key → JSON** (downloads the secret).
4. Create the Leads sheet: tab named exactly **`Prospects`**, header row:
   `created_at  first_name  last_name  email  phone  contact_method  time_window  reason  locale`
5. **Share** the sheet with the service-account email (Editor). ← the step
   everyone forgets; without it you get a 403.
6. Give Claude the **JSON key path + spreadsheet ID** → it wires the four
   `GOOGLE_*` vars in `.env.local` (handles the private-key `\n` escaping) & tests.

Code is already written (`lib/google-sheets.ts`); it no-ops until env is set, so
this is purely config. **Optional** — Supabase alone captures every lead.

## 2. Content the practice must supply — [PRACTICE]

Can't be finished without the client. All are flagged in `TODO.md`.

- **Providers** — real names, credentials/NPI, bios, headshots (+ alt text).
  Currently visible `[VERIFY]` placeholder cards. **This is the most obviously
  unfinished page a visitor sees.**
- **GLP-1: branded vs. compounded** — LAUNCH GATE. If compounded, `services.glp1.fdaNote`
  (both locales) must say "compounded and not FDA-approved," and swap the
  injector-pen image (`/images/services/glp.png`).
- **Insurance carriers** — real accepted-plans list (Patient Resources).
- **Testimonials** — real, consented quotes before flipping `SHOW_TESTIMONIALS`
  (see the FTC/HIPAA checklist in `TODO.md`).
- **Patient portal URL** → `NEXT_PUBLIC_PORTAL_URL`.
- **Telehealth** — if offered, write real consent copy & flip `SHOW_TELEHEALTH`
  in `app/[locale]/patient-resources/page.tsx`.
- **Practice name** — site says "Sanos Medical **Group**", Google profile says
  "**Center**". Pick one.
- **About "Our story"** — generic founding copy; replace with real history.

## 3. Legal — [LAWYER]

- Review/complete all 5 legal pages (privacy, HIPAA notice, terms, accessibility,
  medical-disclaimer) — bodies exist with "REVIEW BY LEGAL COUNSEL" banners.
- Fill inline placeholders: `legal.lastUpdated` (date), Privacy Officer/contact,
  vendor list, governing law.
- **PHI/BAA determination** — LAUNCH GATE. Decide in writing whether appointment
  leads are PHI. If yes: Supabase HIPAA add-on + BAA + US region, and a Google
  Workspace BAA if the Sheets sink is used (consumer Gmail is NOT covered — if no
  BAA, drop the Sheets sink).
- **Retention policy** — define + implement (e.g. 30–90 day purge); state it in
  the Privacy Policy.

## 4. Deploy to EC2 — [DEV], ~half day (required to go live)

The site is Dockerized (`Dockerfile`, `docker-compose.yml`, `deploy/nginx.conf`,
`output: standalone`). Remaining:

1. Provision the EC2 instance; install Docker + compose.
2. Create production `.env` (all keys from `.env.example`): Supabase URL+key,
   `GOOGLE_*` if using Sheets, and **`NEXT_PUBLIC_SITE_URL` = the real domain**
   (SEO canonical/hreflang/OG all derive from it — currently localhost).
3. `docker compose up -d --build`.
4. TLS: certbot or ALB/ACM.
5. Point DNS at the instance.
6. Post-deploy: submit `/sitemap.xml` to Google Search Console; verify JSON-LD
   with the Rich Results Test.

## 5. Optional hardening — [DEV]

- Resend email notification (commented hook in `app/api/appointment-request/route.ts`).
- Security headers / CSP (must allow the Google Maps iframe on Contact).
- Real accessibility audit (the Accessibility Statement claims WCAG 2.1 AA).
- Automated tests.

---

## Definition of done (minimum to launch safely)

Blocking: **§2 provider data + GLP-1 decision**, **§3 legal review + PHI/BAA
determination + retention**, **§4 EC2 deploy with prod SITE_URL**. Everything
else is polish or optional. §1 (Sheets) and §5 are nice-to-have.
