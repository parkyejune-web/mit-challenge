"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  HERO_TITLE,
  HERO_SUB,
  HERO_SUB_MOBILE,
  GATE_BADGE,
  LABEL_VERIFIED_API,
  PROOF_HEADING_TITLE,
  PROOF_HEADING_SUB,
  LIVE_ACCOUNT_VERIFICATION_TITLE,
  LIVE_ACCOUNT_VERIFICATION_SUB,
  CTA_BUTTON,
  CTA_MICRO,
  SITE_TITLE,
  STORYTELLING_TITLE,
  STORYTELLING_BODY,
  STORYTELLING_BODY_MOBILE,
  STORYTELLING_PUNCHLINE,
  STORYTELLING_PUNCHLINE_MOBILE,
  SCAN_PHASE_1,
  SCAN_PHASE_2,
  BAR_LEFT_MESSAGE,
  POLICY_TITLE,
  POLICY_QUOTA,
  POLICY_DESC,
  POLICY_DESC_MOBILE,
  ENROLLMENT_STATUS_LABEL,
  LABEL_REALTIME_VERIFICATION,
  LABEL_LIVE_TRADING_RESULTS,
  LABEL_ENTRY_TIMING,
  LABEL_TOTAL_PROFIT_TRADES,
  LABEL_VIDEO_VERIFICATION,
  LABEL_ACCOUNT_VERIFICATION,
  PROOF_VERIFIED_BADGE,
  MIT_LOGIC_VERIFIED_BADGE,
  MIT_LOGIC_SECTION_TITLE,
  MIT_LOGIC_CARDS,
  DASHBOARD_INTRO,
  DASHBOARD_INTRO_MOBILE,
  DASHBOARD_TABLE_TITLE,
  BADGE_WIN_RATE,
  BADGE_CUMULATIVE_PL,
  RISK_CALC_TITLE,
  RISK_NOTE,
  RISK_ACCOUNT_LINE,
  RISK_FUTURE_BALANCE,
  RISK_PCT,
  RISK_POSITION,
  EQUITY_CHART_TITLE,
  DASHBOARD_HIGHLIGHT_1,
  DASHBOARD_HIGHLIGHT_2,
} from "@/lib/constants";
import {
  PROOF_IMAGE_PATHS,
  PROOF_VIDEO_PATH,
  PROOF_TRADES,
  getTotalProfitUsdt,
  getWinRatePercent,
} from "@/lib/proof-assets";
import { trackFunnelStage } from "@/lib/funnel";

/** Luxury scroll reveal: PC (lg+) only, once: true, 0.8s easeOut */
const VIEWPORT = { once: true, margin: "-80px" };
const REVEAL_TRANSITION = { duration: 0.8, ease: "easeOut" as const };
const STAGGER_DELAY = 0.1;
const STAGGER_DELAY_CHILDREN = 0.05;

