"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, TriangleAlert } from "lucide-react";
import {
  appointmentSchema,
  type AppointmentInput,
  type Reason,
  CONTACT_METHODS,
  REASONS,
  requiresEmail,
  requiresPhone,
} from "@/lib/appointment-schema";

export function AppointmentForm({
  ariaLabel,
  ariaLabelledBy,
  showCoverageNote = true,
  defaultReason,
}: {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  // Some pages surface the insurance/self-pay reassurance in their own section;
  // set false there so the copy isn't duplicated on the same page.
  showCoverageNote?: boolean;
  // Pre-selects "Reason for visit" from the funnel context so the visitor
  // doesn't re-pick it and the lead is correctly tagged (e.g. "recoveryRegen"
  // from the recovery-regen funnel). Optional; defaults to unselected.
  defaultReason?: Reason;
}) {
  const t = useTranslations("contact.form");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Move focus to the success heading on submit so keyboard/mobile users get a
  // clear cue (not just the screen-reader live-region announcement).
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (submitted) successHeadingRef.current?.focus();
  }, [submitted]);

  const schema = useMemo(
    () =>
      appointmentSchema({
        firstName: t("errors.firstName"),
        lastName: t("errors.lastName"),
        email: t("errors.email"),
        phone: t("errors.phone"),
        emailRequired: t("errors.emailRequired"),
        phoneRequired: t("errors.phoneRequired"),
        contactMethod: t("errors.contactMethod"),
        reason: t("errors.reason"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(schema),
    defaultValues: { contactMethod: undefined, reason: defaultReason },
  });

  // Mirror the schema's conditional requirement in the labels: mark the channel
  // that isn't required for the chosen contact method as optional. `useWatch`
  // (not `watch`) keeps this component React Compiler-friendly.
  const contactMethod = useWatch({ control, name: "contactMethod" });
  const emailOptional =
    !!contactMethod && !requiresEmail(contactMethod) ? t("optional") : undefined;
  const phoneOptional =
    !!contactMethod && !requiresPhone(contactMethod) ? t("optional") : undefined;

  async function onSubmit(values: AppointmentInput) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/appointment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmitted(true);
    } catch {
      setSubmitError(t("submitError"));
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="border-border bg-surface rounded-2xl border p-8 text-center"
      >
        <CircleCheck aria-hidden className="text-secondary mx-auto h-12 w-12" />
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-primary mt-4 text-2xl font-bold outline-none"
        >
          {t("successTitle")}
        </h2>
        <p className="text-muted mt-3">{t("successBody")}</p>
        {/* COMPLIANCE (SPEC §5): confirmation must restate the emergency notice. */}
        <p className="text-ink mt-6 flex items-start gap-2 text-left text-sm font-medium">
          <TriangleAlert
            aria-hidden
            className="text-danger mt-0.5 h-5 w-5 shrink-0"
          />
          <span>{tCommon("emergencyNotice")}</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className="space-y-5"
    >
      {/* COMPLIANCE (SPEC §5): no medical detail in any public form. */}
      <p className="text-muted bg-surface rounded-xl p-3 text-sm">
        {t("medicalDetailHelp")}
      </p>

      {/* Legend for the asterisk affordance on required fields. */}
      <p className="text-muted text-xs">{t("requiredNote")}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label={t("firstName")}
          required
          error={errors.firstName?.message}
        >
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-required
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={inputClass}
            {...register("firstName")}
          />
        </Field>
        <Field
          id="lastName"
          label={t("lastName")}
          required
          error={errors.lastName?.message}
        >
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-required
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={inputClass}
            {...register("lastName")}
          />
        </Field>
      </div>

      {/* Contact method sits ABOVE email/phone because it governs which of them
          is required — reading top-down, the "(optional)" hint on the channel
          that isn't needed is already set before the user reaches those inputs. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contactMethod"
          label={t("contactMethod")}
          required
          error={errors.contactMethod?.message}
        >
          <select
            id="contactMethod"
            defaultValue=""
            aria-required
            aria-invalid={!!errors.contactMethod}
            aria-describedby={
              errors.contactMethod ? "contactMethod-error" : undefined
            }
            className={inputClass}
            {...register("contactMethod")}
          >
            <option value="" disabled>
              {t("selectPlaceholder")}
            </option>
            {CONTACT_METHODS.map((method) => (
              <option key={method} value={method}>
                {t(`contactMethodOptions.${method}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="reason"
          label={t("reason")}
          required
          error={errors.reason?.message}
        >
          <select
            id="reason"
            defaultValue=""
            aria-required
            aria-invalid={!!errors.reason}
            aria-describedby={errors.reason ? "reason-error" : undefined}
            className={inputClass}
            {...register("reason")}
          >
            <option value="" disabled>
              {t("selectPlaceholder")}
            </option>
            {REASONS.map((reason) => (
              <option key={reason} value={reason}>
                {t(`reasonOptions.${reason}`)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="email"
          label={t("email")}
          optional={emailOptional}
          error={errors.email?.message}
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
            {...register("email")}
          />
        </Field>
        <Field
          id="phone"
          label={t("phone")}
          optional={phoneOptional}
          error={errors.phone?.message}
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={
              [errors.phone ? "phone-error" : null, "phone-help"]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={inputClass}
            {...register("phone")}
          />
          <p id="phone-help" className="text-muted mt-1 text-xs">
            {t("phoneHelp")}
          </p>
        </Field>
      </div>

      {/* COMPLIANCE (SPEC §5): factual coverage statement only — no pricing
          promises or outcome claims. */}
      {showCoverageNote ? (
        <p className="text-muted -mt-2 text-sm">{t("selfPayNote")}</p>
      ) : null}

      <Field
        id="timeWindow"
        label={t("timeWindow")}
        optional={t("optional")}
        error={errors.timeWindow?.message}
      >
        <input
          id="timeWindow"
          type="text"
          placeholder={t("timeWindowPlaceholder")}
          className={inputClass}
          {...register("timeWindow")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      {submitError ? (
        <p role="alert" className="text-danger text-sm font-medium">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-cta text-cta-foreground rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      {/* COMPLIANCE (SPEC §5): emergency notice on the form itself. */}
      <p className="text-muted flex items-start gap-2 text-sm">
        <TriangleAlert
          aria-hidden
          className="text-danger mt-0.5 h-5 w-5 shrink-0"
        />
        <span>{tCommon("emergencyNotice")}</span>
      </p>
    </form>
  );
}

const inputClass =
  "border-border focus:border-secondary focus:ring-secondary/15 w-full rounded-field border bg-background px-4 py-3 text-ink outline-none transition focus:ring-4";

function Field({
  id,
  label,
  error,
  optional,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: string;
  // Renders a visual "*" affordance. Screen readers get requiredness from
  // `aria-required` on the control itself; the asterisk is aria-hidden and
  // explained by the form's `requiredNote` legend.
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-ink block text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden className="text-danger">
            {" "}
            *
          </span>
        ) : null}
        {optional ? (
          <span className="text-muted font-normal"> ({optional})</span>
        ) : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-danger mt-1 text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
