/**
 * Gate.io API v4 signed request helpers.
 * Used for rebate/sub_relation verification (no Supabase/DB).
 */

import { createHmac, createHash } from "node:crypto";

const GATE_API_BASE = "https://api.gateio.ws/api/v4";

function sha512Hex(data: string): string {
  return createHash("sha512").update(data, "utf8").digest("hex");
}

function hmacSha512Hex(key: string, message: string): string {
  return createHmac("sha512", key).update(message, "utf8").digest("hex");
}

export async function gateioSignedFetch(
  method: string,
  path: string,
  query: Record<string, string> = {},
  body?: string,
  signal?: AbortSignal
): Promise<Response> {
  const apiKey = process.env.GATEIO_API_KEY;
  const secret = process.env.GATEIO_SECRET_KEY;
  if (!apiKey || !secret) {
    throw new Error("GATEIO_API_KEY and GATEIO_SECRET_KEY must be set");
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const queryString = new URLSearchParams(query).toString();
  const pathWithQuery = queryString ? `${path}?${queryString}` : path;
  const url = `${GATE_API_BASE}${pathWithQuery}`;

  const payload = body ?? "";
  const payloadHash = sha512Hex(payload);

  const fullPath = `/api/v4${path}`;
  const signMessage = [
    method,
    fullPath,
    queryString,
    payloadHash,
    timestamp,
  ].join("\n");

  const sign = hmacSha512Hex(secret, signMessage);

  const headers: Record<string, string> = {
    KEY: apiKey,
    SIGN: sign,
    Timestamp: timestamp,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method,
    headers,
    body: method !== "GET" ? payload : undefined,
    signal,
  });
}

export async function gateioGet<T = unknown>(
  path: string,
  query: Record<string, string> = {},
  signal?: AbortSignal
): Promise<T> {
  const res = await gateioSignedFetch("GET", path, query, undefined, signal);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gate API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Gate.io GET /rebate/user/sub_relation 응답 형태 (테더겟과 동일).
 * 우리 레퍼럴이면 list 항목에 belong !== "" && type > 0.
 */
export interface SubRelationItem {
  uid?: number;
  belong?: string;
  type?: number;
  ref_uid?: number;
}

export interface SubRelationResponse {
  list?: SubRelationItem[];
}

export async function checkSubRelation(uid: string, signal?: AbortSignal): Promise<boolean> {
  const path = "/rebate/user/sub_relation";
  const data = await gateioGet<SubRelationResponse>(path, { user_id_list: uid }, signal);
  const list = data?.list ?? [];
  const found = list.find((item) => String(item.uid) === String(uid));
  if (!found) return false;
  const belong = found.belong ?? "";
  const type = found.type ?? 0;
  return belong !== "" && type > 0;
}