function useIsLg() {
  const [isLg, setIsLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const fn = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return isLg;
}

function useSurveyRedirect() {
  const [loading, setLoading] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const go = useCallback(() => {
    setLoading(true);
    setScanPhase(0);
  }, []);
  useEffect(() => {
    if (!loading) return;
    const t1 = setTimeout(() => setScanPhase(1), 1000);
    const t2 = setTimeout(() => {
      window.location.href = "/survey";
    }, 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [loading]);
  return { loading, go, scanPhase };
}

/** PART 12-2: Shared CTA — full width on mobile, thumb-friendly padding */
const CTA_BUTTON_CLASS =
  "cta-luxury group relative flex w-full max-w-full sm:max-w-[300px] shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border py-3.5 px-6 text-base font-black text-white transition-transform duration-300 md:py-3 md:text-lg";

/** PART 14-3: Force 4-decimal precision for journal price display */
function formatPrice4(s: string): string {
  const n = parseFloat(s.replace(/,/g, ""));
  if (Number.isNaN(n)) return s;
  const fixed = n.toFixed(4);
  if (Math.abs(n) >= 1000) {
    const [int, dec] = fixed.split(".");
    const withComma = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return dec ? `${withComma}.${dec}` : withComma;
  }
  return fixed;
}

export default function Home() {
  const { loading, go, scanPhase } = useSurveyRedirect();
  const isLg = useIsLg();
  const totalProfit = getTotalProfitUsdt();
  const winRate = getWinRatePercent();
  const [inBottomZone, setInBottomZone] = useState(false);
  const [proofSliderIndex, setProofSliderIndex] = useState(0);
  const proofSliderRef = useRef<HTMLDivElement>(null);
  const tradeSliderRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (v) => setInBottomZone(v > 0.85));
  const floatingVisible = !inBottomZone;
  const floatingOpacity = floatingVisible ? 1 : 0;
  const floatingScale = floatingVisible ? 1 : 0.95;
  const floatingPointerEvents = floatingVisible ? "auto" : "none";
  const floatingAriaHidden = !floatingVisible;

  /** Luxury scroll reveal (PC lg+ only): section + stagger variants */
  const sectionReveal = useMemo(
    () =>
      isLg
        ? { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: VIEWPORT, transition: REVEAL_TRANSITION }
        : { initial: { opacity: 1, y: 0 } },
    [isLg]
  );
  const containerVariants = useMemo(
    () =>
      isLg
        ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: STAGGER_DELAY, delayChildren: STAGGER_DELAY_CHILDREN } } }
        : { hidden: { opacity: 1 }, visible: { opacity: 1 } },
    [isLg]
  );
  const itemVariants = useMemo(
    () =>
      isLg
        ? { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION } }
        : { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } },
    [isLg]
  );
  const galleryStagger = useMemo(
    () =>
      isLg
        ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: STAGGER_DELAY, delayChildren: STAGGER_DELAY_CHILDREN } } }
        : { hidden: { opacity: 1 }, visible: { opacity: 1 } },
    [isLg]
  );
  const galleryItem = useMemo(
    () =>
      isLg
        ? { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: REVEAL_TRANSITION } }
        : { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } },
    [isLg]
  );

  const syncProofSliderIndex = useCallback(() => {
    const el = proofSliderRef.current;
    if (!el) return;
    const first = el.querySelector(".proof-slide");
    const slideWidth = first?.getBoundingClientRect().width ?? 0;
    const gap = 12;
    if (slideWidth > 0) {
      const index = Math.max(0, Math.min(1, Math.round(el.scrollLeft / (slideWidth + gap))));
      setProofSliderIndex(index);
    }
  }, []);
  useEffect(() => {
    trackFunnelStage("landing");
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020202] text-[var(--fg)]">
      {/* Background depth: cyan blur layers (hidden on mobile — no glow) */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden sm:block" aria-hidden>
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/5 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute left-1/2 top-2/3 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-cyan-600/06 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020202]/80 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center gap-1 px-4 py-4 text-center md:flex-row md:justify-center md:gap-4 md:py-4">
            <span className="font-display text-lg font-black tracking-tighter text-white">
              {SITE_TITLE}
            </span>
            <div className="flex items-center gap-2 text-zinc-400" aria-live="polite">
              <span className="status-dot-blink h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-xs font-medium tracking-tight md:text-sm">{ENROLLMENT_STATUS_LABEL}</span>
            </div>
          </div>
        </header>

        {/* PART 13-2: Magnetic CTA — mobile Toss-style (94%, cyan, black); PC lg+ unchanged */}
        <div
          className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-[3%] pb-10 lg:bottom-10 lg:pb-0 lg:px-4"
          style={{
            opacity: floatingOpacity,
            pointerEvents: floatingPointerEvents,
            transition: "opacity 100ms ease-out",
          }}
          aria-hidden={floatingAriaHidden}
        >
          <div className="w-[94%] max-w-[94%] lg:w-auto lg:max-w-[300px]" style={{ transform: `scale(${floatingScale})`, transition: "transform 100ms ease-out" }}>
            <button
              type="button"
              onClick={go}
              className="cta-floating-toss lg:cta-luxury group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-full border-0 py-3.5 px-6 text-base font-black text-black transition-transform duration-300 lg:border lg:py-3 lg:text-lg lg:font-bold lg:text-white"
            >
              <span className="cta-shimmer hidden lg:block" aria-hidden />
              <span className="relative z-10">{CTA_BUTTON}</span>
            </button>
          </div>
        </div>

        <main className="pb-40">
          {/* Hero — luxury reveal (PC lg+), inner stagger */}
          <motion.section
            className="relative flex w-full overflow-hidden px-4 pt-16 pb-20 md:px-8 md:pt-28 md:pb-32"
            {...sectionReveal}
          >
            <div className="absolute inset-0 bg-grid-subtle" aria-hidden />
            <motion.div
              className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              <motion.h1
                className="break-keep font-display font-black leading-tight tracking-tighter text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                variants={itemVariants}
              >
                Trading pakai hoki sudah berakhir.
                <br />
                Saatnya <span className="highlight-box">logika profit</span> yang bicara.
              </motion.h1>
              <motion.p
                className="break-keep mt-8 text-base leading-relaxed text-zinc-400 md:text-lg md:leading-[1.8]"
                variants={itemVariants}
              >
                <span className="sm:hidden">{HERO_SUB_MOBILE}</span>
                <span className="hidden sm:inline">Buktikan strategi $50 ke $100 dengan <span className="highlight-box">Standar MIT</span>. Jika tidak mencapai target, Batch 2 menjadi milik Anda secara gratis.</span>
              </motion.p>
              <motion.div
                className="glow-num-wrap mt-12 flex flex-shrink-0 items-center justify-center gap-4 font-mono text-3xl font-black sm:gap-5 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontSize: "clamp(1.75rem, 6vw, 3.75rem)", fontFamily: "var(--font-mono)" }}
                variants={itemVariants}
              >
                <span className="text-cyan-400 sm:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">$50</span>
                <span className="text-zinc-500">→</span>
                <span className="text-cyan-400 sm:drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">$100</span>
              </motion.div>
            </motion.div>
          </motion.section>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* Section 2: ULTIMATE PROOF — LIVE ACCOUNT VERIFICATION (table + account + video + per-trade) */}
          <motion.section
            className="relative px-4 py-10 md:px-8 md:py-24"
            style={{ background: "radial-gradient(circle at center, rgba(6,182,212,0.06) 0%, transparent 70%)" }}
            {...sectionReveal}
          >
            <div className="text-center">
              <p className="break-keep font-display text-sm font-black uppercase tracking-[0.15em] text-white md:text-base">{LIVE_ACCOUNT_VERIFICATION_TITLE}</p>
            </div>
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT} className="w-full">
            {/* Account verification + video — above table; mobile: swipe carousel */}
            <motion.p
              className="mt-6 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400 sm:mt-8"
              variants={itemVariants}
            >
              {LABEL_ACCOUNT_VERIFICATION}
            </motion.p>
            <motion.div className="mx-auto mt-4 max-w-6xl md:mt-6" variants={containerVariants}>
              {/* 모바일 전용: 정사각형 영상만 (PC 레이아웃과 완전 분리) */}
              <div className="block sm:hidden">
                <div className="overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-black/40 p-4">
                  <div className="relative w-full overflow-hidden rounded-lg border border-white/5" style={{ aspectRatio: "1 / 1" }}>
                    <video
                      src={PROOF_VIDEO_PATH}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-contain"
                    />
                    <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-400/95">
                      {PROOF_VERIFIED_BADGE}
                    </span>
                  </div>
                  <p className="mt-2 border-t border-white/10 pt-2 text-center text-[10px] font-medium text-cyan-400">
                    {LABEL_VIDEO_VERIFICATION}
                  </p>
                </div>
              </div>

              {/* PC 전용: 기존 그리드(계좌 이미지 + 영상) — 모바일에서 완전 숨김 */}
              <div
                ref={proofSliderRef}
                onScroll={syncProofSliderIndex}
                className="hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible"
              >
                <motion.div
                  className="proof-slide min-h-[320px]"
                  variants={itemVariants}
                >
                  <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="proof-shot-hover relative h-[280px] w-full min-h-[280px] overflow-hidden rounded-lg border border-white/5 px-4">
                      <Image
                        src={PROOF_IMAGE_PATHS.totalAccount}
                        alt="Gate.io account"
                        width={800}
                        height={450}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-400/95">
                        {PROOF_VERIFIED_BADGE}
                      </span>
                    </div>
                    <p className="border-t border-white/10 py-2 text-center text-[10px] font-medium text-cyan-400">
                      {LABEL_REALTIME_VERIFICATION}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="proof-slide min-h-[320px]"
                  variants={itemVariants}
                >
                  <div className="flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
                    <div className="proof-shot-hover relative h-[280px] w-full min-h-[280px] overflow-hidden rounded-lg border border-white/5 px-4">
                      <video
                        src={PROOF_VIDEO_PATH}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-cyan-400/95">
                        {PROOF_VERIFIED_BADGE}
                      </span>
                    </div>
                    <p className="border-t border-white/10 py-2 text-center text-[10px] font-medium text-cyan-400">
                      {LABEL_VIDEO_VERIFICATION}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Portfolio dashboard: table + badges + metrics + risk + chart */}
            <motion.div className="mx-auto mt-12 max-w-7xl space-y-4 md:mt-12 md:space-y-3" variants={containerVariants}>
              <p className="break-keep text-sm text-zinc-400">
                <span className="sm:hidden">{DASHBOARD_INTRO_MOBILE}</span>
                <span className="hidden sm:inline">{DASHBOARD_INTRO}</span>
              </p>

              {/* Trading journal — mobile: Toss-style simple list (COIN|PROFIT|RETURN%); PC lg+: full table */}
              <motion.div variants={itemVariants}>
                {/* Mobile (md 이하): COIN | PROFIT | RETURN% only */}
                <div className="lg:hidden">
                  <p className="mb-3 text-sm font-black text-white">
                    {LIVE_ACCOUNT_VERIFICATION_SUB}
                  </p>
                  <div className="divide-y divide-white/10">
                    {PROOF_TRADES.map((t) => {
                      const ret = `${t.returnPct >= 0 ? "+" : ""}${t.returnPct.toFixed(2)}%`;
                      const profitStr = `${t.profitUsdt >= 0 ? "+" : ""}${t.profitUsdt.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USDT`;
                      return (
                        <div
                          key={t.label}
                          className="flex items-center justify-between gap-2 break-keep py-3 first:pt-0"
                        >
                          <span className="font-black text-white">{t.pair}</span>
                          <span className={`font-mono text-sm font-black ${t.isWin ? "text-cyan-400" : "text-red-500"}`} style={{ fontFamily: "var(--font-mono)" }}>
                            {profitStr}
                          </span>
                          <span className={`font-mono text-sm font-black ${t.isWin ? "text-cyan-400" : "text-red-500"}`} style={{ fontFamily: "var(--font-mono)" }}>
                            {ret}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    {DASHBOARD_TABLE_TITLE}
                  </p>
                </div>
                {/* PC (lg+): full table, 4-decimal Entry/TP/SL preserved — row stagger */}
                <div className="hidden overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-[#0c0c0d] lg:block">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 font-black tracking-tight text-white">
                          <th className="py-3 pl-4 pr-2">Position</th>
                          <th className="py-3 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>Size</th>
                          <th className="py-3 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>Entry</th>
                          <th className="py-3 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>Take Profit</th>
                          <th className="py-3 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>Stop Loss</th>
                          <th className="py-3 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>Exit</th>
                          <th className="py-3 px-2">Result</th>
                          <th className="py-3 px-2 text-right font-mono" style={{ fontFamily: "var(--font-mono)" }}>Gross P&L</th>
                          <th className="py-3 pr-4 pl-2 text-right font-mono" style={{ fontFamily: "var(--font-mono)" }}>Return (%)</th>
                        </tr>
                      </thead>
                      <motion.tbody variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                        {PROOF_TRADES.map((t, i) => {
                          const ret = `${t.returnPct.toFixed(2)}%`;
                          return (
                            <motion.tr
                              key={t.label}
                              variants={itemVariants}
                              className={`border-b border-white/5 ${i === 0 ? "text-white" : "text-zinc-400"}`}
                            >
                              <td className="py-2.5 pl-4 pr-2 font-medium">{t.pair} {t.position}</td>
                              <td className="py-2.5 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>$10,000</td>
                              <td className="py-2.5 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>{formatPrice4(t.entry)}</td>
                              <td className="py-2.5 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>{formatPrice4(t.tp)}</td>
                              <td className="py-2.5 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>{formatPrice4(t.sl)}</td>
                              <td className="py-2.5 px-2 font-mono" style={{ fontFamily: "var(--font-mono)" }}>{formatPrice4(t.exit)}</td>
                              <td className="py-2.5 px-2 font-semibold">{t.isWin ? "PROFIT" : "LOSS"}</td>
                              <td className={`py-2.5 px-2 text-right font-mono font-black ${t.isWin ? "text-cyan-400" : "text-red-500"}`} style={{ fontFamily: "var(--font-mono)" }}>
                                {t.profitUsdt >= 0 ? "+" : ""}{t.profitUsdt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                              </td>
                              <td className={`py-2.5 pr-4 pl-2 text-right font-mono font-black ${t.isWin ? "text-cyan-400" : "text-red-500"}`} style={{ fontFamily: "var(--font-mono)" }}>{ret}</td>
                            </motion.tr>
                          );
                        })}
                      </motion.tbody>
                    </table>
                  </div>
                  <p className="border-t border-white/5 py-2 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    {DASHBOARD_TABLE_TITLE}
                  </p>
                </div>
              </motion.div>

              {/* 2 badges: Win Rate (blue), Cumulative P/L — stagger (PC lg+) */}
              <motion.div className="grid grid-cols-1 gap-4 max-w-md mx-auto sm:grid-cols-2 sm:gap-2" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                <motion.div className="rounded-2xl border border-blue-500/40 bg-blue-950/60 px-4 py-4 text-center sm:shadow-[0_0_20px_rgba(59,130,246,0.2)] order-2 sm:order-1" variants={itemVariants}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white">{BADGE_WIN_RATE}</p>
                  <p className="mt-1 font-mono text-2xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-mono)" }}>75.00%</p>
                </motion.div>
                <motion.div className="glow-num-wrap rounded-2xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-5 text-center sm:shadow-[0_0_20px_rgba(16,185,129,0.2)] order-1 sm:order-2" variants={itemVariants}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-white">{BADGE_CUMULATIVE_PL}</p>
                  <p className="mt-2 font-mono text-5xl font-black tracking-tight text-cyan-400 sm:text-2xl md:text-3xl" style={{ fontFamily: "var(--font-mono)" }}>+${totalProfit.toLocaleString("en-US", { maximumFractionDigits: 0 })}</p>
                </motion.div>
              </motion.div>

              {/* Metrics table | Risk Calculator | Equity Curve — stagger cards (PC lg+) */}
              <motion.div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                {/* Metrics table */}
                <motion.div className="rounded-2xl border border-white/10 border-t-white/20 bg-[#0c0c0d] p-4" variants={itemVariants}>
                  <table className="w-full border-collapse text-xs">
                    <tbody>
                      {[
                        ["Total Trades", "4"],
                        ["Winning Trades", "3"],
                        ["Losing Trades", "1"],
                        ["Win Rate (%)", "75.00%"],
                        ["Total Gross P/L (USD)", totalProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })],
                        ["Total Net P/L (USD)", totalProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })],
                        ["AVG R:R", "1.25"],
                        ["Max Drawdown (USD)", "-2.4%"],
                      ].map(([metric, value]) => (
                        <tr key={metric} className="border-b border-white/5 last:border-0">
                          <td className="py-1.5 text-zinc-400">{metric}</td>
                          <td className="py-1.5 text-right font-mono font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
                {/* Risk Calculator */}
                <motion.div className="rounded-2xl border border-white/10 border-t-white/20 bg-[#0c0c0d] p-4" variants={itemVariants}>
                  <p className="text-sm font-black text-white">{RISK_CALC_TITLE}</p>
                  <p className="mt-1 text-[10px] font-medium text-amber-400/90">{RISK_NOTE}</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{RISK_FUTURE_BALANCE}</span>
                      <span className="font-mono font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>$120,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{RISK_PCT}</span>
                      <span className="font-mono font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>1%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{RISK_POSITION}</span>
                      <span className="font-mono font-semibold text-white" style={{ fontFamily: "var(--font-mono)" }}>$10,000</span>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-white/5 pt-2 text-[10px] font-medium text-zinc-500">{RISK_ACCOUNT_LINE}</p>
                </motion.div>
                {/* Equity Curve chart (cyan) — square plot, timeline 25 Feb–3 Mar = proof period */}
                <motion.div className="rounded-2xl border border-white/10 border-t-white/20 bg-[#0c0c0d] p-4" variants={itemVariants}>
                  <p className="mb-2 text-xs font-black text-white">{EQUITY_CHART_TITLE}</p>
                  <div className="flex justify-center">
                    <div className="aspect-square w-full max-w-[200px] min-h-[180px]">
                      <DashboardEquityChart />
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Highlight badges */}
              <motion.div className="flex flex-wrap items-center justify-center gap-2 pt-1 leading-relaxed md:pt-2" variants={itemVariants}>
                <span className="highlight-box text-sm font-medium">{DASHBOARD_HIGHLIGHT_1}</span>
                <span className="highlight-box text-sm font-medium">{DASHBOARD_HIGHLIGHT_2}</span>
              </motion.div>
            </motion.div>

            {/* Per-trade sets: mobile swipe carousel, desktop grid */}
            <motion.p
              className="mt-8 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400 md:mt-14"
              variants={itemVariants}
            >
              {LABEL_LIVE_TRADING_RESULTS} — per trade
            </motion.p>
            <motion.div
              className="mx-auto mt-6 max-w-6xl md:mt-6"
              variants={galleryStagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {/* 모바일: 무한 부드러운 왼쪽 흐름 */}
              <div className="overflow-hidden lg:hidden">
                <div
                  ref={tradeSliderRef}
                  className="animate-infinite-scroll flex gap-3 pb-2"
                  style={{ width: "max-content" }}
                >
                  {[...PROOF_TRADES, ...PROOF_TRADES].map((trade, idx) => (
                  <motion.div
                    key={`${trade.label}-${idx}`}
                    className="trade-slide min-w-[40vw] flex-shrink-0"
                    variants={galleryItem}
                  >
                    <div className="flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-4 backdrop-blur-xl">
                      <p className="border-b border-white/10 px-1.5 py-1.5 text-center text-[10px] font-black text-cyan-400">
                        {trade.label} · {trade.entryDate}
                      </p>
                      <div className="flex flex-1 items-stretch gap-0">
                        <div className="flex min-w-0 flex-1 flex-col p-2">
                          <p className="border-b border-white/10 bg-black/20 py-1 text-center text-[9px] font-medium text-zinc-400">
                            {LABEL_ENTRY_TIMING}
                          </p>
                          <div className="proof-shot-hover relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-md border border-white/5 px-1">
                            <Image
                              src={trade.chart}
                              alt={`${trade.label} entry`}
                              width={300}
                              height={225}
                              className="h-auto max-h-full w-full max-w-full rounded-lg object-cover"
                            />
                            <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-cyan-400/95">
                              {PROOF_VERIFIED_BADGE}
                            </span>
                          </div>
                        </div>
                        <div
                          className="flex-shrink-0 border-l border-dashed border-white/10 py-4"
                          style={{ width: "1px", minHeight: "40px" }}
                          aria-hidden
                        />
                        <div className="flex min-w-0 flex-1 flex-col p-2">
                          <p className="border-b border-white/10 bg-black/20 py-1 text-center text-[9px] font-medium text-zinc-400">
                            {LABEL_REALTIME_VERIFICATION}
                          </p>
                          <div className="proof-shot-hover relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-md border border-white/5 px-1">
                            <Image
                              src={trade.result}
                              alt={`${trade.label} result`}
                              width={300}
                              height={225}
                              className="h-auto max-h-full w-full max-w-full rounded-lg object-cover"
                            />
                            <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-cyan-400/95">
                              {PROOF_VERIFIED_BADGE}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="glow-num-wrap border-t border-white/10 py-1.5 text-center font-mono text-xs font-black text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>
                        {trade.profitUsdt >= 0 ? "+" : ""}{trade.profitUsdt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                      </p>
                      <div className="mt-auto flex items-center justify-end gap-1 border-t border-white/10 bg-black/20 px-2 py-1">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-green-500" aria-hidden />
                        <span className="text-[7px] font-semibold uppercase tracking-wider text-zinc-400">
                          {MIT_LOGIC_VERIFIED_BADGE}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
              {/* PC: 그리드 (카드 1회만) */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                {PROOF_TRADES.map((trade) => (
                  <motion.div
                    key={trade.label}
                    className="trade-slide flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl lg:min-h-[340px] lg:p-8"
                    variants={galleryItem}
                  >
                    <p className="border-b border-white/10 px-2 py-2 text-center text-xs font-black text-cyan-400">
                      {trade.label} · {trade.entryDate}
                    </p>
                    <div className="flex flex-1 items-stretch gap-0">
                      <div className="flex min-w-0 flex-1 flex-col p-3 lg:p-4">
                        <p className="border-b border-white/10 bg-black/20 py-1.5 text-center text-[10px] font-medium text-zinc-400">
                          {LABEL_ENTRY_TIMING}
                        </p>
                        <div className="proof-shot-hover relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-lg border border-white/5 px-2 lg:px-4">
                          <Image
                            src={trade.chart}
                            alt={`${trade.label} entry`}
                            width={300}
                            height={225}
                            className="h-auto max-h-full w-full max-w-full rounded-lg object-cover"
                          />
                          <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-cyan-400/95">
                            {PROOF_VERIFIED_BADGE}
                          </span>
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 border-l border-dashed border-white/10 py-4"
                        style={{ width: "1px", minHeight: "40px" }}
                        aria-hidden
                      />
                      <div className="flex min-w-0 flex-1 flex-col p-3 lg:p-4">
                        <p className="border-b border-white/10 bg-black/20 py-1.5 text-center text-[10px] font-medium text-zinc-400">
                          {LABEL_REALTIME_VERIFICATION}
                        </p>
                        <div className="proof-shot-hover relative aspect-[4/3] w-full max-w-full overflow-hidden rounded-lg border border-white/5 px-2 lg:px-4">
                          <Image
                            src={trade.result}
                            alt={`${trade.label} result`}
                            width={300}
                            height={225}
                            className="h-auto max-h-full w-full max-w-full rounded-lg object-cover"
                          />
                          <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-cyan-400/95">
                            {PROOF_VERIFIED_BADGE}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="glow-num-wrap border-t border-white/10 py-2 text-center font-mono text-sm font-black text-cyan-400" style={{ fontFamily: "var(--font-mono)" }}>
                      {trade.profitUsdt >= 0 ? "+" : ""}{trade.profitUsdt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                    </p>
                    <div className="mt-auto flex items-center justify-end gap-1.5 border-t border-white/10 bg-black/20 px-3 py-1.5">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-green-500" aria-hidden />
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-400">
                        {MIT_LOGIC_VERIFIED_BADGE}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            </motion.div>
          </motion.section>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* Section 3: MIT LOGIC DEEP-DIVE (R:R 1:1.2, Win Rate 70% philosophy) */}
          <motion.section
            className="px-4 py-14 md:px-8 md:py-20"
            {...sectionReveal}
          >
            <motion.h2
              className="break-keep text-center font-display text-lg font-black uppercase tracking-tighter text-white md:text-xl"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {MIT_LOGIC_SECTION_TITLE}
            </motion.h2>
            {/* 모바일: 한 화면 고정 표 */}
            <div className="mx-auto mt-6 max-w-6xl lg:mt-10 lg:hidden">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2.5 pl-3 pr-2 text-[10px] font-black uppercase tracking-wider text-white">Logika</th>
                      <th className="py-2.5 px-2 text-[10px] font-black uppercase tracking-wider text-white">Nilai</th>
                      <th className="py-2.5 pl-2 pr-3 text-[10px] font-black uppercase tracking-wider text-white">Konsep</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MIT_LOGIC_CARDS.map((card) => (
                      <tr key={card.title} className="border-b border-white/5 last:border-0">
                        <td className="py-2 pl-3 pr-2 text-xs font-black text-white">{card.title}</td>
                        <td className="py-2 px-2">
                          {card.number ? (
                            <span className="highlight-box font-mono text-xs font-black" style={{ fontFamily: "var(--font-mono)" }}>{card.number}</span>
                          ) : null}
                        </td>
                        <td className="py-2 pl-2 pr-3 text-[11px] leading-snug text-zinc-400">
                          {(card as { bodyMobile?: string }).bodyMobile ?? card.body}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* PC: 그리드 (카드 1회만) — stagger */}
            <motion.div
              className="mx-auto mt-8 hidden max-w-6xl lg:mt-10 lg:grid lg:grid-cols-3 lg:gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {MIT_LOGIC_CARDS.map((card) => (
                <motion.div
                  key={card.title}
                  className="logic-slide group relative min-h-[220px] overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30"
                  variants={itemVariants}
                >
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"
                    aria-hidden
                  />
                  <p className="relative break-keep text-xs font-black uppercase tracking-wider text-cyan-400">
                    {card.title}
                  </p>
                  {card.number && (
                    <p className="relative mt-3 font-mono text-3xl font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
                      <span className="highlight-box">{card.number}</span>
                    </p>
                  )}
                  {!card.number && (
                    <p className="relative mt-3 font-mono text-3xl font-black text-white" style={{ fontFamily: "var(--font-mono)" }}>
                      <span className="highlight-box">{card.title}</span>
                    </p>
                  )}
                  <p className="relative mt-4 break-keep text-sm leading-[1.8] text-zinc-400">
                    {card.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* Section 4: ENROLLMENT POLICY (50 slots) */}
          <motion.section
            className="px-4 pb-8 md:px-8 md:pb-12"
            {...sectionReveal}
          >
            <motion.div
              className="mx-auto max-w-lg rounded-2xl border border-cyan-500/30 border-t border-t-white/20 bg-zinc-950 px-4 py-5 text-center md:px-8 md:py-10"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              <p className="break-keep text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {POLICY_TITLE}
              </p>
              <p className="glow-num-wrap break-keep mt-3 text-2xl font-black tracking-tight text-cyan-400 md:mt-4 md:text-3xl" style={{ fontFamily: "var(--font-mono)" }}>
                {POLICY_QUOTA}
              </p>
              <p className="break-keep mt-3 text-sm leading-[1.8] text-zinc-400 md:mt-4">
                <span className="sm:hidden">{POLICY_DESC_MOBILE}</span>
                <span className="hidden sm:inline">Pendaftaran akan ditutup otomatis segera setelah 50 orang terpenuhi. Ini adalah standar eksklusivitas MIT.</span>
              </p>
            </motion.div>
          </motion.section>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* Section 5: CLOSING STORY (seed $50 philosophy + CTA) */}
          <motion.section
            className="relative px-4 py-14 md:px-8 md:py-24"
            {...sectionReveal}
          >
            <div
              className="absolute inset-0 -z-10 hidden opacity-40 sm:block"
              style={{
                background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(6,182,212,0.15) 0%, transparent 60%)",
              }}
              aria-hidden
            />
            <motion.div
              className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 border-t-white/20 bg-black/40 p-5 backdrop-blur-xl md:p-10"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              <div
                className="pointer-events-none absolute -top-20 left-1/2 hidden h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[80px] sm:block"
                aria-hidden
              />
              <h2 className="relative break-keep font-display text-xl font-black leading-snug tracking-tighter text-white md:text-2xl">
                Anda gagal bukan karena modal kecil.
                <br className="hidden sm:block" />
                Tapi karena Anda TIDAK PUNYA PRINSIP.
              </h2>
              <p className="relative mt-4 break-keep text-zinc-400 leading-relaxed md:mt-6 md:text-lg md:leading-[1.8]">
                Kami membentuk ulang habit trading Anda dengan $50.
                <br className="hidden sm:block" />
                Jika target double-up tidak tercapai, Anda akan mendapatkan akses otomatis ke <span className="highlight-box">Batch berikutnya</span> secara <span className="highlight-box">GRATIS</span>.
              </p>
              <p className="relative mt-4 break-keep font-black text-cyan-400 leading-[1.8] md:mt-6 md:text-lg">
                Inilah Standar MIT: Kami tidak memberikan janji, kami memberikan hasil dan keberlanjutan.
              </p>
            </motion.div>
          </motion.section>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* CTA main bottom — full width on mobile */}
          <motion.section
            id="cta-block"
            className="relative px-4 py-14 md:px-8 md:py-32"
            {...sectionReveal}
          >
            <div className="relative mx-auto w-full max-w-full text-center sm:max-w-[300px]">
              <motion.button
                type="button"
                onClick={go}
                className={CTA_BUTTON_CLASS}
              >
                <span className="cta-shimmer" aria-hidden />
                <span className="relative z-10">{CTA_BUTTON}</span>
              </motion.button>
              <p className="mt-4 whitespace-nowrap text-sm leading-[1.8] text-zinc-400">
                Sesuai Standar MIT — Kuota Terbatas 50 Orang.
              </p>
            </div>
          </motion.section>
        </main>

        {/* Scan ritual: laser + step text then redirect */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="relative z-10 text-center text-sm font-medium text-white md:text-base">
                {scanPhase === 0 ? SCAN_PHASE_1 : SCAN_PHASE_2}
              </p>
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute left-0 right-0 h-1 rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  style={{
                    boxShadow: "0 0 24px rgba(6,182,212,0.9), 0 0 48px rgba(6,182,212,0.5)",
                  }}
                  initial={{ top: "0%" }}
                  animate={{
                    top: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Dashboard: cumulative profit, $0 at bottom; timeline = proof period 25 Feb–3 Mar; square plot, filled interior */
function DashboardEquityChart() {
  const total = getTotalProfitUsdt();
  const points = [0, 3151.73, 3151.73 + 5305.24, 3151.73 + 5305.24 + 9012.52, total];
  const minY = 0;
  const maxY = Math.max(...points, 1);
  const range = maxY - minY;
  const size = 100;
  const pad = { left: 20, right: 8, top: 12, bottom: 18 };
  const plotW = size - pad.left - pad.right;
  const plotH = size - pad.top - pad.bottom;
  const coords = points.map((p, i) => {
    const x = pad.left + (i / (points.length - 1)) * plotW;
    const norm = range ? (p - minY) / range : 0;
    const y = pad.top + (1 - norm) * plotH;
    return { x, y };
  });
  const pathD = coords.map((p) => `${p.x},${p.y}`).join(" L ");
  const areaPath = `M ${pathD} L ${pad.left + plotW},${pad.top + plotH} L ${pad.left},${pad.top + plotH} Z`;
  const yTickValues = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];
  const dateLabels = ["25/02", "26/02", "27/02", "28/02", "03/03"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="dashEqGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.45" />
        </linearGradient>
        <filter id="eqLineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feFlood floodColor="#06b6d4" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {yTickValues.map((v, i) => {
        const y = pad.top + (1 - v / maxY) * plotH + 2;
        const label = v >= 0 ? `$${Math.round(v).toLocaleString()}` : `-$${Math.round(-v).toLocaleString()}`;
        return (
          <text key={label + i} x={2} y={y} className="fill-white/50 font-mono text-[5px]" style={{ fontFamily: "var(--font-mono)" }}>{label}</text>
        );
      })}
      {[0.25, 0.5, 0.75].map((q) => (
        <line key={q} x1={pad.left} y1={pad.top + (1 - q) * plotH} x2={pad.left + plotW} y2={pad.top + (1 - q) * plotH} stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
      ))}
      {dateLabels.map((d, i) => {
        const x = pad.left + (i / (dateLabels.length - 1)) * plotW;
        return (
          <text key={d} x={x} y={size - 5} className="fill-white/50 font-mono text-[5px]" style={{ fontFamily: "var(--font-mono)" }} textAnchor="middle">{d}</text>
        );
      })}
      <path d={areaPath} fill="url(#dashEqGrad)" />
      <path d={`M ${pathD}`} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#eqLineGlow)" />
    </svg>
  );
}

function EquityCurveSVG() {
  const total = getTotalProfitUsdt();
  const points = [0, 3151.73, 3151.73 + 5305.24, 3151.73 + 5305.24 + 9012.52, total];
  const maxP = Math.max(...points, 1);
  const pathD = points
    .map((p, i) => {
      const x = 10 + (i / (points.length - 1)) * 80;
      const y = 90 - (p / maxP) * 70;
      return `${x},${y}`;
    })
    .join(" L ");
  return (
    <svg viewBox="0 0 100 100" className="h-36 w-full md:h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.35" />
        </linearGradient>
        <filter id="eqGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feFlood floodColor="#06b6d4" floodOpacity="0.8" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={`M ${pathD} L 90,100 L 10,100 Z`} fill="url(#eqGrad)" />
      <path
        d={`M ${pathD}`}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#eqGlow)"
      />
    </svg>
  );
}

function WinRateDial({ percent }: { percent: number }) {
  const r = 40;
  const cx = 50;
  const cy = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const angleDeg = -90 + (percent / 100) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const dotX = cx + r * Math.cos(angleRad);
  const dotY = cy + r * Math.sin(angleRad);
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 md:h-28 md:w-28" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="dialGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00f2ff" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="dialDotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feFlood floodColor="#00f2ff" floodOpacity="0.9" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#dialGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <circle cx={dotX} cy={dotY} r={4} fill="#00f2ff" filter="url(#dialDotGlow)" className="dial-dot-glow" />
    </svg>
  );
}

function BeforeGraphSVG() {
  const d = "M 0,60 L 15,70 L 30,45 L 45,80 L 60,35 L 75,65 L 100,50";
  return (
    <svg viewBox="0 0 100 100" className="mt-4 h-28 w-full opacity-70" preserveAspectRatio="none">
      <path d={d} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AfterGraphSVG() {
  const d = "M 0,85 Q 25,75 50,50 T 100,15";
  return (
    <svg viewBox="0 0 100 100" className="mt-4 h-28 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="afterGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#00f2ff" stopOpacity="0" />
          <stop offset="100%" stopColor="#00f2ff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d={`${d} L 100,100 L 0,100 Z`} fill="url(#afterGrad)" />
      <path d={d} fill="none" stroke="#00f2ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
