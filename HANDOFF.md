# Handoff — Sanos Medical Group website

Context for the next agent/developer continuing this build. Pair this with
[`SPEC.md`](./SPEC.md) (the source of truth for requirements), [`README.md`](./README.md)
(stack + setup + deploy), and [`content/TODO.md`](./content/TODO.md) (granular
remaining work).

## What this is

Bilingual (en/es) marketing + PHI-safe lead-capture site for a Miami primary-care
practice. Spec-driven — build to `SPEC.md`, do **not** invent medical claims.

## Stack (locked by SPEC §2)

Next.js 16 (App Router) + strict TS · Tailwind v4 (tokens via `@theme` in
`app/globals.css`) · next-intl v4 (locale-prefixed `/en`,`/es`; root redirect in
`proxy.ts`) · React Hook Form + Zod · Supabase (lead store) · lucide-react ·
self-hosted on EC2 (Docker + Nginx).

## Conventions (follow these)

- **No hard-coded UI strings** — all copy lives in `messages/{en,es}.json`; keep
  the two files in sync. Bullet lists are read with `t.raw("key") as string[]`.
- Pages use `getTranslations` + `setRequestLocale`; navigate via the locale-aware
  `Link` from `@/i18n/navigation` (not `next/link`).
- Logic in `lib/`, UI in `components/`, routes in `app/[locale]/`.
- Every service page carries the medical disclaimer; legal pages show a
  "REVIEW BY LEGAL COUNSEL" banner. Compliance points are marked `// COMPLIANCE:`.

## Status — DONE (builds clean: `npm run typecheck && npm run lint && npm run build`)

- Scaffold, i18n routing, global header/footer, language toggle, brand tokens.
- Pages (all en/es): Home, About, Services overview + 4 sub-pages (primary-care,
  labs, weight-management, glp-1), Providers, Patient Resources, Contact, and 5
  legal pages (privacy, hipaa-notice, terms, accessibility, medical-disclaimer).
- Appointment form → Supabase (`lib/appointment-schema.ts`, `lib/supabase.ts`,
  `app/api/appointment-request/route.ts`, `supabase/migrations/0001_*.sql`):
  Zod validation client+server, honeypot, in-memory rate limit, insert-only RLS.
- Lead also appended to a Google Sheet (`lib/google-sheets.ts`), best-effort.
- Real NAP/hours + live Google Maps embed on Contact.
- Logo wired in header/footer (`public/sanos-logo-transparent.png`); favicon/app icons +
  `public/og.png` generated from the logo.
- SEO: per-page metadata + canonical/hreflang (`lib/seo.ts`), `MedicalClinic`
  JSON-LD (`components/structured-data.tsx`), `app/sitemap.ts`, `app/robots.ts`.

## Status — REMAINING (see `content/TODO.md` for detail)

- Counsel review + fill inline legal placeholders (date, Privacy Officer/contact,
  vendors, governing law).
- Confirm the practice name: site/logo say "Sanos Medical **Group**", Google
  profile says "Sanos Medical **Center**".
- ✅ **Live in production** — deployed and running on a self-hosted AWS EC2
  instance (`52.22.30.154`) via `docker compose` behind Nginx, with **Supabase
  lead capture and the Google Sheet sink both provisioned and live** (real `.env`
  values set on the host). Redeploy with `git pull && docker compose up -d --build`.
- Set `NEXT_PUBLIC_SITE_URL` to the prod domain if not already (SEO depends on it).
- Replace remaining placeholders: provider data, insurances, testimonials,
  "board-certified" trust claim.
- Optional/hardening: Resend email notification (commented hook in the API route),
  security headers (CSP must allow the Google Maps iframe), automated tests,
  a real accessibility audit.

## Gotchas (cost me time — save yourself the trouble)

- It really is a newer Next.js: route `params` are async (`await params`),
  middleware is `proxy.ts`. Read `node_modules/next/dist/docs/` before new APIs.
- Zod is **v4** (`z.enum(arr, { message })`); message keys feed validation.
- next-intl loads messages via a dynamic import in `i18n/request.ts`; both JSON
  bundles get traced into the Docker standalone build — don't "fix" it.
- The app runs locally **without** Supabase/Google env set (those sinks no-op and
  log). Don't treat missing env as a failure in dev.
- Verify behavior, not just compilation: run the build AND smoke-test the running
  app (the dev server is `npm run dev` on :3000).

## First moves for a fresh session

1. `npm install`
2. `npm run dev` and click through `/en` and `/es`.
3. `npm run typecheck && npm run lint && npm run build` — confirm green.
4. Pick the next item from `content/TODO.md`.
