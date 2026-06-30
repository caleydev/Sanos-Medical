import { JWT } from "google-auth-library";

/**
 * Appends a lead-capture submission as a row to a Google Sheet so the practice's
 * agents can review and call prospects (SPEC §5 — notification/integration
 * point). This is a secondary sink: the canonical store is Supabase. Lead data
 * here is non-PHI (name / contact / non-medical reason).
 *
 * No-ops when Google env vars are unset, so local dev and Supabase-only setups
 * keep working. Callers should treat failures as non-fatal (best effort) — a
 * sheet outage must not block the patient's submission.
 */
export type LeadRow = {
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: string;
  timeWindow: string;
  reason: string;
  locale: string;
};

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY,
  );
}

export async function appendLeadToSheet(row: LeadRow): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Env stores the PEM with literal "\n"; restore real newlines.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!spreadsheetId || !clientEmail || !privateKey) return;

  // Tab/sheet name within the workbook (default "Prospects").
  const tab = process.env.GOOGLE_SHEETS_TAB ?? "Prospects";

  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const { token } = await auth.getAccessToken();
  if (!token) throw new Error("Could not obtain Google access token");

  const range = `${tab}!A1`;
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}` +
    `/values/${encodeURIComponent(range)}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const values = [
    [
      row.createdAt,
      row.firstName,
      row.lastName,
      row.email,
      row.phone,
      row.contactMethod,
      row.timeWindow,
      row.reason,
      row.locale,
    ],
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    throw new Error(
      `Google Sheets append failed: ${res.status} ${await res.text()}`,
    );
  }
}
