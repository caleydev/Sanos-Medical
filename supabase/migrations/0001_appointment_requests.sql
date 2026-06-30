-- Appointment / contact lead capture (SPEC §5).
--
-- COMPLIANCE: PHI-safe by design — NO symptom, diagnosis, medication, or
-- free-text medical columns. `reason` is a fixed non-medical category and
-- `time_window` is a short scheduling note only.
--
-- Apply via the Supabase SQL editor or `supabase db push`.

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  contact_method text not null,
  time_window text,
  reason text not null,
  locale text,
  source text
);

-- RLS on. With no SELECT/UPDATE/DELETE policy, anon is denied all of those.
alter table public.appointment_requests enable row level security;

-- The public site (anon key) may INSERT only — it can never read rows back.
create policy "anon_insert_appointment_requests"
  on public.appointment_requests
  for insert
  to anon
  with check (true);
