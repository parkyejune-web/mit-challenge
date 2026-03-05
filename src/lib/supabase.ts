import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Server-side Supabase client. Use SUPABASE_SERVICE_ROLE_KEY for admin reads. */
export function getSupabaseAdmin() {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Funnel stage enum — must match frontend tracking. */
export type FunnelStage =
  | "landing"
  | "survey_q1"
  | "survey_q2"
  | "survey_q3"
  | "survey_q4"
  | "uid_input"
  | "final_dm";

export interface FunnelTrackerRow {
  id?: string;
  session_id: string;
  stage: string;
  reached_at: string;
  time_spent_seconds?: number | null;
  uid?: string | null;
  created_at?: string;
}
