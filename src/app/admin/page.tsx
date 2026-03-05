"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const OBSIDIAN = "#0a0a0b";
const STAGE_LABELS: Record<string, string> = {
  landing: "메인",
  survey_q1: "설문 1",
  survey_q2: "설문 2",
  survey_q3: "설문 3",
  survey_q4: "설문 4",
  uid_input: "UID 입력",
  final_dm: "최종 DM",
};

type FunnelItem = { stage: string; count: number; dropOffPercent: number };
type Traffic = { totalViews: number; activeSessions: number };
type UidEntry = { uid: string; reached_at: string };
type DropOffItem = { stage: string; dropOffCount: number };
type TimeSpentItem = { stage: string; avgSeconds: number; totalSessions: number };

type FunnelData = {
  traffic: Traffic;
  funnel: FunnelItem[];
  uidList: UidEntry[];
  dropOffByStage: DropOffItem[];
  timeSpentByStage: TimeSpentItem[];
};

const CHART_COLORS = ["#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63", "#0c4a6e"];
const DROP_OFF_COLOR = "#ef4444";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FunnelData | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [copyUid, setCopyUid] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/funnel");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), password }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setAuthenticated(true);
        setId("");
        setPassword("");
        fetchFunnel();
      } else {
        setLoginError(json.error || "로그인 실패.");
      }
    } catch {
      setLoginError("연결 실패.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFunnel = useCallback(async () => {
    setFetchError("");
    try {
      const res = await fetch("/api/admin/funnel");
      if (!res.ok) {
        if (res.status === 401) setAuthenticated(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setFetchError("데이터 불러오기 실패.");
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
  };

  const handleResetFunnel = async () => {
    if (!confirm("퍼널 데이터를 모두 삭제하고 초기화할까요? 이 작업은 되돌릴 수 없습니다.")) return;
    setResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch("/api/admin/funnel/reset", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.ok) {
        setResetMessage("초기화되었습니다.");
        fetchFunnel();
        setTimeout(() => setResetMessage(null), 3000);
      } else {
        setResetMessage(json.error || "초기화 실패.");
      }
    } catch {
      setResetMessage("초기화 요청 실패.");
    } finally {
      setResetting(false);
    }
  };

  const copyToClipboard = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopyUid(uid);
    setTimeout(() => setCopyUid(null), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("ko-KR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  if (authenticated === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-sans"
        style={{ background: OBSIDIAN, color: "#fafafa" }}
      >
        <p className="text-sm text-white/50">로딩 중...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 font-sans"
        style={{ background: OBSIDIAN, color: "#fafafa" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl"
        >
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">
              어드민 — MIT 관제 센터
            </h1>
            <p className="mt-1 text-xs text-white/50">마스터 MIT_ZUN 전용</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-id" className="mb-1.5 block text-xs font-medium text-white/60">
                아이디
              </label>
              <input
                id="admin-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                placeholder="관리자 아이디"
                required
              />
            </div>
            <div>
              <label htmlFor="admin-pw" className="mb-1.5 block text-xs font-medium text-white/60">
                Kata sandi
              </label>
              <input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                placeholder="비밀번호"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 disabled:opacity-50"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const funnelChartData = (data?.funnel ?? []).map((f) => ({
    name: STAGE_LABELS[f.stage] ?? f.stage,
    count: f.count,
    dropOff: f.dropOffPercent,
    stage: f.stage,
  }));
  const maxTimeStage = data?.timeSpentByStage?.reduce(
    (acc, cur) => (cur.avgSeconds > (acc?.avgSeconds ?? 0) ? cur : acc),
    null as TimeSpentItem | null
  );

  return (
    <div
      className="min-h-screen overflow-x-hidden font-sans"
      style={{ background: OBSIDIAN, color: "#fafafa" }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              관제 센터 — 퍼널 분석
            </h1>
            <p className="mt-1 text-sm text-white/50">MIT 트레이딩 챌린지 실시간 퍼널</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetFunnel}
              disabled={resetting}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
            >
              {resetting ? "초기화 중..." : "퍼널 초기화"}
            </button>
            <button
              type="button"
              onClick={fetchFunnel}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              새로고침
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
            >
              로그아웃
            </button>
          </div>
        </header>

        {fetchError && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            {fetchError}
          </p>
        )}
        {resetMessage && (
          <p className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            {resetMessage}
          </p>
        )}

        <div className="space-y-8">
          {/* Traffic Card */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              트래픽
            </h2>
            <p className="mb-3 text-xs text-white/45">
              ADMIN_EXCLUDE_IP에 내 IP를 넣어두면 내 접속은 트래킹에서 제외됩니다.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/50">총 조회수</p>
                <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {data?.traffic?.totalViews ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/50">활성 세션 (5분)</p>
                <p className="mt-1 text-2xl font-bold text-cyan-400 sm:text-3xl">
                  {data?.traffic?.activeSessions ?? 0}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Conversion Funnel — horizontal bar */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              전환 퍼널
            </h2>
            <p className="mb-4 text-xs text-white/50">
              메인 → 설문 1~4 → UID 입력 → 최종 DM (이탈률 %)
            </p>
            <div className="h-[320px] w-full min-w-0 sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelChartData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 80, bottom: 8 }}
                >
                  <XAxis type="number" stroke="#71717a" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#71717a" fontSize={11} width={72} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#a1a1aa" }}
                    formatter={(value, _name, props) => {
                      const v = typeof value === "number" ? value : 0;
                      const drop = (props?.payload as { dropOff?: number })?.dropOff;
                      return `${v}세션${drop != null ? ` • 이탈: ${drop}%` : ""}`;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={32}>
                    {funnelChartData.map((entry, index) => (
                      <Cell key={entry.stage} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.section>

          {/* Drop-off & Time spent insight */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              사용자 행동 — 이탈 & 체류 시간
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-white/50">이탈 구간 (완료 없이 나간 단계)</p>
                <ul className="space-y-1.5">
                  {(data?.dropOffByStage ?? [])
                    .filter((d) => d.dropOffCount > 0)
                    .sort((a, b) => b.dropOffCount - a.dropOffCount)
                    .map((d) => (
                      <li
                        key={d.stage}
                        className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2"
                      >
                        <span className="font-medium text-red-300">
                          {STAGE_LABELS[d.stage] ?? d.stage}
                        </span>
                        <span className="text-sm text-red-400/90">{d.dropOffCount}명 이탈</span>
                      </li>
                    ))}
                  {(!data?.dropOffByStage?.length || data.dropOffByStage.every((d) => d.dropOffCount === 0)) && (
                    <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50">
                      Belum ada data drop-off
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs text-white/50">가장 오래 머문 단계 (평균 초)</p>
                {maxTimeStage && maxTimeStage.avgSeconds > 0 ? (
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                    <span className="font-medium text-cyan-300">
                      {STAGE_LABELS[maxTimeStage.stage] ?? maxTimeStage.stage}
                    </span>
                    <span className="ml-2 text-sm text-cyan-400/90">
                      {maxTimeStage.avgSeconds}초 ({maxTimeStage.totalSessions}세션)
                    </span>
                  </div>
                ) : (
                  <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50">
                    체류 시간 데이터 없음
                  </p>
                )}
              </div>
            </div>
          </motion.section>

          {/* UID Table */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              UID Terkini
            </h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full min-w-[320px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/60">
                    <th className="pb-2 pr-4 font-medium">UID</th>
                    <th className="pb-2 pr-4 font-medium hidden sm:table-cell">시간</th>
                    <th className="pb-2 w-20 text-right">복사</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {(data?.uidList ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-white/50">
                        Belum ada UID terekam
                      </td>
                    </tr>
                  ) : (
                    (data?.uidList ?? []).map((row, i) => (
                      <tr key={`${row.uid}-${i}`} className="border-b border-white/5">
                        <td className="py-3 pr-4 font-mono text-xs sm:text-sm">{row.uid}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell text-white/60">
                          {formatDate(row.reached_at)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.uid)}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
                          >
                            {copyUid === row.uid ? "복사됨" : "복사"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
