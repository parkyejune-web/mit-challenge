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

const STAGES_ORDER: string[] = [
  "landing",
  "survey_q1",
  "survey_q2",
  "survey_q3",
  "survey_q4",
  "uid_input",
  "final_dm",
];

export async function GET(_request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return Response.json(
      {
        traffic: { totalViews: 0, activeSessions: 0 },
        funnel: [],
        uidList: [],
        dropOffByStage: [],
        timeSpentByStage: [],
      },
      { status: 200 }
    );
  }

  const now = new Date();
  const activeSince = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

  try {
    const { data: rows, error } = await supabase
      .from("funnel_tracker")
      .select("session_id, stage, reached_at, time_spent_seconds, uid, utm_source, utm_medium, referrer")
      .order("reached_at", { ascending: false });

    if (error) {
      console.error("Supabase funnel_tracker error:", error);
      return Response.json(
        {
          traffic: { totalViews: 0, activeSessions: 0 },
          funnel: STAGES_ORDER.map((s) => ({ stage: s, count: 0, dropOffPercent: 0 })),
          uidList: [],
          dropOffByStage: [],
          timeSpentByStage: [],
          sourceBreakdown: { byUtmSource: [], byReferrer: [] },
          segmentFunnel: {},
        },
        { status: 200 }
      );
    }

    const list = (rows || []) as { session_id: string; stage: string; reached_at: string; time_spent_seconds?: number | null; uid?: string | null; utm_source?: string | null; utm_medium?: string | null; referrer?: string | null }[];

    const uniqueSessionsByStage: Record<string, Set<string>> = {};
    STAGES_ORDER.forEach((s) => (uniqueSessionsByStage[s] = new Set()));
    const sessionLastStage: Record<string, { stage: string; at: string }> = {};
    const sessionTimeSpent: Record<string, Record<string, number>> = {};
    const uidEntries: { uid: string; reached_at: string; session_id: string }[] = [];

    for (const r of list) {
      uniqueSessionsByStage[r.stage]?.add(r.session_id);
      if (!sessionLastStage[r.session_id] || sessionLastStage[r.session_id].at < r.reached_at) {
        sessionLastStage[r.session_id] = { stage: r.stage, at: r.reached_at };
      }
      if (r.time_spent_seconds != null && r.time_spent_seconds > 0) {
        if (!sessionTimeSpent[r.session_id]) sessionTimeSpent[r.session_id] = {};
        sessionTimeSpent[r.session_id][r.stage] = (sessionTimeSpent[r.session_id][r.stage] || 0) + r.time_spent_seconds;
      }
      if (r.uid && r.uid.trim()) {
        uidEntries.push({ uid: r.uid.trim(), reached_at: r.reached_at, session_id: r.session_id });
      }
    }

    const totalViews = new Set(list.map((r) => r.session_id)).size;
    const activeSessions = new Set(
      list.filter((r) => r.reached_at >= activeSince).map((r) => r.session_id)
    ).size;

    const stageCounts = STAGES_ORDER.map((s) => uniqueSessionsByStage[s]?.size ?? 0);
    const funnel = STAGES_ORDER.map((stage, i) => {
      const count = stageCounts[i];
      const prev = stageCounts[i - 1] ?? count;
      const dropOffPercent = prev > 0 ? Math.round((1 - count / prev) * 100) : 0;
      return { stage, count, dropOffPercent };
    });

    const dropOffCount: Record<string, number> = {};
    STAGES_ORDER.forEach((s) => (dropOffCount[s] = 0));
    Object.values(sessionLastStage).forEach(({ stage }) => {
      if (stage !== "final_dm") dropOffCount[stage] = (dropOffCount[stage] || 0) + 1;
    });
    const dropOffByStage = STAGES_ORDER.map((stage) => ({
      stage,
      dropOffCount: dropOffCount[stage] || 0,
    }));

    const timeSpentAgg: Record<string, { total: number; count: number }> = {};
    STAGES_ORDER.forEach((s) => (timeSpentAgg[s] = { total: 0, count: 0 }));
    Object.values(sessionTimeSpent).forEach((byStage) => {
      Object.entries(byStage).forEach(([stage, sec]) => {
        if (timeSpentAgg[stage]) {
          timeSpentAgg[stage].total += sec;
          timeSpentAgg[stage].count += 1;
        }
      });
    });
    const timeSpentByStage = STAGES_ORDER.map((stage) => ({
      stage,
      avgSeconds: timeSpentAgg[stage].count
        ? Math.round(timeSpentAgg[stage].total / timeSpentAgg[stage].count)
        : 0,
      totalSessions: timeSpentAgg[stage].count,
    }));

    const uidList = [...uidEntries]
      .sort((a, b) => (b.reached_at > a.reached_at ? 1 : -1))
      .slice(0, 100)
      .map(({ uid, reached_at }) => ({ uid, reached_at }));

    const landingRows = list.filter((r) => r.stage === "landing");
    const byUtmSource: Record<string, number> = {};
    const byReferrer: Record<string, number> = {};
    for (const r of landingRows) {
      const src = r.utm_source?.trim() || "(직접)";
      byUtmSource[src] = (byUtmSource[src] || 0) + 1;
      const ref = r.referrer?.trim() ? (r.referrer.length > 60 ? r.referrer.slice(0, 60) + "…" : r.referrer) : "(직접)";
      byReferrer[ref] = (byReferrer[ref] || 0) + 1;
    }
    const sourceBreakdown = {
      byUtmSource: Object.entries(byUtmSource).sort((a, b) => b[1] - a[1]).slice(0, 20),
      byReferrer: Object.entries(byReferrer).sort((a, b) => b[1] - a[1]).slice(0, 20),
    };

    const sessionToSource: Record<string, string> = {};
    for (const r of landingRows) {
      const src = r.utm_source?.trim() || "direct";
      if (!sessionToSource[r.session_id]) sessionToSource[r.session_id] = src;
    }
    const SEGMENTS = [
      { key: "youtube_mit_trading", label: "유튜브" },
      { key: "discord", label: "디스코드" },
    ] as const;
    const segmentFunnel: Record<string, { label: string; totalViews: number; funnel: { stage: string; count: number; dropOffPercent: number }[]; uidCount: number }> = {};
    for (const seg of SEGMENTS) {
      const sessionIds = new Set<string>();
      for (const [sid, src] of Object.entries(sessionToSource)) {
        if (src === seg.key) sessionIds.add(sid);
      }
      const segList = list.filter((r) => sessionIds.has(r.session_id));
      const segByStage: Record<string, Set<string>> = {};
      STAGES_ORDER.forEach((s) => (segByStage[s] = new Set()));
      for (const r of segList) {
        segByStage[r.stage]?.add(r.session_id);
      }
      const segStageCounts = STAGES_ORDER.map((s) => segByStage[s]?.size ?? 0);
      const segFunnel = STAGES_ORDER.map((stage, i) => {
        const count = segStageCounts[i];
        const prev = segStageCounts[i - 1] ?? count;
        const dropOffPercent = prev > 0 ? Math.round((1 - count / prev) * 100) : 0;
        return { stage, count, dropOffPercent };
      });
      const segUidCount = new Set(uidEntries.filter((e) => sessionIds.has(e.session_id)).map((e) => e.uid)).size;
      segmentFunnel[seg.key] = {
        label: seg.label,
        totalViews: sessionIds.size,
        funnel: segFunnel,
        uidCount: segUidCount,
      };
    }

    return Response.json({
      traffic: { totalViews, activeSessions },
      funnel,
      uidList,
      dropOffByStage,
      timeSpentByStage,
      sourceBreakdown,
      segmentFunnel,
    });
  } catch (e) {
    console.error("Funnel fetch error:", e);
    return Response.json(
      {
        traffic: { totalViews: 0, activeSessions: 0 },
        funnel: STAGES_ORDER.map((s) => ({ stage: s, count: 0, dropOffPercent: 0 })),
        uidList: [],
        dropOffByStage: [],
        timeSpentByStage: [],
        sourceBreakdown: { byUtmSource: [], byReferrer: [] },
        segmentFunnel: {},
      },
      { status: 200 }
    );
  }
}
