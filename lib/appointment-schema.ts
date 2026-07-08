import { z } from "zod";

/**
 * PHI-safe appointment-request schema (SPEC §5). Shared by the client form
 * (localized messages) and the API route (server-side revalidation).
 *
 * COMPLIANCE: there is intentionally NO symptom, diagnosis, medication, or
 * free-text medical field. `reason` is a fixed, non-medical dropdown and
 * `timeWindow` is a short scheduling note only. Do not add medical fields here.
 */
export const CONTACT_METHODS = ["email", "phone", "text"] as const;
// COMPLIANCE (SPEC §5): PHI-safe, non-medical category labels only. "recoveryRegen"
// is a service-category label (like "weightManagement") for the recovery & regen
// funnel — it carries no symptom, diagnosis, or clinical detail.
export const REASONS = [
  "newPatient",
  "annualPhysical",
  "weightManagement",
  "recoveryRegen",
  "labWork",
  "costInsurance",
  "other",
] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number];
export type Reason = (typeof REASONS)[number];

export type AppointmentMessages = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailRequired: string;
  phoneRequired: string;
  contactMethod: string;
  reason: string;
};

// Default (English) validation messages used by the server route. The client
// form builds the schema with localized messages from next-intl.
const DEFAULT_MESSAGES: AppointmentMessages = {
  firstName: "Please enter your first name.",
  lastName: "Please enter your last name.",
  email: "Please enter a valid email address.",
  phone: "Please enter a valid phone number.",
  emailRequired: "Please enter your email so we can reach you.",
  phoneRequired: "Please enter your phone number so we can reach you.",
  contactMethod: "Please choose a preferred contact method.",
  reason: "Please choose a reason for your visit.",
};

// A phone-based contact preference (a call or a text) needs a phone number;
// an email preference needs an email address. Exported so the form can mirror
// the required/optional state in its labels.
export function requiresPhone(method: ContactMethod | undefined): boolean {
  return method === "phone" || method === "text";
}
export function requiresEmail(method: ContactMethod | undefined): boolean {
  return method === "email";
}

export function appointmentSchema(m: AppointmentMessages = DEFAULT_MESSAGES) {
  return z
    .object({
      firstName: z.string().trim().min(1, m.firstName).max(80),
      lastName: z.string().trim().min(1, m.lastName).max(80),
      // Email and phone are conditionally required based on the chosen contact
      // method (see superRefine). Both accept an empty value; format is only
      // validated when something is entered.
      email: z.string().trim().max(160).optional(),
      phone: z.string().trim().max(30).optional(),
      contactMethod: z.enum(CONTACT_METHODS, { message: m.contactMethod }),
      // Short scheduling note only — never medical detail.
      timeWindow: z.string().trim().max(120).optional(),
      reason: z.enum(REASONS, { message: m.reason }),
      locale: z.string().max(5).optional(),
      // Honeypot: should stay empty. Accepted by the schema so the API route can
      // detect a filled value and silently succeed — giving bots no signal that
      // their submission was dropped (SPEC §5).
      company: z.string().max(200).optional(),
    })
    .superRefine((data, ctx) => {
      const email = data.email?.trim() ?? "";
      const phone = data.phone?.trim() ?? "";

      // Require whichever channel matches the chosen contact method — never
      // both at once.
      if (requiresEmail(data.contactMethod) && !email) {
        ctx.addIssue({ code: "custom", path: ["email"], message: m.emailRequired });
      }
      if (requiresPhone(data.contactMethod) && !phone) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: m.phoneRequired });
      }

      // Validate format only when a value was provided.
      if (email && !z.email().safeParse(email).success) {
        ctx.addIssue({ code: "custom", path: ["email"], message: m.email });
      }
      if (phone && (phone.length < 7 || !/^[0-9+()\-.\s]+$/.test(phone))) {
        ctx.addIssue({ code: "custom", path: ["phone"], message: m.phone });
      }
    });
}

export type AppointmentInput = z.infer<ReturnType<typeof appointmentSchema>>;
