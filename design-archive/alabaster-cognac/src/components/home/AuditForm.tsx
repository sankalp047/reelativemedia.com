"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitAudit, type AuditState } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/site";
import { EXPO } from "@/lib/motion";

const initial: AuditState = { status: "idle" };

/**
 * The form plate sits INSIDE the FinalCTA dark well, so every token here is the
 * dark-ground form. The --color-muted / --color-brass migration aliases are
 * deliberately NOT used: muted resolves to graphite (dark type) and would land
 * at 1.56:1 on this well. Measured on --color-well #1F1B15:
 *   bone 15.19 · bone-dim 8.49 · ash 6.46 · cognac-hi 5.72 · edge-dark 3.25
 * The plate itself carries `edge-dark` rather than `rule-dark`: the well card
 * is only 1.02:1 against the section ground, so a decorative hairline would
 * leave the plate with no edge at all.
 */
const plateCls = "rounded-[2px] border border-edge-dark bg-well";

const inputCls =
  "w-full rounded-[2px] border border-edge-dark bg-well px-4 py-3 text-[16px] text-bone placeholder:text-ash transition-colors duration-200 focus:outline-none focus:border-cognac-hi";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="mono text-ash">{label}</span>
      {children}
      {error ? <span className="mono text-[11px] text-cognac-hi">{error}</span> : null}
    </label>
  );
}

export function AuditForm() {
  const [state, action, pending] = useActionState(submitAudit, initial);
  const reduce = useReducedMotion();
  const errors = state.status === "error" ? state.fields ?? {} : {};
  const tsRef = useRef<HTMLInputElement>(null);
  const itRef = useRef<HTMLInputElement>(null);

  /* Stamped on the client AFTER mount, never server-rendered. A server value
     would be the BUILD time on a static page, so every submission would look
     hours old and fail the staleness check. */
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
  }, []);

  /* Proof that a human touched the form. Scripts that assign input.value
     directly fire none of these, so the stamp stays empty.
     `input` is the load-bearing one — it fires on typing AND on browser
     autofill, and there is no way to submit a valid name and phone without it.
     focus/keydown/pointerdown are belt and braces, and are less reliable than
     they look: element.focus() does not fire a focus event at all when the
     document itself does not hold window focus.
     The server treats a missing stamp as SUSPICIOUS, never as grounds to
     discard — see the note in actions.ts. */
  const markInteraction = () => {
    if (itRef.current && !itRef.current.value) itRef.current.value = String(Date.now());
  };

  if (state.status === "success") {
    return (
      <div className={`${plateCls} flex flex-col items-center gap-5 p-10 text-center`} role="status" aria-live="polite">
        {/* A cognac-hi fill takes INK (6.07:1). The stroke is --color-ink. */}
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cognac-hi">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#191510" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.path
              d="M4.5 12.5 9.5 17.5 19.5 7"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EXPO, delay: 0.15 }}
            />
          </svg>
        </span>
        <p className="t-h2 !text-[clamp(28px,4vw,44px)] text-bone">Got it.</p>
        <p className="t-body text-bone-dim">A strategist will call you within one business day.</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className={`${plateCls} flex flex-col gap-4 p-6 md:p-8`}
      noValidate
      onFocusCapture={markInteraction}
      onKeyDownCapture={markInteraction}
      onPointerDownCapture={markInteraction}
      onInputCapture={markInteraction}
      onChangeCapture={markInteraction}
    >
      {/* Both stamps are set on the client. See the effect and handler above. */}
      <input ref={tsRef} type="hidden" name="ts" defaultValue="" />
      <input ref={itRef} type="hidden" name="it" defaultValue="" />

      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Your name" error={errors.name}>
        <input name="name" className={inputCls} placeholder="First and last name" required autoComplete="name" />
      </Field>
      <Field label="Phone" error={errors.phone}>
        <input name="phone" type="tel" className={inputCls} placeholder="(469) 000-0000" required autoComplete="tel" inputMode="tel" />
      </Field>

      {state.status === "error" ? (
        <p className="t-body !text-[13px] text-cognac-hi" role="alert">{state.message}</p>
      ) : null}

      <Button type="submit" className="mt-2 w-full" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Request a callback"}
      </Button>
      <p className="t-body text-center !text-[13px] text-ash">No sales presentation. A strategist calls you back within one business day.</p>

      {/* The second route. Some people will not hand a phone number to a form,
          and losing them to a missing mailto is a silly way to lose a lead. */}
      <p className="t-body mt-1 border-t border-edge-dark pt-4 text-center !text-[13px] text-ash">
        Prefer email?{" "}
        <a href={`mailto:${SITE.salesEmail}?subject=${encodeURIComponent("Content enquiry — Reelative Media")}`} className="link-underline text-cognac-hi">
          {SITE.salesEmail}
        </a>
      </p>
    </form>
  );
}
