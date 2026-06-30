# Sanos Medical — Claude Code Build Prompt

> Spec-driven build. Build to the **Acceptance Criteria** in §9. Do **not** invent medical claims.
> Ask before deviating from the stack in §2.

---

## 1. Context & Goal

Build a production-ready, bilingual (English / Spanish) marketing + lead-capture website for **Sanos Medical**, a Miami-area primary care practice. The site presents the practice and its services, captures appointment requests, and routes patients to intake — **without collecting protected health information (PHI) in any public form**.

Reference for tone, IA simplicity, and trust signals (do **NOT** copy content or branding): a TopLine MD–style primary care site (About → Services → Team → Patient Resources → Contact, with appointment request + patient portal links).

This is a **marketing/informational site**, not an EHR, not a telehealth platform, and not a pharmacy. It must **never** give medical advice, diagnose, or promise outcomes.

---

## 2. Tech Stack (use exactly this unless told otherwise)

- **Next.js 14+ (App Router) + TypeScript** (strict mode)
- **Tailwind CSS** for styling, with a small design-token layer (CSS variables) for brand colors/spacing
- **next-intl** for i18n (locales: `en`, `es`) with locale-prefixed routes (`/en/...`, `/es/...`) and an automatic locale-detection redirect on `/`
- **Supabase (Postgres)** for appointment-request / contact lead capture **only** — minimal fields, RLS enabled, no PHI columns
- **React Hook Form + Zod** for form validation
- **lucide-react** for icons
- Deploy target: **Vercel**. Add a `README.md` with env-var setup and local-dev steps.

> Do **not** add a CMS, auth, or a patient portal in this build — link out to a placeholder portal URL (`NEXT_PUBLIC_PORTAL_URL`).

---

## 3. Information Architecture (pages)

All pages exist in both `en` and `es`.

- **Home** — hero, value prop, the four service pillars as cards, trust band (bilingual care, board-certified providers, insurance accepted), testimonials placeholder, primary CTA (Request an appointment).
- **About** — practice story, mission, "what to expect," location/hours.
- **Services (overview)** → four sub-pages:
  - **Primary & Comprehensive Care** — annual physicals, preventive care, chronic disease management, sick visits, screenings.
  - **Blood Testing & Labs** — diagnostic panels, preventive screening, in-office draw / lab partner; explain process, not specific guaranteed results.
  - **Weight Management** — medically supervised program, lifestyle + clinical support, eligibility-by-evaluation framing.
  - **GLP-1 Therapy** — medically supervised GLP-1 treatment as part of weight management; provider-evaluated and prescribed. See §6 for required compliance language.
- **Our Providers** — provider card grid (name, credentials, bio, languages spoken). Use clearly-labeled placeholder data.
- **Patient Resources** — links: patient portal (env URL), accepted insurances, new-patient info, downloadable forms placeholder, telehealth consent note.
- **Contact / Request an Appointment** — form (see §5), address, phone (`tel:`), map embed, hours.
- **Legal** — Privacy Policy, HIPAA Notice of Privacy Practices, Terms of Use, Accessibility Statement, Medical Disclaimer (each its own route, linked in footer). Generate complete placeholder content clearly marked `// REVIEW BY LEGAL COUNSEL BEFORE LAUNCH`.

**Global:** header nav with language toggle (persists locale), sticky "Request appointment" CTA, footer with NAP (name/address/phone), hours, legal links, and a required affiliation/medical disclaimer line.

---

## 4. Content Strategy & i18n

- Write all copy as **i18n message keys**, never hard-coded strings. Ship complete `en` and `es` message files — the Spanish must be **natural, professional medical Spanish (Miami audience)**, not machine-literal.
- Keep service descriptions benefit- and process-oriented, **not** outcome-promising.
- Provide a `content/` notes file listing every place a human needs to insert real provider names, NPI/credentials, lab partner names, insurance carriers, and address. Mark them all as `TODO`.

---

## 5. Forms & Data Handling (PHI-safe)

The appointment/contact form collects **only**: first name, last name, email, phone, preferred contact method, preferred time window (free text, short), and a non-medical "reason for visit" dropdown (e.g., New patient, Annual physical, Weight management, Lab work, Other).

**Hard rules:**

- **No** symptom fields, diagnosis fields, medication lists, or free-text medical detail. Add helper text: _"Please don't share medical details here — we'll collect those securely at your visit."_
- Validate with **Zod**; honeypot + basic rate limiting on the submit route.
- Store in a Supabase `appointment_requests` table with **RLS enabled** (anon can `insert` only, never `select`). Columns: `id`, `created_at`, name fields, `email`, `phone`, `contact_method`, `time_window`, `reason`, `locale`, `source`.
- Send a notification (Resend or Supabase Edge Function — leave as a clearly-commented integration point with env vars; **do not hard-code keys**).
- Show a confirmation state that explicitly says a team member will follow up and that the form is **not for emergencies** (include "call 911 / go to the ER" emergency line).

