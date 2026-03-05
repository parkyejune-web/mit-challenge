/**
 * Landing copy, URLs, feed text (Bahasa Indonesia / EN).
 */

export const SURVEY_URL =
  process.env.NEXT_PUBLIC_SURVEY_URL || "https://forms.gle/example";

/** FOMO banner */
export const URGENCY_BANNER =
  "Batch 1 pendaftaran 85% terisi (sisa 4 slot)";
export const SLOT_COUNT = 4;
/** Slots: 50 total (counting removed) */
export const SLOT_TOTAL = 50;
export const SLOT_FILLED = 16;
export const DEADLINE_COPY =
  "Setelah penutupan Jumat ini, biaya batch berikutnya akan naik.";

/** Hero (Hook) — MIT Standard, Bahasa Indonesia */
export const HERO_TITLE =
  "Trading pakai hoki sudah berakhir. Saatnya logika profit yang bicara.";
export const HERO_SUB =
  "Buktikan strategi $50 ke $100 dengan Standar MIT. Jika tidak mencapai target, Batch 2 menjadi milik Anda secara gratis.";
/** Mobile: short hero sub (Toss-style) */
export const HERO_SUB_MOBILE = "Strategi $50→$100. Tidak capai? Batch 2 gratis.";

/** Trust (Authority) */
export const GATE_BADGE = "Akun terverifikasi Gate.io real-time";
export const LABEL_VERIFIED_API = "API Terverifikasi";
/** Proof section heading (PART 12-3: Indonesian) */
export const PROOF_HEADING_TITLE = "Hasil Trading Mingguan";
export const PROOF_HEADING_SUB = "Data Riwayat: 25 Feb - 03 Mar";
/** PART 14-1: Evidence-first funnel — unified proof section title */
export const LIVE_ACCOUNT_VERIFICATION_TITLE = "LIVE ACCOUNT VERIFICATION";
export const LIVE_ACCOUNT_VERIFICATION_SUB = "Hasil Trading Mingguan · 25 Feb - 03 Mar";

/** Before & After */
export const BEFORE_LABEL = "Trading emosional & siklus loss";
export const AFTER_LABEL = "Profit rapi dengan logika MIT";

/** Live profit feed (human trading, not bot) */
export const FEED_ITEMS = [
  "+3.151 USDT Profit dikonfirmasi (2 menit lalu)",
  "+5.305 USDT Profit dikonfirmasi (5 menit lalu)",
  "+9.012 USDT Profit dikonfirmasi (8 menit lalu)",
  "User_0411, $50 → $82 profit (baru saja)",
  "User_0892, lulus tes kelayakan & gabung batch 1 (1 menit lalu)",
  "+15.868 USDT Total (4 trade) · Win Rate 75% (1 minggu)",
];

/** Risk Reversal — Akses Gratis Batch Berikutnya (no refund wording) */
export const GUARANTEE_TITLE =
  "Target profit challenge tidak tercapai? Akses gratis ke Batch berikutnya.";
export const GUARANTEE_SUB =
  "Mulai dari nominal kecil—risiko minimal, belajar logika profit maksimal. Tidak capai target? Dapat akses gratis ke Batch berikutnya.";

/** CTA (MIT Standard, Bahasa) */
export const CTA_BUTTON = "Cek Kelayakan & Daftar Challenge (30 detik)";
export const CTA_MICRO = "Sesuai Standar MIT - Kuota Terbatas 50 Orang.";
export const CTA_FLOATING = "Check Eligibility (30s)";
/** Conversion bar button (PART 6-2) */
export const BAR_CTA_TEXT = "Cek Kelayakan (30s)";
export const LOADING_MODAL_TEXT = "Menganalisis kecocokan challenge Anda...";
export const LOADING_TRANSITION_TEXT = "Menganalisis kecocokan Anda dengan Standar MIT...";

