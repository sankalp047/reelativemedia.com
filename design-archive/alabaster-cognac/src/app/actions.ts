"use server";

import { headers } from "next/headers";
import { sendMail } from "@/lib/mailgun";
import { SITE } from "@/lib/site";

export type AuditState =
  | { status: "idle" }
  | { status: "error"; message: string; fields?: Record<string, string> }
  | { status: "success" };

/* ------------------------------------------------------------------ */
/* Bot defence                                                         */
/* ------------------------------------------------------------------ */

/**
 * Five independent signals, cheapest first. Four of them discard; the fifth
 * only flags (see 3). None is strong alone — the point is that a scripted
 * submit has to pass all of them, and the cheap ones reject the overwhelming
 * majority before any work happens.
 *
 * This matters MORE now that the form is two fields. A name-and-phone form is
 * the easiest possible thing to script: there is nothing to guess, no select to
 * satisfy, no format to match beyond ten digits. The defence cannot lean on the
 * form being tedious to fill, because it is not.
 *
 * Deliberately NOT a CAPTCHA. This asks a local business owner for a name and a
 * number; making them identify traffic lights to get a callback costs more real
 * leads than the spam costs. If volume ever justifies it, Cloudflare Turnstile
 * is the drop-in that does not punish the human.
 */

/** 1. Honeypot — hidden off-screen, only an automated filler completes it. */
const HONEYPOT = "website";

/**
 * 2. Dwell time. `ts` is stamped when the form MOUNTS, so this measures how long
 * the visitor has been on the page, not how fast they type — someone who lands,
 * scrolls to the form and autofills has still burned several seconds. Lowered
 * from 2500ms because a two-field form plus browser autofill is genuinely fast
 * and a false reject costs a real lead.
 */
const MIN_DWELL_MS = 1_500;
/** ...and anything older than this is a stale tab or a replayed form. */
const MAX_FORM_AGE_MS = 6 * 60 * 60 * 1000;

/**
 * 3. Proof of interaction. `it` is stamped by the first real input/focus/
 * keydown/pointerdown inside the form. Headless scripts that assign
 * input.value directly dispatch none of those, so the field stays empty.
 *
 * THIS ONE DOES NOT DISCARD. It flags the email instead.
 *
 * Every other gate here fails toward dropping the message, which is correct
 * when the signal is unambiguous — a filled honeypot has no innocent
 * explanation. This signal is not unambiguous: it depends on browser event
 * behaviour that varies, and element.focus() is already known not to fire a
 * focus event when the document lacks window focus. If that assumption is
 * wrong in some browser, a silent drop means the business loses every enquiry
 * from it and nobody ever finds out.
 *
 * A false positive costs one line in an email. A false negative costs a
 * customer. Flag, do not bin.
 */

/**
 * 4. Per-IP rate limit. In-memory, so it is per server instance and resets on
 * deploy — fine for one region, useless across many lambdas. Move to Vercel KV
 * or Upstash when this runs anywhere with real concurrency.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Unbounded growth otherwise: one entry per attacking IP, forever.
  if (hits.size > 5_000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** 5. Payload shape. A link in a name field is spam every single time. */
const SPAM = /(https?:\/\/|www\.|<a\s|\[url=|\bviagra\b|\bcasino\b|\bcrypto\b|\bseo\b)/i;

/* ------------------------------------------------------------------ */

const digits = (s: string) => s.replace(/\D/g, "");

export async function submitAudit(_prev: AuditState, formData: FormData): Promise<AuditState> {
  // The discarding gates report SUCCESS rather than an error. Telling a bot
  // which check caught it is free tuning information for whoever wrote it.
  if (String(formData.get(HONEYPOT) ?? "").trim() !== "") {
    return { status: "success" };
  }

  const mountedAt = Number(formData.get("ts") ?? 0);
  const interactedAt = Number(formData.get("it") ?? 0);
  const age = Date.now() - mountedAt;

  if (!Number.isFinite(mountedAt) || mountedAt <= 0 || age < MIN_DWELL_MS) {
    return { status: "success" };
  }
  if (age > MAX_FORM_AGE_MS) {
    return { status: "error", message: "This form expired. Please reload the page and try again." };
  }
  const interactionVerified = Number.isFinite(interactedAt) && interactedAt >= mountedAt;

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return { status: "error", message: `Too many requests. Please email ${SITE.salesEmail} or call ${SITE.phone}.` };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (SPAM.test(name)) {
    return { status: "success" };
  }

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Tell us your name.";
  // Length-capped as well as floored: a 400-character "name" is not a name, and
  // the cap keeps anything hostile out of the email body.
  if (name.length > 80) fields.name = "That name is too long.";
  const d = digits(phone);
  if (d.length < 10 || d.length > 15) fields.phone = "Enter a phone number we can call.";
  if (Object.keys(fields).length) {
    return { status: "error", message: "A couple of fields need attention.", fields };
  }

  const lines = [
    `Name:      ${name}`,
    `Phone:     ${phone}`,
    ``,
    `IP:        ${ip}`,
    `Dwell:     ${Math.round(age / 1000)}s on page before submitting`,
    `Verified:  ${interactionVerified ? "yes — real keyboard/pointer interaction" : "NO — no interaction events recorded, treat with suspicion"}`,
    `Received:  ${new Date().toISOString()}`,
    `Source:    ${SITE.url} — callback request`,
  ].join("\n");

  const sent = await sendMail({
    to: process.env.LEAD_INBOX || SITE.salesEmail,
    subject: `${interactionVerified ? "" : "[unverified] "}Callback request — ${name}`,
    text: lines,
  });

  if (!sent.ok) {
    // The lead still reaches a human through the log, so the visitor is told it
    // worked rather than being asked to retype into a form that may be
    // misconfigured server-side, which they cannot fix.
    console.error("[callback-request] mail failed:", sent.reason, "\n", lines);
  } else {
    console.log("[callback-request] delivered:", name, phone);
  }

  return { status: "success" };
}
