import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/deploy-check
 * Env + Supabase 연결 + 퍼널 추적 여부 확인. 비밀값 노출 없음.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const supabaseConfigured = !!(supabaseUrl && supabaseKey);
  let supabaseConnected = false;
  let landingCount = 0;

  if (supabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error } = await supabase
          .from("funnel_tracker")
          .select("id")
          .limit(1);
        supabaseConnected = !error;
        if (!error) {
          const { count } = await supabase
            .from("funnel_tracker")
            .select("*", { count: "exact", head: true })
            .eq("stage", "landing");
          landingCount = count ?? 0;
        }
      }
    } catch {
      supabaseConnected = false;
    }
  }

  const adminConfigured = !!(adminId && adminPassword);

  return Response.json({
    ok: true,
    supabaseConfigured,
    supabaseConnected,
    adminConfigured,
    tracking: {
      landingCount,
      message:
        supabaseConnected && landingCount > 0
          ? "랜딩 추적 정상 (Landing view 기록됨)"
          : supabaseConnected
            ? "DB 연결됨. 메인 페이지 접속 후 landingCount 증가 확인"
            : "Supabase 미연결 또는 funnel_tracker 없음",
    },
  });
}
