"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { trackFunnelStage } from "@/lib/funnel";

const OBSIDIAN = "#0a0a0b";
const STORAGE_KEY = "mit-onboarding";
const GATE_REFERRAL_URL = "https://www.gate.com/share/MITTRADE";
const DISCORD_LINK = process.env.NEXT_PUBLIC_DISCORD_LINK || "#";
const MASTER_DM_LINK = "https://discordapp.com/users/364799578291306496";

function loadStored(): { phaseIndex: number; uid: string } {
  if (typeof window === "undefined") return { phaseIndex: 0, uid: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { phaseIndex: 0, uid: "" };
    const data = JSON.parse(raw) as { phaseIndex?: number; uid?: string };
    const phaseIndex = Math.min(Math.max(Number(data.phaseIndex) || 0, 0), 4);
    return { phaseIndex, uid: typeof data.uid === "string" ? data.uid : "" };
  } catch {
    return { phaseIndex: 0, uid: "" };
  }
}

function saveStored(phaseIndex: number, uid: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ phaseIndex, uid }));
  } catch {}
}

function clearStored() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

type PhaseConfig = {
  step: number;
  title: string;
  sub: string;
  body: string;
  steps?: string[];
  /** KYC 3-step guide (show when "Cara menyelesaikan KYC" clicked) */
  kycGuideSteps?: string[];
  cta: { label: string; href: string | null; action?: string; external?: boolean } | null;
  ctaSecondary?: string;
};

const KYC_GUIDE_3_STEPS = [
  "Login Gate.io → Profil → Verifikasi Identitas.",
  "Pilih dokumen (KTP/Paspor), unggah foto jelas. Nama dan wajah harus terbaca.",
  "Selfie sesuai petunjuk. Tunggu verifikasi (1–24 jam). Setelah disetujui, hubungkan UID.",
];

/** Sama seperti TetherGet: modal panduan KYC (gambar + deskripsi). Salin gambar ke public/guide/. */
type KycStepWithImage = { label: string; img?: string; imgs?: string[]; desc?: string };

