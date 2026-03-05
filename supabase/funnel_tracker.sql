-- Funnel tracker table for admin dashboard analytics.
-- Run in Supabase SQL Editor. Use RLS to restrict access; admin reads via service_role key.

create table if not exists public.funnel_tracker (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  stage text not null check (stage in (
    'landing', 'survey_q1', 'survey_q2', 'survey_q3', 'survey_q4', 'uid_input', 'final_dm'
  )),
  reached_at timestamptz not null default now(),
  time_spent_seconds numeric,
  uid text,
  created_at timestamptz default now()
);

create index if not exists idx_funnel_tracker_session_id on public.funnel_tracker (session_id);
create index if not exists idx_funnel_tracker_stage on public.funnel_tracker (stage);
create index if not exists idx_funnel_tracker_reached_at on public.funnel_tracker (reached_at desc);

-- RLS: deny select by default (anon cannot read). Service role key bypasses RLS for admin dashboard.
alter table public.funnel_tracker enable row level security;

-- Allow insert so frontend/landing can send funnel events (with anon or service key).
create policy "Allow insert for tracking"
  on public.funnel_tracker for insert
  with check (true);
