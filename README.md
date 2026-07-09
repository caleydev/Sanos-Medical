# Sanos Medical Group — Website

Bilingual (English / Spanish) marketing + lead-capture site for a Miami-area
primary care practice. Built to [`SPEC.md`](./SPEC.md). This is a
marketing/informational site — **not** an EHR, telehealth platform, or pharmacy,
and it never collects protected health information (PHI) in a public form.

## Stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Tailwind CSS v4** with a CSS-variable design-token layer (`app/globals.css`)
- **next-intl** for i18n (`en`, `es`) with locale-prefixed routes and automatic
  locale detection
- **React Hook Form + Zod** (appointment form + server-side validation)
- **Supabase** (Postgres) for PHI-safe lead capture; leads also pushed to a
  **Google Sheet** for the call team
- **lucide-react** (icons)
- Deploy target: **self-hosted on AWS EC2** (Docker + Nginx)

> **Version note:** SPEC §2 asked for "Next.js 14+." `create-next-app` installed
> the current latest (**16.x**), which satisfies that. Next 16 renames
> _Middleware_ to _Proxy_ (`proxy.ts`) and makes route `params` async — both are
> reflected here. See `node_modules/next/dist/docs/` (bundled) for details.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000 -> redirects to /en or /es
```

Other scripts:

```bash
npm run build          # production build (must pass clean)
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run format         # prettier --write .
```

## Environment variables

See [`.env.example`](./.env.example). Nothing is hard-coded; all secrets live in
`.env.local` (gitignored).

| Variable                                                     | Purpose                                              |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                       | Canonical/site URL for metadata                      |
| `NEXT_PUBLIC_PORTAL_URL`                                     | External patient portal link (Patient Resources)     |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase lead capture (anon insert-only)             |
| `SUPABASE_SERVICE_ROLE_KEY`                                  | Server-only key, reserved — never exposed            |
| `GOOGLE_SHEETS_SPREADSHEET_ID` / `GOOGLE_SHEETS_TAB`         | Target sheet + tab for lead rows                     |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY`        | Service-account creds to append rows (sheet sink)    |
| `RESEND_API_KEY` / `APPOINTMENT_NOTIFY_TO`                   | Optional email notification integration point        |

> The appointment form works in local dev **without** Supabase configured: the
> API route validates and returns success but logs that persistence was skipped.
> Set the `NEXT_PUBLIC_SUPABASE_*` vars to actually store requests.

## Supabase setup (lead capture)

1. Create a Supabase project; copy its URL + anon key into `.env.local`.
2. Run [`supabase/migrations/0001_appointment_requests.sql`](./supabase/migrations/0001_appointment_requests.sql)
   in the SQL editor (or `supabase db push`). It creates the
   `appointment_requests` table and enables **RLS with an insert-only policy for
   `anon`** — the public site can write requests but can never read them back.
3. Submissions POST to `app/api/appointment-request/route.ts`, which revalidates
   with Zod, drops honeypot/rate-limited requests, and inserts the row.

> **PHI-safe (SPEC §5):** the form and table intentionally have no symptom,
> diagnosis, medication, or free-text medical fields. `reason` is a fixed
> non-medical dropdown and `time_window` is a short scheduling note only.

## Lead capture → Google Sheet (call team)

Each submission is also appended as a row to a Google Sheet so agents can review
and call prospects. This is a **best-effort secondary sink** — a sheet outage
never blocks the patient's submission (Supabase remains the source of truth).

1. In Google Cloud, create a **service account** and enable the **Google Sheets
   API**. Download the JSON key.
2. Create the sheet with a tab named `Prospects` (or set `GOOGLE_SHEETS_TAB`).
   Suggested header row: `created_at | first | last | email | phone |
   contact_method | time_window | reason | locale`.
