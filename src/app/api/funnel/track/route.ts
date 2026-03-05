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

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  return real?.trim() || null;
}

/**
 * POST /api/funnel/track
 * Record a funnel stage (e.g. landing view). Uses server-side Supabase.
 * If ADMIN_EXCLUDE_IP env matches request IP, event is not stored (admin visits excluded).
 */
export async function POST(request: NextRequest) {
  const excludeIp = process.env.ADMIN_EXCLUDE_IP?.trim();
  if (excludeIp) {
    const clientIp = getClientIp(request);
    if (clientIp && clientIp === excludeIp) {
      return Response.json({ ok: true, skipped: "excluded_ip" });
    }
  }

  let body: { stage?: string; session_id?: string; uid?: string; utm_source?: string; utm_medium?: string; referrer?: string };
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
    utm_source?: string;
    utm_medium?: string;
    referrer?: string;
  } = {
    session_id: sessionId,
    stage,
    reached_at: new Date().toISOString(),
  };
  if (stage === "uid_input" || stage === "final_dm") {
    const uid = typeof body.uid === "string" ? body.uid.trim() : null;
    if (uid) row.uid = uid;
  }
  const utmSource = typeof body.utm_source === "string" ? body.utm_source.trim().slice(0, 256) : null;
  const utmMedium = typeof body.utm_medium === "string" ? body.utm_medium.trim().slice(0, 256) : null;
  const referrer = typeof body.referrer === "string" ? body.referrer.trim().slice(0, 512) : null;
  if (utmSource) row.utm_source = utmSource;
  if (utmMedium) row.utm_medium = utmMedium;
  if (referrer) row.referrer = referrer;

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
