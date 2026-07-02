"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, TriangleAlert } from "lucide-react";
import {
  appointmentSchema,
  type AppointmentInput,
  CONTACT_METHODS,
  REASONS,
} from "@/lib/appointment-schema";

export function AppointmentForm() {
  const t = useTranslations("contact.form");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      appointmentSchema({
        firstName: t("errors.firstName"),
        lastName: t("errors.lastName"),
        email: t("errors.email"),
        phone: t("errors.phone"),
        contactMethod: t("errors.contactMethod"),
        reason: t("errors.reason"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(schema),
    defaultValues: { contactMethod: undefined, reason: undefined },
  });

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
        <h2 className="text-primary mt-4 text-2xl font-bold">
          {t("successTitle")}
        </h2>
        <p className="text-muted mt-3">{t("successBody")}</p>
        {/* COMPLIANCE (SPEC §5): confirmation must restate the emergency notice. */}
        <p className="text-ink mt-6 flex items-start gap-2 text-left text-sm font-medium">
          <TriangleAlert
            aria-hidden
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
          />
          <span>{tCommon("emergencyNotice")}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* COMPLIANCE (SPEC §5): no medical detail in any public form. */}
      <p className="text-muted bg-surface rounded-xl p-3 text-sm">
        {t("medicalDetailHelp")}
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="firstName"
          label={t("firstName")}
          error={errors.firstName?.message}
        >
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className={inputClass}
            {...register("firstName")}
          />
        </Field>
        <Field
          id="lastName"
          label={t("lastName")}
          error={errors.lastName?.message}
        >
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className={inputClass}
            {...register("lastName")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label={t("email")} error={errors.email?.message}>
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
        <Field id="phone" label={t("phone")} error={errors.phone?.message}>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={inputClass}
            {...register("phone")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="contactMethod"
          label={t("contactMethod")}
          error={errors.contactMethod?.message}
        >
          <select
            id="contactMethod"
            defaultValue=""
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
        <Field id="reason" label={t("reason")} error={errors.reason?.message}>
          <select
            id="reason"
            defaultValue=""
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
        <p role="alert" className="text-sm font-medium text-red-600">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-secondary text-secondary-foreground rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submit")}
      </button>

      {/* COMPLIANCE (SPEC §5): emergency notice on the form itself. */}
      <p className="text-muted flex items-start gap-2 text-sm">
        <TriangleAlert
          aria-hidden
          className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
        />
        <span>{tCommon("emergencyNotice")}</span>
      </p>
    </form>
  );
}

const inputClass =
  "border-border focus:border-secondary focus:ring-secondary/15 w-full rounded-xl border bg-background px-4 py-3 text-ink outline-none transition focus:ring-4";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-ink block text-sm font-medium">
        {label}
        {optional ? (
          <span className="text-muted font-normal"> ({optional})</span>
        ) : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
