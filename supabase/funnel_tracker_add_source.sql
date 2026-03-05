-- 유입 경로 추적: 어디서 들어왔는지 (UTM + 레퍼러)
-- Supabase SQL Editor에서 한 번만 실행.

alter table public.funnel_tracker
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists referrer text;

create index if not exists idx_funnel_tracker_utm_source on public.funnel_tracker (utm_source) where utm_source is not null;