---

## 6. Regulatory / Compliance Scaffolding (build these in)

Treat these as build requirements, not optional. Add a `// COMPLIANCE:` comment at each implementation point.

**Medical advertising (FTC + FL Statute 456.062 spirit):**

- No guarantees, no "lose X lbs," no before/after promises, no "miracle"/"cure" language.
- No "specialist"/board-certification claims unless tied to placeholder data clearly marked for verification.
- Every service page carries a visible medical disclaimer: content is informational, not medical advice; individual results vary; treatment requires provider evaluation.

**GLP-1 / weight-management specific:**

- State clearly that GLP-1 medications are **prescription medications dispensed only after a clinical evaluation**, and eligibility is determined by a licensed provider.
- Be accurate about FDA status: if referencing branded GLP-1s, only state approval where true; if the practice uses compounded formulations, label them explicitly as **compounded and not FDA-approved**, with the standard caveat. Default the copy to **provider-evaluated, brand-agnostic** language and leave a `TODO` for the practice to confirm exactly what they offer.
- Include common-side-effects / "talk to your provider" disclaimer near GLP-1 content.

**Privacy & accessibility:**

- Privacy Policy + HIPAA Notice of Privacy Practices routes (placeholder, flagged for counsel).
- Cookie/analytics consent banner if any analytics are added; default to privacy-preserving (no non-essential cookies until consent).
- WCAG 2.1 AA / ADA: semantic HTML, alt text, keyboard nav, visible focus states, color-contrast-safe tokens, labeled form fields, `lang` attribute switches with locale.
- Telehealth consent note + link on Patient Resources if telemedicine is mentioned anywhere.

**Disclaimer (put this verbatim in the build, and surface it):**

```
// NOTE TO HUMAN: This scaffolding follows common medical-advertising and privacy
// practices but is NOT legal advice and is NOT a substitute for review by a licensed
// healthcare attorney and the practice's compliance officer before launch.
```

---

## 7. Design Direction

- Clean, trustworthy, modern-clinical. Warm but professional — Miami-friendly, not sterile.
- Define brand tokens (primary, secondary, neutral, accent) as CSS variables; pick a calm medical palette (consider blues/teals/greens with a warm accent) and a readable type pairing (one humanist sans for body, optional serif/sans for headings).
- Generous whitespace, large tap targets (mobile-first — most patients arrive on phones), accessible contrast.
- Reusable components: `Header`, `LanguageToggle`, `Hero`, `ServiceCard`, `ServiceLayout`, `ProviderCard`, `TestimonialCard`, `CTASection`, `AppointmentForm`, `Footer`, `Disclaimer`, `LegalLayout`.

---

## 8. Project Conventions

- Folder structure: `app/[locale]/...`, `components/`, `lib/`, `messages/en.json`, `messages/es.json`, `content/TODO.md`.
- Strict TypeScript, ESLint + Prettier configured.
- No secrets in code — everything via `.env.local`; ship `.env.example`.
- Commit in logical chunks; write a clear `README.md`.

---

## 9. Acceptance Criteria (definition of done)

1. `npm run dev` works; `/` redirects to a locale; both `/en` and `/es` fully render with no missing keys.
2. All 7 page groups exist in both languages; language toggle preserves the current page.
3. Appointment form validates, rejects medical detail by design, inserts to Supabase with RLS, shows confirmation + emergency notice.
4. No hard-coded medical claims, guarantees, or inaccurate FDA-approval statements anywhere.
5. GLP-1 and weight-management pages contain provider-evaluation framing + required disclaimers.
6. Legal routes (Privacy, HIPAA NPP, Terms, Accessibility, Medical Disclaimer) all exist, flagged for counsel.
7. Passes basic a11y checks (keyboard nav, focus states, alt text, contrast); `lang` updates per locale.
8. `README.md` + `.env.example` + `content/TODO.md` present and accurate.
9. Builds clean (`npm run build`) with no type errors.

---

## 10. Hard "Do Nots"

- Do **not** build auth, an EHR, e-prescribing, payment/checkout, or a real telehealth video flow in this pass.
- Do **not** collect or store PHI in any public form.
- Do **not** write outcome guarantees, comparative superiority claims, or FDA-approval statements you can't verify.
- Do **not** hard-code API keys, provider names, NPIs, or insurance carriers — use placeholders + `TODO`s.
- Do **not** ship any string that isn't in the i18n message files.

---

**Build order:** scaffold Next.js + i18n + Tailwind + route structure → components → content + compliance copy → form + Supabase. Ask before deviating from this stack.
