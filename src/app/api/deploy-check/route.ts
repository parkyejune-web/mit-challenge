import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/deploy-check
 * Final deployment readiness: env linkage + Supabase connectivity.
 * Does not expose any secret values.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const supabaseConfigured = !!(supabaseUrl && supabaseKey);
  let supabaseConnected = false;

  if (supabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        const { error } = await supabase
          .from("funnel_tracker")
          .select("id")
          .limit(1);
        supabaseConnected = !error;
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
  });
}
