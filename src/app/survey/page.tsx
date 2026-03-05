"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackFunnelStage } from "@/lib/funnel";

const OBSIDIAN = "#0a0a0b";
const SHARP_WHITE = "#fafafa";
const CYAN_GLOW = "rgba(6, 182, 212, 0.4)";
const SCAN_DURATION_MS = 2000;

type Question = {
  id: number;
  question: string;
  options: { text: string; isRedAlert: boolean }[];
};

const SURVEY: Question[] = [
  {
    id: 1,
    question:
      "Sudah baca ratusan buku & video trading, tapi kenapa akun Anda masih MC (Margin Call)?",
    options: [
      {
        text: "Karena saya terus mencari 'Teknik Rahasia' yang tidak ada.",
        isRedAlert: false,
      },
      {
        text: "Karena saya pikir saya sudah pintar, tapi market tidak peduli.",
        isRedAlert: false,
      },
      {
        text: "Saya butuh Pengetahuan, bukan Prinsip.",
        isRedAlert: true,
      },
    ],
  },
  {
    id: 2,
    question:
      "Pengetahuan TIDAK menjamin BUKTI SALDO (Account Proof). Setuju?",
    options: [
      {
        text: "Setuju. Selama ini saya hanya 'Kolektor Teori' yang merugi.",
        isRedAlert: false,
      },
      {
        text: "Tidak, saya hanya kurang satu indicator lagi.",
        isRedAlert: true,
      },
    ],
  },
  {
    id: 3,
    question:
      "Saat Floating Loss, apakah emosi Anda membunuh Logic MIT Anda?",
    options: [
      {
        text: "Ya, saya sering trading emosional dan hancur.",
        isRedAlert: false,
      },
      {
        text: "Saya butuh Sistem yang memaksa saya Disiplin.",
        isRedAlert: false,
      },
    ],
  },
  {
    id: 4,
    question:
      "Batch 1 hanya dibuktikan dengan real-account. Mau mulai $50 challenge dengan konsep MIT—trading sesuai probabilitas?",
    options: [
      {
        text: "SIAP. Deposit $50 adalah komitmen minimal saya untuk prinsip.",
        isRedAlert: false,
      },
      {
        text: "Saya hanya ingin menonton challenge saja.",
        isRedAlert: true,
      },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

type SuccessPhase = "idle" | "scanning" | "granted";

const SURVEY_STAGES: ("survey_q1" | "survey_q2" | "survey_q3" | "survey_q4")[] = ["survey_q1", "survey_q2", "survey_q3", "survey_q4"];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [mindsetError, setMindsetError] = useState(false);
  const [successPhase, setSuccessPhase] = useState<SuccessPhase>("idle");
  const trackedSteps = useRef<Set<number>>(new Set());

  const q = SURVEY[step];
  const isLastStep = step === SURVEY.length - 1;
  const showQuestions = successPhase === "idle";

  useEffect(() => {
    if (successPhase !== "scanning") return;
    const t = setTimeout(() => setSuccessPhase("granted"), SCAN_DURATION_MS);
    return () => clearTimeout(t);
  }, [successPhase]);

  useEffect(() => {
    if (successPhase !== "idle" || step < 0 || step > 3) return;
    if (trackedSteps.current.has(step)) return;
    trackedSteps.current.add(step);
    trackFunnelStage(SURVEY_STAGES[step]);
  }, [step, successPhase]);

  const handleSelect = useCallback(
    (opt: { text: string; isRedAlert: boolean }) => {
      if (opt.isRedAlert) {
        setMindsetError(true);
        setTimeout(() => setMindsetError(false), 1400);
        return;
      }
      if (isLastStep) {
        setSuccessPhase("scanning");
        return;
      }
      setStep((s) => s + 1);
    },
    [isLastStep]
  );

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans"
      style={{ background: OBSIDIAN, color: SHARP_WHITE }}
    >
      {/* Mindset Error: screen flashes red + brief warning */}
      <AnimatePresence>
        {mindsetError && (
          <motion.div
            key="mindset-error"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              className="absolute inset-0 bg-red-950/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.9, 0.5, 0.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            />
            <motion.p
              className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.25em] text-red-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.08, duration: 0.2 }}
            >
              Mindset Error
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanning Mindset... (2s ritual) */}
      <AnimatePresence>
        {successPhase === "scanning" && (
          <motion.div
            key="scanning"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#0a0a0b]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
              animate={{ scaleX: [0.5, 1.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.p
              className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Scanning Mindset...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Progress — hide when scanning or granted */}
        {showQuestions && (
          <div className="mb-12 flex gap-1">
            {SURVEY.map((_, i) => (
              <div
                key={i}
                className="h-0.5 flex-1 rounded-full transition-colors duration-300"
                style={{
                  background: i <= step ? "rgba(250,250,250,0.4)" : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {successPhase === "granted" ? (
            <motion.div
              key="granted"
              className="relative min-h-[60vh] flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Authority background: subtle scan/fingerprint feel */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, ${CYAN_GLOW} 0%, transparent 50%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L30 55 M5 30 L55 30 M15 15 L45 45 M45 15 L15 45' stroke='%23fff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
                }}
              />
              {/* Cyan radial burst */}
              <motion.div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div
                  className="h-[80vmax] w-[80vmax] rounded-full"
                  style={{
                    background: `radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(6,182,212,0.08) 30%, transparent 60%)`,
                  }}
                />
              </motion.div>

              <motion.p
                className="relative font-mono text-sm font-bold uppercase tracking-[0.35em] text-cyan-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Access Granted
              </motion.p>
              <motion.h1
                className="relative mt-6 max-w-xl font-display text-2xl font-black leading-tight tracking-tight text-white md:text-3xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                ANDA LOLOS: Standar Mindset MIT Terkonfirmasi.
              </motion.h1>
              <motion.p
                className="relative mt-4 text-sm leading-relaxed text-white/80 md:text-base"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Anda terpilih untuk bergabung dalam Batch 1. Amankan slot Anda sekarang.
              </motion.p>

              <motion.div
                className="relative mt-12 w-full max-w-full px-0 sm:max-w-md"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <a
                  href="/onboarding"
                  className="block w-full min-h-[48px] rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] no-underline sm:py-4"
                >
                  Lanjutkan ke Onboarding & Amankan Slot (Step 1/5)
                </a>
              </motion.div>
            </motion.div>
          ) : showQuestions ? (
            <motion.div
              key={q.id}
              variants={container}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -12, transition: { duration: 0.25 } }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-10"
            >
              <motion.h2
                variants={item}
                className="text-lg font-semibold leading-snug text-white md:text-xl"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {q.question}
              </motion.h2>
              <ul className="space-y-3">
                {q.options.map((opt, i) => (
                  <motion.li key={i} variants={item}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className="w-full min-h-[48px] rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-left text-sm leading-snug text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-white/20"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {opt.text}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
