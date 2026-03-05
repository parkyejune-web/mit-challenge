import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_STAGES = [
  "landing",
  "survey_q1",
  "survey_q2",
  "survey_q3",
  "survey_q4",
  "uid_input",
  "final_dm",
] as const;

/**
 * POST /api/funnel/track
 * Record a funnel stage (e.g. landing view). Uses server-side Supabase.
 */
export async function POST(request: NextRequest) {
  let body: { stage?: string; session_id?: string; uid?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const stage = typeof body.stage === "string" ? body.stage.trim().toLowerCase() : "";
  if (!stage || !ALLOWED_STAGES.includes(stage as (typeof ALLOWED_STAGES)[number])) {
    return Response.json(
      { ok: false, error: `stage must be one of: ${ALLOWED_STAGES.join(", ")}` },
      { status: 400 }
    );
  }

  let sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      { ok: false, error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const row: {
    session_id: string;
    stage: string;
    reached_at: string;
    uid?: string;
  } = {
    session_id: sessionId,
    stage,
    reached_at: new Date().toISOString(),
  };
  if (stage === "uid_input" || stage === "final_dm") {
    const uid = typeof body.uid === "string" ? body.uid.trim() : null;
    if (uid) row.uid = uid;
  }

  const { error } = await supabase.from("funnel_tracker").insert(row);

  if (error) {
    console.error("funnel_tracker insert error:", error);
    return Response.json(
      { ok: false, error: "Failed to record event" },
      { status: 500 }
    );
  }

  return Response.json({ ok: true, session_id: sessionId });
}