/** 3-Step (Frictionless) */
export const STEPS = [
  { step: 1, label: "Cek kelayakan", desc: "Tes kelayakan gratis" },
  { step: 2, label: "Konsultasi 1:1", desc: "Panduan ahli personal" },
  { step: 3, label: "Mulai challenge profit", desc: "Buktikan $50 → $100" },
] as const;

/** Founder's Message (Storytelling) */
export const FOUNDER_MESSAGE =
  "Kenapa kami mulai dari $50? Karena semua orang harus paham esensi profit tanpa risiko dulu. Kami percaya Anda harus belajar menjaga aset dan menghasilkan uang dengan benar.";

/** Storytelling (no refund wording, akses gratis batch berikutnya) */
export const STORYTELLING_TITLE =
  "Anda gagal bukan karena modal kecil. Tapi karena Anda TIDAK PUNYA PRINSIP.";
export const STORYTELLING_BODY =
  "Kami membentuk ulang habit trading Anda dengan $50. Jika target double-up tidak tercapai, Anda akan mendapatkan akses otomatis ke Batch berikutnya secara GRATIS.";
export const STORYTELLING_PUNCHLINE =
  "Inilah Standar MIT: Kami tidak memberikan janji, kami memberikan hasil dan keberlanjutan.";
/** Mobile: short */
export const STORYTELLING_BODY_MOBILE = "Habit trading $50. Tidak capai target? Batch berikut gratis.";
export const STORYTELLING_PUNCHLINE_MOBILE = "Standar MIT: hasil & keberlanjutan.";

/** CTA popup — analysis message (2s progress then survey), Bahasa Indonesia */
export const CTA_ANALYSIS_TEXT = "Menganalisis kecocokan trading Anda dengan Standar MIT...";

/** Scan ritual step labels */
export const SCAN_PHASE_1 = "Menganalisis profil risiko Anda...";
export const SCAN_PHASE_2 = "Menyesuaikan dengan logika MIT...";

/** Floating button tooltip (blink every 3s) */
export const FLOATING_TOOLTIP = "Klik di sini untuk tes kelayakan";

/** 50-slot enrollment policy UI (PART 6-3) */
export const POLICY_TITLE = "MIT BATCH 1 ENROLLMENT POLICY";
export const POLICY_QUOTA = "QUOTA: 50 SLOTS ONLY";
export const POLICY_DESC =
  "Pendaftaran akan ditutup otomatis segera setelah 50 orang terpenuhi. Ini adalah standar eksklusivitas MIT.";
/** Mobile: short */
export const POLICY_DESC_MOBILE = "50 slot. First come, first served.";
/** Bar left static copy (no counting) */
export const BAR_LEFT_MESSAGE = "Quota: 50 slots only. First come, first served.";

/** Header (PART 14-2: minimal nav — logo left, status right) */
export const SITE_TITLE = "MIT Trading Challenge";
export const ENROLLMENT_STATUS_LABEL = "Batch 1 Enrollment Active";

/** Section labels (Bahasa Indonesia) */
export const LABEL_LIVE_REGISTRATION = "Status pendaftaran real-time";
export const LABEL_LIVE_PROFIT_FEED = "Feed profit real-time";
export const LABEL_STEPS_INTRO = "Mulai dalam 3 langkah";
export const LABEL_VERIFY_VIDEO = "Video verifikasi akun real-time";
/** Proof section labels */
export const LABEL_REALTIME_VERIFICATION = "Real-time Verification";
export const LABEL_LIVE_TRADING_RESULTS = "Live Trading Results";
export const LABEL_ENTRY_TIMING = "Entry timing";
export const LABEL_TOTAL_PROFIT_TRADES = "Total profit (4 trades)";
export const LABEL_VIDEO_VERIFICATION = "Live account verification";
export const LABEL_ACCOUNT_VERIFICATION = "Gate.io account verification";
/** Proof badge (top-right on verification shots) */
export const PROOF_VERIFIED_BADGE = "VERIFIED BY GATE.IO API";
/** Set footer badge (PART 6-1) */
export const MIT_LOGIC_VERIFIED_BADGE = "MIT LOGIC VERIFIED";

