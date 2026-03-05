/** 공용 퍼널 세션 + 트래킹 (랜딩/설문/온보딩) */

const FUNNEL_SESSION_KEY = "mit-funnel-session";

export function getOrCreateFunnelSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(FUNNEL_SESSION_KEY);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      sessionStorage.setItem(FUNNEL_SESSION_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }
}

export type FunnelStage =
  | "landing"
  | "survey_q1"
  | "survey_q2"
  | "survey_q3"
  | "survey_q4"
  | "uid_input"
  | "final_dm";

export type SourceInfo = { utm_source?: string; utm_medium?: string; referrer?: string };

export function trackFunnelStage(stage: FunnelStage, uidOrSource?: string | SourceInfo): void {
  const sessionId = getOrCreateFunnelSessionId();
  if (!sessionId) return;
  const body: { stage: string; session_id: string; uid?: string; utm_source?: string; utm_medium?: string; referrer?: string } = {
    stage,
    session_id: sessionId,
  };
  if (stage === "landing" && typeof uidOrSource === "object" && uidOrSource !== null) {
    if (uidOrSource.utm_source) body.utm_source = uidOrSource.utm_source;
    if (uidOrSource.utm_medium) body.utm_medium = uidOrSource.utm_medium;
    if (uidOrSource.referrer) body.referrer = uidOrSource.referrer;
  } else if ((stage === "uid_input" || stage === "final_dm") && typeof uidOrSource === "string" && uidOrSource) {
    body.uid = uidOrSource;
  }
  fetch("/api/funnel/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}
