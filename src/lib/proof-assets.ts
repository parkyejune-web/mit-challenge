/**
 * Proof asset paths and 4 trades (entry dates / profit from screenshots).
 * Total profit: sum of 4 trades unless overridden in constants.
 */
export const PROOF_IMAGE_PATHS = {
  totalAccount: "/images/total-account.png",
} as const;

export interface ProofTrade {
  chart: string;
  result: string;
  label: string;
  entryDate: string;
  /** Profit USDT for this trade (from result screenshot) */
  profitUsdt: number;
  isWin: boolean;
  /** PART 13-1: Exact entry/exit/sl/tp — no rounding, display as-is */
  position: "LONG" | "SHORT";
  pair: string;
  entry: string;
  exit: string;
  sl: string;
  tp: string;
  /** Return % = Gate platform ROI (screenshot exact) */
  returnPct: number;
}

/** 4 trades: real data; ROI from Gate screenshots */
export const PROOF_TRADES: ProofTrade[] = [
  { chart: "/images/1.png", result: "/images/1-1.png", label: "ROBOUSDT", entryDate: "28 Feb 2025", profitUsdt: 3151.73, isWin: true, position: "SHORT", pair: "ROBO", entry: "0.0488", exit: "0.0466", sl: "0.0502", tp: "0.0466", returnPct: 4.02 },
  { chart: "/images/2.png", result: "/images/2-1.png", label: "ARBUSDT", entryDate: "1 Mar 2025", profitUsdt: 5305.24, isWin: true, position: "LONG", pair: "ARB", entry: "0.1041", exit: "0.1053", sl: "0.1027", tp: "0.1053", returnPct: 5.39 },
  { chart: "/images/3.png", result: "/images/3-1.png", label: "SOLUSDT", entryDate: "2 Mar 2025", profitUsdt: 9012.52, isWin: true, position: "LONG", pair: "SOL", entry: "82.34", exit: "82.92", sl: "81.95", tp: "82.92", returnPct: 9.4 },
  { chart: "/images/4.png", result: "/images/4-1.png", label: "BTCUSDT", entryDate: "3 Mar 2025", profitUsdt: -1601.13, isWin: false, position: "SHORT", pair: "BTC", entry: "64,869.4", exit: "65,107.8", sl: "65,096.0", tp: "64,620.0", returnPct: -2.33 },
];

export const PROOF_SETS = PROOF_TRADES;
export const PROOF_VIDEO_PATH = "/videos/0303.mp4";

export function getTotalProfitUsdt(): number {
  return PROOF_TRADES.reduce((sum, t) => sum + t.profitUsdt, 0);
}

export function getWinRatePercent(): number {
  const wins = PROOF_TRADES.filter((t) => t.isWin).length;
  return Math.round((wins / PROOF_TRADES.length) * 100);
}