/** Portfolio dashboard (benchmark image): labels & risk copy */
export const DASHBOARD_INTRO =
  "Bangun jurnal trading yang rapi dan profesional, sambil hitung ukuran posisi, manajemen risiko, dan potensi profit secara otomatis.";
/** Mobile: short (Toss-style) */
export const DASHBOARD_INTRO_MOBILE = "Jurnal rapi. Risk & profit terukur.";
export const DASHBOARD_TABLE_TITLE = "Recent Trades";
export const BADGE_WIN_RATE = "Win Rate";
export const BADGE_CUMULATIVE_PL = "Cumulative P/L";
export const RISK_CALC_TITLE = "Risk Calculator";
export const RISK_NOTE = "NOTE: RISK ONLY 1-3% PER TRADE!";
export const RISK_ACCOUNT_LINE = "Account: $120,000 / Risk: 1% / Position Size: $10,000";
export const RISK_FUTURE_BALANCE = "Future Account Balance";
export const RISK_PCT = "Risk Per Trade (%)";
export const RISK_POSITION = "Position Per Trade";
export const EQUITY_CHART_TITLE = "Equity Curve";
export const DASHBOARD_HIGHLIGHT_1 = "Rasio R:R 1:1 ~ 1.2";
export const DASHBOARD_HIGHLIGHT_2 = "Logika Profit Berbasis Probabilitas Tinggi";

/** PART 13-3: MIT Core Philosophy — 3-column below portfolio matrix (Bahasa) */
export const PHILOSOPHY_SECTION_TITLE = "Filosofi Trading MIT";
export const PHILOSOPHY_CARDS = [
  { title: "Rasio R:R 1:1 ~ 1.2", body: "Kami fokus pada konsistensi, bukan profit instan." },
  { title: "Win Rate 70%+", body: "Sebagai manusia, kita butuh kemenangan rutin untuk menjaga psikologi. Kami terobsesi pada akurasi." },
  { title: "Trend Logic", body: "Membaca jejak institusi untuk profit yang terukur." },
] as const;

/** PART 12-FINAL: Discord wide showcase (Bahasa) */
export const DISCORD_QA_TITLE = "Transparansi Penuh: Bimbingan Real-Time";
export const DISCORD_QA_SUB = "Lihat bagaimana Standar MIT menjawab setiap pertanyaan member di Discord Premium. Kami tidak membiarkan Anda trading sendirian.";

/** PART 12-1: MIT Logic Deep-Dive 3-column cards (Bahasa) */
export const MIT_LOGIC_SECTION_TITLE = "Logika Trading MIT";
export const MIT_LOGIC_CARDS = [
  {
    title: "Rasio RR",
    number: "1:1 ~ 1.2",
    body: "Kami tidak mengejar profit besar dalam satu kali trade, tapi konsistensi.",
    bodyMobile: "Konsistensi, bukan profit sekali jalan.",
  },
  {
    title: "Win Rate 70%+",
    number: "70%+",
    body: "Sebagai manusia, kekalahan beruntun akan merusak psikologi. Itulah sebabnya kami terobsesi pada tingkat kemenangan.",
    bodyMobile: "Terobsesi pada kemenangan rutin.",
  },
  {
    title: "Logika Tren MIT",
    number: null,
    body: "Membaca pergerakan institusi untuk meminimalkan emosi dan memaksimalkan akurasi.",
    bodyMobile: "Ikuti institusi. Emosi minimal, akurasi maksimal.",
  },
] as const;

/** Toast when slot count increments (**** = random 4 digits) */
export const TOAST_COMPLETED = "User_**** just completed the suitability test.";

/** API: Gate.io UID verification failure message */
export const VERIFY_ERROR_DEFAULT =
  "UID ini belum terdaftar di referral kami. Pastikan Anda daftar lewat link referral. UID bisa dicek di Profil → Akun di Gate.io.";
