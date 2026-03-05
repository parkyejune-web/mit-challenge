import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";

const COOKIE_NAME = "admin_session";

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "change-me-in-production";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

async function isAdminAuthenticated(): Promise<boolean> {
  const adminId = process.env.ADMIN_ID;
  if (!adminId) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || sig !== sign(payload)) return false;
  const [id] = payload.split(":");
  return id === adminId;
}

/**
 * POST /api/admin/funnel/reset
 * 어드민 전용: funnel_tracker 테이블 전체 삭제 (퍼널 데이터 초기화)
 */
export async function POST(_request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json({ ok: false, error: "Supabase not configured" }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from("funnel_tracker")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      console.error("funnel_tracker reset error:", error);
      return Response.json({ ok: false, error: "초기화 실패." }, { status: 500 });
    }
    return Response.json({ ok: true, message: "퍼널 데이터가 초기화되었습니다." });
  } catch (e) {
    console.error("Funnel reset error:", e);
    return Response.json({ ok: false, error: "초기화 실패." }, { status: 500 });
  }
}
