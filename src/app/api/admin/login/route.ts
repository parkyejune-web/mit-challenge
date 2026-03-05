import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "change-me-in-production";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function getValidId(): string | null {
  const id = process.env.ADMIN_ID;
  return id && id.length > 0 ? id : null;
}

export async function POST(request: NextRequest) {
  const adminId = getValidId();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminId || !adminPassword) {
    return Response.json(
      { ok: false, error: "Admin belum dikonfigurasi (ADMIN_ID, ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  let body: { id?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Body tidak valid." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (id !== adminId || password !== adminPassword) {
    return Response.json({ ok: false, error: "ID atau kata sandi salah." }, { status: 401 });
  }

  const payload = `${adminId}:${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return Response.json({ ok: true });
}
