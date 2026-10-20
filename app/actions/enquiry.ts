"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import {
  INTENTS,
  UTM_KEYS,
  normalisePhone,
  validateEnquiry,
  type EnquiryInput,
  type FieldErrors,
} from "@/lib/enquiry";

export type EnquiryResult =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: FieldErrors }
  | { ok: false; reason: "rate_limited" | "error" };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  // Honeypot filled: pretend it worked so bots learn nothing, store nothing.
  if (clip(input.website, 200)) return { ok: true };

  if (!rateLimit(ip)) return { ok: false, reason: "rate_limited" };

  const data = {
    interest: clip(input.interest, 40),
    timing: clip(input.timing, 40),
    name: clip(input.name, 80),
    phone: clip(input.phone, 20),
    email: clip(input.email, 120).toLowerCase(),
    consent: input.consent === true,
  };
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return { ok: false, reason: "invalid", errors };

  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, clip(input.utm?.[k], 200) || null]));
  const row = {
    intent: (INTENTS as readonly string[]).includes(input.intent) ? input.intent : "baseline",
    interest: data.interest,
    start_when: data.timing,
    name: data.name,
    phone: `+91${normalisePhone(data.phone)}`,
    email: data.email || null,
    consent: true,
    source_section: clip(input.source, 60) || null,
    ...utm,
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Demo mode: no database configured. Log so the submission is not lost.
    console.info("[enquiry] Supabase not configured; submission:", JSON.stringify(row));
    return { ok: true };
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/applications`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[enquiry] Supabase insert failed:", res.status, await res.text());
      return { ok: false, reason: "error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[enquiry] Supabase request error:", err);
    return { ok: false, reason: "error" };
  }
}
