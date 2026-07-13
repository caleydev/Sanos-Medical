import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { LeadRow } from "./google-sheets";

/**
 * Emails the practice a plain-text notification when a patient submits an
 * appointment request (SPEC §5 — notification/integration point), via Amazon
 * SES. Best-effort secondary sink: the canonical store is Supabase, so an email
 * failure must NOT block the patient's submission.
 *
 * Credentials come from the standard AWS provider chain, so on EC2 you attach an
 * IAM role with ses:SendEmail and store NO secrets. Locally, the chain falls
 * back to AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY (or ~/.aws). Never hard-code
 * keys.
 *
 * COMPLIANCE: this email carries only non-PHI lead fields (name, contact info,
 * non-medical "reason" dropdown) — the same data as the Google Sheet sink.
 * Email is not a secure channel for PHI; the form forbids medical detail, so
 * none reaches here. Do NOT add symptom/diagnosis/medication fields to this body.
 *
 * No-ops when APPOINTMENT_NOTIFY_FROM / APPOINTMENT_NOTIFY_TO are unset, so local
 * dev and email-less setups keep working.
 */
export function isEmailNotifyConfigured(): boolean {
  return Boolean(
    process.env.APPOINTMENT_NOTIFY_FROM && process.env.APPOINTMENT_NOTIFY_TO,
  );
}

let client: SESv2Client | null = null;
function getClient(): SESv2Client {
  if (!client) {
    // SES region must match where the sending domain is verified.
    client = new SESv2Client({
      region: process.env.SES_REGION ?? process.env.AWS_REGION ?? "us-east-1",
    });
  }
  return client;
}

export async function sendAppointmentNotification(row: LeadRow): Promise<void> {
  const from = process.env.APPOINTMENT_NOTIFY_FROM;
  const to = process.env.APPOINTMENT_NOTIFY_TO;
  if (!from || !to) return;

  const name = `${row.firstName} ${row.lastName}`.trim();
  const subject = `New appointment request — ${name || "unknown"} (${row.reason})`;

  const text = [
    "New appointment request from the website.",
    "",
    `Name:              ${name || "—"}`,
    `Email:             ${row.email || "—"}`,
    `Phone:             ${row.phone || "—"}`,
    `Preferred contact: ${row.contactMethod}`,
    `Time window:       ${row.timeWindow || "—"}`,
    `Reason:            ${row.reason}`,
    `Language:          ${row.locale || "—"}`,
    `Submitted:         ${row.createdAt}`,
    "",
    "This lead is also stored in Supabase. Do not send medical advice by email.",
  ].join("\n");

  await getClient().send(
    new SendEmailCommand({
      FromEmailAddress: from,
      Destination: {
        ToAddresses: to
          .split(",")
          .map((addr) => addr.trim())
          .filter(Boolean),
      },
      // Let the team reply straight to the patient when they left an email.
      ReplyToAddresses: row.email ? [row.email] : undefined,
      Content: {
        Simple: {
          Subject: { Data: subject, Charset: "UTF-8" },
          Body: { Text: { Data: text, Charset: "UTF-8" } },
        },
      },
    }),
  );
}
