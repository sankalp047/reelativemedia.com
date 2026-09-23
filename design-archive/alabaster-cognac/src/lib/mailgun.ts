import "server-only";

/**
 * Mailgun over its plain HTTP API — no SDK.
 *
 * The official client pulls a large dependency tree to wrap what is one
 * form-encoded POST with basic auth. `fetch` is built in, so this is the whole
 * integration.
 *
 * `server-only` at the top is load-bearing: it makes the build fail if this file
 * is ever imported from a client component, which is the mistake that would leak
 * MAILGUN_API_KEY into the browser bundle.
 */

type SendArgs = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
};

export type SendResult = { ok: true } | { ok: false; reason: string };

export async function sendMail({ to, subject, text, replyTo }: SendArgs): Promise<SendResult> {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const host = process.env.MAILGUN_HOST || "api.mailgun.net";

  if (!key || !domain) {
    // Not configured (local dev, or a deploy missing its env). The caller still
    // reports success to the visitor — their enquiry is in the server log and
    // losing the lead is worse than a silent misconfiguration, which monitoring
    // should catch separately.
    return { ok: false, reason: "mailgun-not-configured" };
  }

  const body = new URLSearchParams({
    from: `Reelative Media <no-reply@${domain}>`,
    to,
    subject,
    text,
  });
  if (replyTo) body.set("h:Reply-To", replyTo);

  try {
    const res = await fetch(`https://${host}/v3/${domain}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      // A form submit should not hang on a slow upstream. Ten seconds is well
      // past Mailgun's normal response and well inside a visitor's patience.
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, reason: `mailgun-${res.status}: ${detail.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `mailgun-network: ${err instanceof Error ? err.message : String(err)}` };
  }
}
