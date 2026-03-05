import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#020202] px-4 text-center">
      <p className="font-mono text-6xl font-black text-white/90">404</p>
      <p className="mt-2 text-zinc-400">Halaman tidak ditemukan</p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-cyan-500/50 bg-cyan-500/20 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500/30"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
