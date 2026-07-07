import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/appointment-schema";
import { getSupabase } from "@/lib/supabase";
import { appendLeadToSheet } from "@/lib/google-sheets";

// Basic in-memory rate limiting (SPEC §5). Per-instance only — for production
// behind multiple instances, move this to a shared store (e.g. Upstash).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Revalidate on the server with default (English) messages.
  const parsed = appointmentSchema().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 400 },
    );
  }

  // Honeypot: a filled "company" field means a bot. Pretend success so the bot
  // gets no signal, but persist nothing.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { firstName, lastName, contactMethod, timeWindow, reason, locale } =
    parsed.data;
  // One of email/phone is optional depending on contactMethod; the store
  // columns are NOT NULL, so coerce a missing value to an empty string.
  const email = parsed.data.email ?? "";
  const phone = parsed.data.phone ?? "";

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("appointment_requests").insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      contact_method: contactMethod,
      time_window: timeWindow || null,
      reason,
      locale: locale ?? null,
      source: "website-contact",
    });
    if (error) {
      console.error("[appointment-request] Supabase insert failed:", error.message);
      return NextResponse.json(
        { ok: false, error: "store_failed" },
        { status: 502 },
      );
    }
  } else {
    // No Supabase configured (e.g. local dev). Don't fail the demo flow.
    console.warn(
      "[appointment-request] Supabase not configured — skipping persistence.",
    );
  }

  // Secondary sink (SPEC §5): push the prospect to a Google Sheet so agents can
  // review and call. Best-effort — a sheet failure must NOT fail the patient's
  // submission (their request is already stored in Supabase). No-ops if Google
  // env vars are unset.
  try {
    await appendLeadToSheet({
      createdAt: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone,
      contactMethod,
      timeWindow: timeWindow || "",
      reason,
      locale: locale ?? "",
    });
  } catch (err) {
    console.error(
      "[appointment-request] Google Sheets append failed:",
      err instanceof Error ? err.message : err,
    );
  }

  // INTEGRATION POINT (SPEC §5): optional email notification (Resend). Wire up
  // here using env vars — never hard-code keys.
  //   if (process.env.RESEND_API_KEY) { await fetch("https://api.resend.com/emails", { ... }); }

  return NextResponse.json({ ok: true });
}