3. **Share the sheet** with the service-account email (Editor).
4. Set `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and
   `GOOGLE_PRIVATE_KEY` (keep the literal `\n` escapes) in `.env`. Leave them
   unset to disable the sheet sink.

Implementation: [`lib/google-sheets.ts`](./lib/google-sheets.ts), called from the
API route after the Supabase insert.

## Deployment (AWS EC2, Docker + Nginx)

> ✅ **Already live.** The site is deployed and running in production on a
> self-hosted **AWS EC2** instance (`52.22.30.154`) via `docker compose`, behind
> Nginx, with **Supabase lead capture and the Google Sheet sink both provisioned
> and live** (production `.env` set on the host). The steps below are the
> setup/redeploy reference — the infrastructure is already provisioned, so
> day-to-day you only need the **Updates** command at the bottom of this section.

The app builds to a Next.js **standalone** server and runs in a container behind
Nginx.

```bash
# On the EC2 instance (Docker + docker compose installed):
git clone <repo> && cd sanos-medical
cp .env.example .env        # fill in production values
docker compose up -d --build
```

- [`Dockerfile`](./Dockerfile) — multi-stage build, runs `node server.js` on
  `:3000` as a non-root user.
- [`docker-compose.yml`](./docker-compose.yml) — `app` + `nginx` services;
  secrets via the host `.env`.
- [`deploy/nginx.conf`](./deploy/nginx.conf) — reverse proxy: redirects `:80`
  → `:443`, terminates TLS with the Let's Encrypt cert, sets `X-Forwarded-For`.
- Updates: `git pull && docker compose up -d --build`.

### Custom domain + TLS (Let's Encrypt via certbot)

The domain (`sanosmedical.com`) points at the Elastic IP with two GoDaddy
**A** records (`@` and `www` → `52.22.30.154`); the EC2 security group allows
inbound `80` + `443`. TLS is self-hosted: the `nginx` container terminates it
using a Let's Encrypt cert issued/renewed by the on-demand `certbot` service
(HTTP-01 webroot challenge). Certs live under `deploy/certbot/` (gitignored).

First-time issuance, once DNS resolves to the box:

```bash
# set NEXT_PUBLIC_SITE_URL=https://sanosmedical.com in the host .env first,
# then obtain the cert (this also (re)builds + starts the stack). Safe to
# re-run; it recreates the bootstrap cert and gates on nginx serving :80:
CERTBOT_EMAIL="you@example.com" ./deploy/init-tls.sh
# optional dry run against LE staging first:  STAGING=1 CERTBOT_EMAIL=... ./deploy/init-tls.sh
```

Auto-renewal — add a host cron entry (certs are valid 90 days):

```cron
# renew twice daily; reload nginx only if the cert changed
0 0,12 * * * cd /home/ubuntu/Sanos-Medical && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload
```

## Project structure

```
app/[locale]/            Locale-scoped routes (en, es)
  layout.tsx             Root <html>, fonts, providers, header/footer, skip link
  page.tsx               Home
  about/ services/ ...   Page groups (SPEC §3)
  legal/                 Privacy, HIPAA NPP, Terms, Accessibility, Medical Disclaimer
components/              Shared UI (SiteHeader, SiteFooter, LanguageToggle, ...)
i18n/                    routing.ts, request.ts, navigation.ts (next-intl)
messages/en.json|es.json All UI copy — no hard-coded strings (SPEC §4, §10)
content/TODO.md          Everything a human must fill in before launch
proxy.ts                 Locale detection + redirect (Next 16 "Proxy")
```

## Internationalization

- All user-facing strings live in `messages/en.json` and `messages/es.json`.
- Routes are locale-prefixed (`/en/...`, `/es/...`); `/` redirects to a detected
  locale via `proxy.ts`.
- Use the locale-aware `Link` / `useRouter` from `@/i18n/navigation` (not
  `next/link`) so the language toggle preserves the current path.

## Compliance & status

Compliance scaffolding (medical-advertising guardrails, HIPAA/privacy routes,
WCAG/ADA practices) follows SPEC §6 and is marked with `// COMPLIANCE:` comments
and `TODO`s.

> ⚠️ **NOT legal advice.** All legal/medical copy is placeholder, flagged for
> review by a licensed healthcare attorney and the practice's compliance officer
> before launch.

### Build progress

- ✅ **Phase 1** — scaffold, i18n routing, full route IA, brand tokens, global
  header/footer, language toggle.
- ✅ **Phase 2** — Home page (pillars, trust band, CTA), Services overview + 4
  sub-pages, shared components, with compliance copy (EN/ES).
- ✅ **Phase 3** — appointment form + Supabase lead capture (PHI-safe, RLS,
  Zod, honeypot + rate limiting).
- ✅ **Phase 4** — About, Providers (with `ProviderCard`), and Patient Resources
  pages (EN/ES), with placeholder data flagged for verification.
- ✅ **Phase 5** — lead-capture Google Sheet sink; EC2 deploy (Docker + Nginx,
  standalone output).
- ✅ **Phase 6** — legal page bodies (Privacy, HIPAA NPP, Terms, Accessibility,
  Medical Disclaimer) via `LegalLayout`, EN/ES, flagged for counsel review.
- ✅ **Phase 7** — SEO & local discovery: per-page metadata, canonical +
  hreflang (`lib/seo.ts`), `MedicalClinic` JSON-LD, `sitemap.xml`/`robots.txt`,
  Open Graph image, and favicon/app icons derived from the logo.
- ⬜ Next — counsel review of legal copy + fill inline placeholders; set
  `NEXT_PUBLIC_SITE_URL`; optional Resend email; security headers; tests.
