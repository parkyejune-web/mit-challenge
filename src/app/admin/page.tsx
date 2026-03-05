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
  landing: "Landing",
  survey_q1: "Survey Q1",
  survey_q2: "Survey Q2",
  survey_q3: "Survey Q3",
  survey_q4: "Survey Q4",
  uid_input: "UID Input",
  final_dm: "Final DM",
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
        setLoginError(json.error || "Login gagal.");
      }
    } catch {
      setLoginError("Koneksi gagal.");
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
      setFetchError("Gagal memuat data.");
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setData(null);
  };

  const copyToClipboard = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopyUid(uid);
    setTimeout(() => setCopyUid(null), 2000);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("id-ID", {
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
        <p className="text-sm text-white/50">Memuat...</p>
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
              Admin — MIT Control Center
            </h1>
            <p className="mt-1 text-xs text-white/50">Hanya Master MIT_ZUN</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-id" className="mb-1.5 block text-xs font-medium text-white/60">
                ID
              </label>
              <input
                id="admin-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                placeholder="Admin ID"
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
                placeholder="Kata sandi"
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
              {loading ? "Masuk..." : "Masuk"}
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
              Control Center — Funnel Analytics
            </h1>
            <p className="mt-1 text-sm text-white/50">Real-time MIT Trading Challenge funnel</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchFunnel}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              Segarkan
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
            >
              Keluar
            </button>
          </div>
        </header>

        {fetchError && (
          <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-300">
            {fetchError}
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
              Traffic
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/50">Total View</p>
                <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {data?.traffic?.totalViews ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-white/50">Sesi aktif (5 menit)</p>
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
              Conversion Funnel
            </h2>
            <p className="mb-4 text-xs text-white/50">
              Landing → Survey Q1–Q4 → UID Input → Final DM (drop-off %)
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
                      return `${v} sesi${drop != null ? ` • Drop-off: ${drop}%` : ""}`;
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
              User Behavior — Drop-off & Waktu
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-white/50">Titik drop-off (keluar tanpa selesai)</p>
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
                        <span className="text-sm text-red-400/90">{d.dropOffCount} keluar</span>
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
                <p className="mb-2 text-xs text-white/50">Paling lama di tahap (rata-rata detik)</p>
                {maxTimeStage && maxTimeStage.avgSeconds > 0 ? (
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                    <span className="font-medium text-cyan-300">
                      {STAGE_LABELS[maxTimeStage.stage] ?? maxTimeStage.stage}
                    </span>
                    <span className="ml-2 text-sm text-cyan-400/90">
                      {maxTimeStage.avgSeconds}s ({maxTimeStage.totalSessions} sesi)
                    </span>
                  </div>
                ) : (
                  <p className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/50">
                    Belum ada data waktu
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
                    <th className="pb-2 pr-4 font-medium hidden sm:table-cell">Waktu</th>
                    <th className="pb-2 w-20 text-right">Salin</th>
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
                            {copyUid === row.uid ? "Tersalin" : "Salin"}
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
