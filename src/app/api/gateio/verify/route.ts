import { NextRequest } from "next/server";
import { checkSubRelation } from "@/lib/gateio";
import { VERIFY_ERROR_DEFAULT } from "@/lib/constants";

const GATEIO_TIMEOUT_MS = 3500;

/** Postel's Law: accept flexible input — normalize UID (strip all whitespace). */
function normalizeUid(raw: string): string {
  return raw.replace(/\s+/g, "");
}

/**
 * UID만 받아서 Gate.io sub_relation API로 우리 레퍼럴인지 확인 (테더겟과 동일 로직).
 * belong !== "" && type > 0 이면 우리 팀.
 */
export async function GET(request: NextRequest) {
  const apiKey = process.env.GATEIO_API_KEY;
  const secretKey = process.env.GATEIO_SECRET_KEY;
  if (!apiKey || !secretKey) {
    return Response.json(
      {
        ok: false,
        error:
          "Server belum dikonfigurasi. Buat file .env.local lalu isi GATEIO_API_KEY dan GATEIO_SECRET_KEY (salin dari tether-get .env). Atau salin isi .env.example ke .env.local — Next.js hanya baca .env.local, bukan .env.example. Lalu restart server.",
      },
      { status: 503 }
    );
  }

  const raw = request.nextUrl.searchParams.get("uid") ?? "";
  const uid = normalizeUid(raw.trim());
  if (!uid) {
    return Response.json(
      { ok: false, error: "Masukkan UID Gate.io Anda." },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GATEIO_TIMEOUT_MS);

  try {
    const isOurReferral = await checkSubRelation(uid, controller.signal);
    clearTimeout(timeoutId);
    if (isOurReferral) {
      return Response.json({ ok: true });
    }
    return Response.json({
      ok: false,
      error: VERIFY_ERROR_DEFAULT,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      return Response.json(
        { ok: false, error: "Verifikasi Gate.io memakan waktu terlalu lama. Silakan coba lagi." },
        { status: 504 }
      );
    }
    const message = e instanceof Error ? e.message : "Verifikasi gagal.";
    return Response.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
