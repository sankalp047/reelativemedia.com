"use server";

import { headers } from "next/headers";
import { BUSINESS_TYPES } from "@/lib/data";

export type AuditState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string> }
  | { status: "success" };

// Simple in-memory rate limit (per server instance). Replace with a durable
// store (Upstash / Vercel KV) before launch.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function submitAudit(_prev: AuditState, formData: FormData): Promise<AuditState> {
  // Honeypot: real users never fill this.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return { status: "error", message: "Too many requests. Please call us instead." };
  }

  const business = String(formData.get("business") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();

  const fields: Record<string, string> = {};
  if (business.length < 2) fields.business = "Tell us the business name.";
  if (name.length < 2) fields.name = "Tell us your name.";
  if (phone.replace(/\D/g, "").length < 10) fields.phone = "Enter a phone number we can call.";
  if (!BUSINESS_TYPES.includes(type)) fields.type = "Pick a business type.";
  if (Object.keys(fields).length) {
    return { status: "error", message: "A couple of fields need attention.", fields };
  }

  // TODO(launch): send via Resend + write a row to HubSpot / Google Sheet.
  console.log("[audit-request]", { business, name, phone, type, instagram, ip, at: new Date().toISOString() });

  return { status: "success" };
}
