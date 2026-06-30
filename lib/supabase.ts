import { createClient } from "@supabase/supabase-js";

/**
 * Lazily creates a Supabase client for lead capture (SPEC §5). Uses the ANON
 * key on purpose: the `appointment_requests` table has an insert-only RLS
 * policy for `anon`, so even this server route cannot read rows back. See
 * supabase/migrations/0001_appointment_requests.sql.
 *
 * Returns `null` when Supabase env vars are not configured, so local dev works
 * without a project — the API route then skips persistence (and logs) instead
 * of crashing.
 */
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
