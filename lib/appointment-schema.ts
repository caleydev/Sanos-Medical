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
export const REASONS = [
  "newPatient",
  "annualPhysical",
  "weightManagement",
  "labWork",
  "other",
] as const;

export type ContactMethod = (typeof CONTACT_METHODS)[number];
export type Reason = (typeof REASONS)[number];

export type AppointmentMessages = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  contactMethod: "Please choose a preferred contact method.",
  reason: "Please choose a reason for your visit.",
};

export function appointmentSchema(m: AppointmentMessages = DEFAULT_MESSAGES) {
  return z.object({
    firstName: z.string().trim().min(1, m.firstName).max(80),
    lastName: z.string().trim().min(1, m.lastName).max(80),
    email: z.string().trim().min(1, m.email).max(160).email(m.email),
    phone: z
      .string()
      .trim()
      .min(7, m.phone)
      .max(30)
      .regex(/^[0-9+()\-.\s]+$/, m.phone),
    contactMethod: z.enum(CONTACT_METHODS, { message: m.contactMethod }),
    // Short scheduling note only — never medical detail.
    timeWindow: z.string().trim().max(120).optional(),
    reason: z.enum(REASONS, { message: m.reason }),
    locale: z.string().max(5).optional(),
    // Honeypot: should stay empty. Accepted by the schema so the API route can
    // detect a filled value and silently succeed — giving bots no signal that
    // their submission was dropped (SPEC §5).
    company: z.string().max(200).optional(),
  });
}

export type AppointmentInput = z.infer<ReturnType<typeof appointmentSchema>>;
