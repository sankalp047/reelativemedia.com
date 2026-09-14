"use client";

import { useActionState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { submitAudit, type AuditState } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { BUSINESS_TYPES } from "@/lib/data";
import { EXPO } from "@/lib/motion";

const initial: AuditState = { status: "idle" };

const inputCls =
  "w-full rounded-[12px] border border-white/12 bg-base/80 px-4 py-3.5 text-[16px] text-primary placeholder:text-muted/60 transition-colors duration-300 focus:border-white/40 focus:outline-none";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="mono text-muted">{label}</span>
      {children}
      {error ? <span className="text-[13px] text-[#FF9A52]">{error}</span> : null}
    </label>
  );
}

export function AuditForm() {
  const [state, action, pending] = useActionState(submitAudit, initial);
  const reduce = useReducedMotion();
  const errors = state.status === "error" ? state.fields ?? {} : {};

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-6 rounded-[24px] bg-elevated p-10 text-center" role="status" aria-live="polite">
        <span className="grad-fill flex h-16 w-16 items-center justify-center rounded-full">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <motion.path
              d="M4.5 12.5 9.5 17.5 19.5 7"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EXPO, delay: 0.15 }}
            />
          </svg>
        </span>
        <p className="font-display text-[26px] font-bold leading-tight">Got it.</p>
        <p className="text-muted">A strategist will call you within one business day.</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5 rounded-[24px] bg-elevated p-6 md:p-8" noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Business name" error={errors.business}>
        <input name="business" className={inputCls} placeholder="e.g. Your restaurant, clinic or store" required autoComplete="organization" />
      </Field>
      <Field label="Your name" error={errors.name}>
        <input name="name" className={inputCls} placeholder="First and last name" required autoComplete="name" />
      </Field>
      <Field label="Phone" error={errors.phone}>
        <input name="phone" type="tel" className={inputCls} placeholder="(469) 000-0000" required autoComplete="tel" inputMode="tel" />
      </Field>
      <Field label="Business type" error={errors.type}>
        <select name="type" className={`${inputCls} appearance-none`} defaultValue="" required>
          <option value="" disabled>
            Select one
          </option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Instagram handle (optional)">
        <input name="instagram" className={inputCls} placeholder="@yourbusiness" autoComplete="off" />
      </Field>

      {state.status === "error" ? (
        <p className="text-[14px] text-[#FF9A52]" role="alert">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="mt-2 w-full" disabled={pending} aria-busy={pending}>
        {pending ? "Sending…" : "Book my content audit"}
      </Button>
      <p className="text-center text-[12px] text-muted/70">No sales presentation. A practical audit of your current content.</p>
    </form>
  );
}
