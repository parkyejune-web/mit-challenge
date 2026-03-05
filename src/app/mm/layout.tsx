import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobile Debug (393px) | MIT Challenge",
  description: "Local mobile layout check — iPhone 15 Pro width.",
};

export default function MmLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-900 py-6">
      <div className="mx-auto max-w-[calc(393px+2rem)] px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <p className="text-xs font-mono text-white/60">
            Mobile Debug · 393×852 (iPhone 15 Pro)
          </p>
          <nav className="flex gap-2 text-xs">
            <a
              href="/mm"
              className="rounded border border-white/20 bg-white/5 px-2 py-1.5 text-white/80 hover:bg-white/10"
            >
              Home
            </a>
            <a
              href="/mm/survey"
              className="rounded border border-white/20 bg-white/5 px-2 py-1.5 text-white/80 hover:bg-white/10"
            >
              Survey
            </a>
            <a
              href="/mm/onboarding"
              className="rounded border border-white/20 bg-white/5 px-2 py-1.5 text-white/80 hover:bg-white/10"
            >
              Onboarding
            </a>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
