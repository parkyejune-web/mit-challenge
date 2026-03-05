"use client";

import { MM_FRAME_WIDTH, MM_FRAME_HEIGHT } from "../constants";

export default function MmOnboardingPage() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="overflow-hidden rounded-[2rem] border-2 border-white/10 bg-black shadow-2xl"
        style={{ width: MM_FRAME_WIDTH, height: MM_FRAME_HEIGHT }}
      >
        <iframe
          src="/onboarding"
          title="Mobile preview — Onboarding"
          className="h-full w-full border-0"
          style={{ width: MM_FRAME_WIDTH, height: MM_FRAME_HEIGHT }}
        />
      </div>
      <p className="mt-2 text-[10px] text-white/40">
        Onboarding · bento 1-col & CTA w-full
      </p>
    </div>
  );
}
