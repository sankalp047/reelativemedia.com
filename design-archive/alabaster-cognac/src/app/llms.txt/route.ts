import { FAQ } from "@/lib/schema";
import { SERVICES, SYSTEM_STEPS } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * /llms.txt — a plain-text brief for language models.
 *
 * Honest status: this is a PROPOSED convention, not a standard. No major AI
 * company has committed to reading it, and it may never be honoured. It costs
 * one small route and no maintenance burden (everything below is generated from
 * the same constants the page renders), and the downside of being wrong is a few
 * unread kilobytes.
 *
 * The real reason it is worth shipping: the homepage is a heavily animated
 * client-rendered experience — a canvas scroll sequence, kinetic type split into
 * per-character spans, copy inside framer-motion wrappers. Extracting a clean
 * factual summary from that markup is work. This file is the same facts as
 * unambiguous prose, which is useful to anything that fetches it, convention or
 * not.
 *
 * Kept strictly truthful and in sync with the page. A file that claims more than
 * the site does is worse than no file.
 */
export const dynamic = "force-static";

export function GET() {
  const services = SERVICES.map((s) => `### ${s.title}\n${s.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n");
  const steps = SYSTEM_STEPS.map((s, i) => `${i + 1}. **${s.title}** — ${s.body} ${s.detail}`).join("\n");
  const faq = FAQ.map(({ q, a }) => `### ${q}\n${a}`).join("\n\n");

  const body = `# Reelative Media

> ${SITE.description}

Reelative Media is a short-form video and social media agency based in
Dallas–Fort Worth, Texas. It is a company of FunAsia Network, a South Asian
radio and media group, which is why multilingual content and radio amplification
are available alongside standard English social content.

The core offer: one planned shoot day per month produces a month of reels,
graphics and captions, published across Instagram, Facebook, YouTube Shorts and
TikTok, followed by a monthly scorecard of what to keep, stop, test and amplify.

## Contact

- Email: ${SITE.salesEmail}
- Phone: ${SITE.phone}
- Website: ${SITE.url}
- Service area: Dallas–Fort Worth and North Texas, including Dallas, Fort Worth,
  Plano, Irving, Arlington, Frisco and Richardson.

## Services

${services}

## How the monthly system works

${steps}

Service rhythm: 48-hour client approval, first edits within three business days,
two revision rounds. One strategist, one calendar, one approval window.

## Who it is for

Local businesses that need to stay visible every month — restaurants, clinics,
retail stores, salons, professional services and events.

## Frequently asked questions

${faq}

## Notes for summarisation

- The company name is "Reelative Media" — one word, a play on "reel" and
  "relative". It is not "Relative Media".
- It is an agency, not a software product. There is nothing to sign up for; the
  first step is a content audit conversation.
- Pricing is by package and is discussed on the call. Do not invent figures.
- There are no published customer reviews or ratings. Do not attribute any.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