/** Placeholder saat gambar gagal load (file tidak ada di public/guide/). */
function GuideImage({
  src,
  alt,
  className,
  minHeight = "min-h-[260px] sm:min-h-[320px]",
}: {
  src: string;
  alt: string;
  className?: string;
  minHeight?: string;
}) {
  const [failed, setFailed] = useState(false);
  const fileName = src.split("/").pop() || src;
  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded-lg bg-white/[0.06] text-center ${minHeight} ${className ?? ""}`}
        title="Unggah gambar ke public/guide/"
      >
        <span className="text-xs text-white/50">Gambar: {fileName}</span>
        <span className="text-[10px] text-white/40">Unggah ke public/guide/</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
const GATEIO_KYC_STEPS_WITH_IMAGES: KycStepWithImage[] = [
  { label: "Memulai Verifikasi → Pusat Verifikasi → Pilih Kewarganegaraan", img: "/guide/gateio-kyc-1.png", imgs: ["/guide/gateio-kyc-1.png", "/guide/gateio-kyc-2.png", "/guide/gateio-kyc-3.png"], desc: "1) Buka Gate.io → [User Center] → [KYC].\n2) Klik [Verify Now] (Standard Identity Verification).\n3) Pilih Indonesia, Residence & Nationality; pilih ID Card (KTP)." },
  { label: "Instruksi Foto KTP → Konfirmasi → Verifikasi Alamat", img: "/guide/gateio-kyc-4.png", imgs: ["/guide/gateio-kyc-4.png", "/guide/gateio-kyc-5.png", "/guide/gateio-kyc-6.png"], desc: "1) Siapkan KTP; foto jelas, tidak buram/terpotong/glare.\n2) Cek Nama & NIK terdeteksi; klik [Next].\n3) Isi alamat lengkap (Provinsi, Kota, Kode Pos) untuk naik limit." },
  { label: "Verifikasi Selesai", img: "/guide/gateio-kyc-7.png", imgs: ["/guide/gateio-kyc-7.png"], desc: "Setelah [Verified], Deposit, Trading, dan P2P otomatis terbuka." },
];

/** Sama seperti TetherGet: modal panduan P2P IDR (gambar + deskripsi). */
const GATEIO_P2P_STEPS_WITH_IMAGES: KycStepWithImage[] = [
  { label: "Buka app → P2P → Tab Buy", img: "/guide/gateio-p2p-1.png", imgs: ["/guide/gateio-p2p-1.png", "/guide/gateio-p2p-2.png", "/guide/gateio-p2p-3.png"], desc: "1) Buka Gate.io → ikon profil.\n2) [P2P] di Popular.\n3) Tab [Buy]." },
  { label: "USDT → IDR → Pilih merchant", img: "/guide/gateio-p2p-4.png", imgs: ["/guide/gateio-p2p-4.png", "/guide/gateio-p2p-5.png", "/guide/gateio-p2p-6.png"], desc: "4) Pilih USDT.\n5) Mata uang IDR.\n6) Pilih merchant rating terbaik." },
  { label: "Buy → Jumlah Rupiah → Filter Amount", img: "/guide/gateio-p2p-7.png", imgs: ["/guide/gateio-p2p-7.png", "/guide/gateio-p2p-8.png", "/guide/gateio-p2p-9.png"], desc: "7) [Buy] di samping nama penjual.\n8) Masukkan nominal Rupiah.\n9) Filter [Amount] untuk budget." },
  { label: "Confirm → Pay Now → I have paid", img: "/guide/gateio-p2p-10.png", imgs: ["/guide/gateio-p2p-10.png", "/guide/gateio-p2p-11.png", "/guide/gateio-p2p-12.png"], desc: "10) Nominal → [Confirm].\n11) Cek detail → [Pay Now].\n12) Transfer → [I have paid]." },
  { label: "Transaksi selesai", img: "/guide/gateio-p2p-13.png", desc: "USDT masuk ke akun." },
];

const PHASES: PhaseConfig[] = [
  {
    step: 1,
    title: "Selamat! Anda adalah 1 dari 50 orang yang terpilih.",
    sub: "Phase 1: Konfirmasi & rasa memiliki.",
    body: "Anda telah lolos standar mindset MIT. Slot Batch 1 Anda sedang menunggu.",
    cta: null,
  },
  {
    step: 2,
    title: "Step 2: Buka akun melalui link eksklusif MIT.",
    sub: "Phase 2: Gate.io — awal pencairan.",
    body: "Daftar akun real Anda lewat referral resmi MIT. Langkah pertama menuju real-account proof.",
    steps: [
      "Klik tombol bawah (Link Eksklusif MIT → Gate.com).",
      "Daftar email & sandi. Pakai link ini agar UID terhubung referral MIT.",
      "Verifikasi email; selesaikan KYC (tombol 'Cara menyelesaikan KYC' di bawah).",
      "Setelah KYC disetujui, lanjut Verifikasi UID (Step 3).",
    ],
    kycGuideSteps: KYC_GUIDE_3_STEPS,
    cta: { label: "Buka Gate.io (Link Eksklusif MIT)", href: GATE_REFERRAL_URL, external: true },
    ctaSecondary: "Saya sudah daftar, lanjut ke Verifikasi UID\n(Step 3)",
  },
  {
    step: 3,
    title: "Step 3: Input UID Anda.",
    sub: "Phase 3: UID Verification (Lock-in).",
    body: "Masukkan User ID Gate.io di bawah. Hanya UID yang daftar lewat link referral MIT yang lolos.",
    steps: [
      "Login Gate.io (gate.com) → Profil → Akun → User ID. Salin UID.",
      "Tempel UID di kolom bawah, klik Verifikasi. Sistem cek referral MIT.",
    ],
    kycGuideSteps: KYC_GUIDE_3_STEPS,
    cta: { label: "Verifikasi UID", href: null, action: "verify" },
  },
  {
    step: 4,
    title: "Step 4: Deposit & Wallet Setup.",
    sub: "Phase 4: Deposit (P2P / transfer kripto).",
    body: "Setor minimal $50. Tanpa deposit real, challenge tidak dimulai. Centang checklist lalu lanjut.",
    steps: undefined,
    cta: { label: "Saya Sudah Deposit, Lanjut", href: null, action: "next" },
  },
  {
    step: 5,
    title: "Step 5: Access Granted & Report.",
    sub: "Phase 5: Final reward — Discord Premium.",
    body: "Selamat! Anda resmi masuk komunitas premium. Signal, panduan, dan dukungan real-time siap untuk Anda.",
    steps: [
      "Salin pesan di bawah, lalu buka DM Master MIT_ZUN dan tempel (Ctrl+V) lalu kirim.",
      "Belum dapat invite server? Pastikan UID terverifikasi dan deposit masuk; admin kirim link.",
    ],
    cta: { label: "", href: null, external: false },
  },
];

export default function OnboardingPage() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [uid, setUid] = useState("");
  const [uidStatus, setUidStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [uidError, setUidError] = useState("");
  const finalDmTracked = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [showKycGuide, setShowKycGuide] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  const [showP2pModal, setShowP2pModal] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [masterToast, setMasterToast] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [showResetLink, setShowResetLink] = useState(false);
  const [depositCheck1, setDepositCheck1] = useState(false);
  const [depositCheck2, setDepositCheck2] = useState(false);
  const [depositCheck3, setDepositCheck3] = useState(false);
  useEffect(() => {
    const { phaseIndex: savedPhase, uid: savedUid } = loadStored();
    setPhaseIndex(savedPhase);
    setUid(savedUid);
    setMounted(true);
    const isInternal =
      typeof window !== "undefined" &&
      (process.env.NODE_ENV === "development" || /[?&]internal=1/.test(window.location.search));
    setShowResetLink(!!isInternal);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveStored(phaseIndex, uid);
  }, [mounted, phaseIndex, uid]);

  useEffect(() => {
    setShowKycGuide(false);
    setShowKycModal(false);
    setShowP2pModal(false);
    setZoomedImage(null);
  }, [phaseIndex]);

  useEffect(() => {
    if (!mounted || phaseIndex !== 4) return;
    const burst = () => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } }), 150);
      setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } }), 300);
    };
    burst();
    const t = setTimeout(burst, 800);
    return () => clearTimeout(t);
  }, [mounted, phaseIndex]);

  useEffect(() => {
    if (mounted && phaseIndex === 4 && !finalDmTracked.current) {
      finalDmTracked.current = true;
      trackFunnelStage("final_dm", uid || undefined);
    }
  }, [mounted, phaseIndex, uid]);

  const phase = PHASES[phaseIndex];

  const goNext = useCallback(() => {
    setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1));
  }, []);

  const handleResetProgress = useCallback(() => {
    clearStored();
    setPhaseIndex(0);
    setUid("");
  }, []);

  const handleMasterDmClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMasterToast(true);
    window.open(MASTER_DM_LINK, "_blank", "noopener,noreferrer");
    setTimeout(() => setMasterToast(false), 2500);
  }, []);

  const dmMessage = uid ? `Registrasi Selesai\nUID: ${uid}` : "Registrasi Selesai";
  const handleCopyDmMessage = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(dmMessage);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      setCopyToast(false);
    }
  }, [dmMessage]);

  const handleVerifyUid = async () => {
    const raw = uid.replace(/\s+/g, "").trim();
    if (!raw) {
      setUidError("Masukkan UID Gate.io Anda.");
      setUidStatus("error");
      return;
    }
    setUidStatus("loading");
    setUidError("");
    try {
      const res = await fetch(`/api/gateio/verify?uid=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (data.ok) {
        trackFunnelStage("uid_input", raw);
        setUidStatus("success");
        setTimeout(() => {
          goNext();
          setUidStatus("idle");
          setUidError("");
        }, 800);
      } else {
        setUidError(data.error || "UID belum terdaftar di referral MIT.");
        setUidStatus("error");
      }
    } catch {
      setUidError("Verifikasi gagal. Coba lagi.");
      setUidStatus("error");
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center font-sans" style={{ background: OBSIDIAN, color: "#fafafa" }}>
        <p className="text-sm text-white/50">Memuat...</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-sans"
      style={{ background: OBSIDIAN, color: "#fafafa" }}
    >
      {/* Badge progres — kanan atas */}
      <motion.div
        className="fixed right-4 top-4 z-20 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-sm"
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-mono text-xs font-medium text-cyan-400/90">
          Step {phaseIndex + 1}/5
        </p>
        {phaseIndex > 0 && (
          <p className="mt-0.5 text-[10px] text-white/50">
            Step 1–{phaseIndex} completed
          </p>
        )}
      </motion.div>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 md:py-24 pt-14">
        <div className="mb-12 flex gap-1">
          {PHASES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPhaseIndex(i)}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                background: i <= phaseIndex ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)",
              }}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase.step}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/80">
              Step {phase.step}/5
            </p>
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
              {phase.title}
            </h1>
            <p className="text-sm text-white/50">{phase.sub}</p>
            <p className="text-sm leading-relaxed text-white/80 md:text-base">
              {phase.body}
            </p>

            {phase.steps && phase.steps.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Langkah-langkah
                </p>
                <ol className="list-decimal space-y-2 pl-4 text-sm text-white/80">
                  {phase.steps.map((s, i) => (
                    <li key={i} className="pl-1">{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {phase.step === 4 && (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/60">
                  Checklist
                </p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={depositCheck1}
                    onChange={(e) => setDepositCheck1(e.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white">Deposit $50 USDT (Gate.io)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={depositCheck2}
                    onChange={(e) => setDepositCheck2(e.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white">Transfer to Futures Account</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={depositCheck3}
                    onChange={(e) => setDepositCheck3(e.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white">Ready for Trading</span>
                </label>
              </div>
            )}

            {phase.kycGuideSteps && phase.kycGuideSteps.length > 0 && (
              <button
                type="button"
                onClick={() => setShowKycModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <span className="text-cyan-400">Cara menyelesaikan KYC</span>
              </button>
            )}

            {/* Modal panduan KYC: gambar + deskripsi saat tombol diklik */}
            <AnimatePresence>
              {showKycModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { setShowKycModal(false); setZoomedImage(null); }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    aria-hidden
                  />
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowKycModal(false); setZoomedImage(null); } }}
                    aria-label="Klik di luar untuk menutup"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl cursor-default max-w-5xl"
                    >
                      <h2 className="text-xl font-bold text-white mb-1">
                        Panduan KYC - Gate.io
                      </h2>
                      <p className="text-sm text-white/60 mb-2">How-to: langkah demi langkah verifikasi identitas. Gambar diperbesar agar teks di layar terbaca.</p>
                      <p className="text-xs text-white/45 mb-2 flex items-center gap-1.5">
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-white/30 flex items-center justify-center text-[10px]">↓</span>
                        Geser ke bawah untuk melihat semua langkah
                      </p>
                      <p className="text-[10px] text-amber-400/80 mb-6">
                        Jika gambar tidak muncul: unggah gateio-kyc-1.png ~ gateio-kyc-7.png ke folder <code className="bg-white/10 px-1 rounded">public/guide/</code>.
                      </p>
                      <div className="grid gap-6 grid-cols-1">
                        {GATEIO_KYC_STEPS_WITH_IMAGES.map((step, i) => (
                          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Langkah {i + 1}: {step.label}</p>
                              {step.desc && (
                                <div className="text-sm text-white/80 mt-2 leading-relaxed space-y-1">
                                  {String(step.desc).split("\n").filter(Boolean).map((line, j) => (
                                    <p key={j}>{line}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                            {step.imgs && step.imgs.length > 0 ? (
                              <>
                                <div className="relative rounded-b-xl overflow-hidden bg-zinc-900/80 p-3">
                                  <div className={`grid min-h-[280px] gap-2 sm:gap-3 ${step.imgs.length >= 3 ? "grid-cols-3" : step.imgs.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                                    {step.imgs.map((imgPath, imgIdx) => (
                                      <button
                                        key={imgPath}
                                        type="button"
                                        onClick={() => setZoomedImage(imgPath)}
                                        className="flex items-center justify-center overflow-hidden rounded-lg bg-white/[0.02] min-h-[260px] sm:min-h-[320px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                                      >
                                        <GuideImage
                                          src={imgPath}
                                          alt={`${step.label} — ${imgIdx + 1}/${step.imgs!.length}`}
                                          className="w-full h-full max-h-[320px] sm:max-h-[400px] object-contain object-center"
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <span className="block text-center text-xs text-white/50 py-2 bg-white/[0.02]">Klik gambar untuk memperbesar</span>
                              </>
                            ) : step.img ? (
                              <button
                                type="button"
                                onClick={() => setZoomedImage(step.img ?? null)}
                                className="block w-full text-left rounded-b-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                              >
                                <div className="bg-zinc-900/80 flex items-center justify-center">
                                  <GuideImage
                                    src={step.img}
                                    alt={step.label}
                                    className="w-full max-w-full object-contain bg-zinc-900/80 object-top"
                                    minHeight="min-h-[420px]"
                                  />
                                </div>
                                <span className="block text-center text-xs text-white/50 py-2 bg-white/[0.02]">Klik gambar untuk memperbesar</span>
                              </button>
                            ) : (
                              <div className="min-h-[200px] rounded-b-xl bg-white/5 flex items-center justify-center text-white/40 text-sm">[Gambar]</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShowKycModal(false); setZoomedImage(null); }}
                        className="mt-6 w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
                      >
                        Tutup
                      </button>
                    </motion.div>
                  </div>

                  {/* Lightbox perbesaran gambar */}
                  <AnimatePresence>
                    {zoomedImage && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                          onClick={() => setZoomedImage(null)}
                          role="button"
                          aria-label="Klik di luar untuk menutup"
                        >
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-[95vw] max-h-[90vh] flex flex-col items-center cursor-default"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GuideImage
                              src={zoomedImage}
                              alt="Zoom"
                              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                              minHeight="min-h-[200px]"
                            />
                            <p className="text-xs text-white/50 mt-2">Klik di luar untuk menutup</p>
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </AnimatePresence>

            {phase.step === 4 && (
              <button
                type="button"
                onClick={() => setShowP2pModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <span className="text-cyan-400">Panduan P2P IDR</span>
              </button>
            )}

            {/* Modal panduan P2P IDR: gambar + deskripsi saat diklik */}
            <AnimatePresence>
              {showP2pModal && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => { setShowP2pModal(false); setZoomedImage(null); }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    aria-hidden
                  />
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto cursor-pointer"
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowP2pModal(false); setZoomedImage(null); } }}
                    aria-label="Klik di luar untuk menutup"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={(e) => e.stopPropagation()}
                      className="relative w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl cursor-default max-w-5xl"
                    >
                      <h2 className="text-xl font-bold text-white mb-1">
                        Panduan P2P IDR - Gate.io
                      </h2>
                      <p className="text-sm text-white/60 mb-6">Cara beli USDT dengan Rupiah via P2P. Klik gambar untuk memperbesar.</p>
                      <div className="grid gap-6 grid-cols-1">
                        {GATEIO_P2P_STEPS_WITH_IMAGES.map((step, i) => (
                          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                            <div className="px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Langkah {i + 1}: {step.label}</p>
                              {step.desc && (
                                <div className="text-sm text-white/80 mt-2 leading-relaxed space-y-1">
                                  {String(step.desc).split("\n").filter(Boolean).map((line, j) => (
                                    <p key={j}>{line}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                            {step.imgs && step.imgs.length > 0 ? (
                              <>
                                <div className="flex gap-0 min-h-[280px] sm:min-h-[360px] rounded-b-xl overflow-hidden bg-zinc-900/80">
                                  {step.imgs.map((imgPath) => (
                                    <button
                                      key={imgPath}
                                      type="button"
                                      onClick={() => setZoomedImage(imgPath)}
                                      className="flex-1 min-w-0 flex items-stretch justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                                    >
                                      <GuideImage
                                        src={imgPath}
                                        alt={step.label ?? `Step ${i + 1}`}
                                        className="w-full h-full min-h-[280px] sm:min-h-[360px] object-cover"
                                        minHeight="min-h-[280px] sm:min-h-[360px]"
                                      />
                                    </button>
                                  ))}
                                </div>
                                <span className="block text-center text-xs text-white/50 py-2 bg-white/[0.02]">Klik gambar untuk memperbesar</span>
                              </>
                            ) : step.img ? (
                              <button
                                type="button"
                                onClick={() => setZoomedImage(step.img ?? null)}
                                className="block w-full rounded-b-xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
                              >
                                <div className="flex min-h-[280px] sm:min-h-[360px] items-center justify-center overflow-hidden bg-zinc-900/80">
                                  <GuideImage
                                    src={step.img}
                                    alt={step.label}
                                    className="max-h-[280px] sm:max-h-[360px] w-auto max-w-full object-contain object-center"
                                    minHeight="min-h-[200px]"
                                  />
                                </div>
                                <span className="block text-center text-xs text-white/50 py-2 bg-white/[0.02]">Klik gambar untuk memperbesar</span>
                              </button>
                            ) : (
                              <div className="min-h-[200px] rounded-b-xl bg-white/5 flex items-center justify-center text-white/40 text-sm">[Gambar]</div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setShowP2pModal(false); setZoomedImage(null); }}
                        className="mt-6 w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
                      >
                        Tutup
                      </button>
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {zoomedImage && (
                      <>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                          onClick={() => setZoomedImage(null)}
                          role="button"
                          aria-label="Klik di luar untuk menutup"
                        >
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="max-w-[95vw] max-h-[90vh] flex flex-col items-center cursor-default"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <GuideImage
                              src={zoomedImage}
                              alt="Zoom"
                              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                              minHeight="min-h-[200px]"
                            />
                            <p className="text-xs text-white/50 mt-2">Klik di luar untuk menutup</p>
                          </motion.div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              )}
            </AnimatePresence>

            {phase.step === 3 && (
              <div className="space-y-3">
                <label htmlFor="uid" className="block text-xs font-medium text-white/70">
                  Gate.io UID
                </label>
                <input
                  id="uid"
                  type="text"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                    setUidStatus("idle");
                    setUidError("");
                  }}
                  placeholder="Masukkan UID Anda (angka saja)"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                  disabled={uidStatus === "loading"}
                />
                {uidError && (
                  <p className="text-sm text-red-400">{uidError}</p>
                )}
                {uidStatus === "success" && (
                  <p className="text-sm text-cyan-400">UID terverifikasi. Melanjutkan...</p>
                )}
                <p className="text-xs text-white/50">
                  UID ada di Gate.io → Profil → Akun. Hanya UID yang daftar lewat link MIT yang lolos.
                </p>
              </div>
            )}

            {phase.cta && (
              <div className="space-y-3 pt-4">
                {phase.step !== 5 && phase.cta.action === "verify" ? (
                  <button
                    type="button"
                    onClick={handleVerifyUid}
                    disabled={uidStatus === "loading"}
                    className="block w-full min-h-[48px] rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] disabled:opacity-60 sm:py-4"
                  >
                    {uidStatus === "loading" ? "Memverifikasi..." : phase.cta.label}
                  </button>
                ) : phase.step !== 5 && phase.cta.external && phase.cta.href && phase.cta.href !== "#" ? (
                  <a
                    href={phase.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full min-h-[48px] rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] sm:py-4"
                  >
                    {phase.cta.label}
                  </a>
                ) : phase.step !== 5 && phase.cta.label ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={phase.step === 4 && !(depositCheck1 && depositCheck2 && depositCheck3)}
                    className="block w-full min-h-[48px] rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] sm:py-4"
                  >
                    {phase.cta.label}
                  </button>
                ) : null}
                {"ctaSecondary" in phase && phase.ctaSecondary && phase.step !== 5 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="block w-full min-h-[48px] rounded-full border border-white/10 bg-white/5 py-3.5 text-center text-sm font-medium text-white/80 transition hover:bg-white/10 whitespace-pre-line"
                >
                    {phase.ctaSecondary}
                  </button>
                )}
                {phase.step === 5 && (
                  <div className="space-y-5 pt-2">
                    <p className="text-center text-lg font-semibold text-cyan-300/95">
                      Sekarang waktunya mulai trading sungguhan!
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Kirim DM ke Master <span className="font-semibold text-cyan-400">MIT_ZUN</span> dengan pesan di bawah. Klik <strong>Salin</strong> lalu buka DM dan tempel (Ctrl+V) → kirim.
                    </p>
                    <div className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3.5">
                      <p className="text-[10px] uppercase tracking-wider text-white/50 mb-2">
                        Pesan untuk DM
                      </p>
                      <p className="text-base font-semibold text-cyan-300/95 break-words">
                        Registrasi Selesai
                      </p>
                      {uid && (
                        <p className="mt-0.5 text-sm font-mono text-white/80">
                          UID: {uid}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row gap-0 rounded-xl border border-cyan-500/30 bg-white/[0.03] p-1 overflow-hidden">
                      <button
                        type="button"
                        onClick={handleCopyDmMessage}
                        title="Salin pesan"
                        className="h-12 shrink-0 rounded-lg border-0 bg-cyan-500/20 px-5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/30 min-h-[48px] flex items-center justify-center"
                        aria-label="Salin pesan"
                      >
                        Salin
                      </button>
                      <a
                        href={MASTER_DM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleMasterDmClick}
                        className="h-12 flex-1 min-h-[48px] flex items-center justify-center rounded-lg border-0 bg-gradient-to-r from-cyan-600/40 to-cyan-500/30 text-center text-sm font-bold text-white transition hover:from-cyan-500/50 hover:to-cyan-400/40"
                      >
                        Buka DM Master MIT_ZUN
                      </a>
                    </div>
                    <p className="text-[11px] text-white/45 text-center">
                      Salin → Buka DM → tempel (Ctrl+V) → kirim
                    </p>
                    {showResetLink && (
                      <p className="text-center pt-2">
                        <button
                          type="button"
                          onClick={handleResetProgress}
                          className="text-xs text-white/40 hover:text-white/60 underline underline-offset-2"
                        >
                          Salah daftar / UID orang lain? Hapus data & mulai ulang
                        </button>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {!phase.cta && phaseIndex === 0 && (
              <button
                type="button"
                onClick={goNext}
                className="mt-6 block w-full min-h-[48px] rounded-full border border-cyan-500/30 bg-gradient-to-r from-cyan-900/40 to-cyan-800/30 px-6 py-3.5 text-center font-semibold text-white shadow-[0_0_30px_rgba(6,182,212,0.2)] transition hover:border-cyan-400/50 sm:py-4"
              >
                Lanjutkan ke Step 2
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast: Membuka Profil Master / Disalin */}
      <AnimatePresence>
        {masterToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-white/15 bg-slate-800/95 px-4 py-2.5 text-sm text-white/90 shadow-lg backdrop-blur-sm"
          >
            Membuka Profil Master MIT_ZUN...
          </motion.div>
        )}
        {copyToast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-lg border border-cyan-500/40 bg-cyan-900/95 px-4 py-2.5 text-sm font-medium text-cyan-200 shadow-lg backdrop-blur-sm"
          >
            Disalin! Tempel di DM (Ctrl+V)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
