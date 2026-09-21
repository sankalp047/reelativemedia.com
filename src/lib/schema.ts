import { FUNASIA_BRANDS, SERVICES, SYSTEM_STEPS } from "@/lib/data";
import { SITE } from "@/lib/site";

/**
 * JSON-LD for search engines and, increasingly, for the answer engines.
 *
 * Emitted as ONE @graph rather than several separate <script> blocks, so the
 * entities can reference each other by @id. A LocalBusiness that points at the
 * WebSite that points back at the same Organization is a connected description
 * of one business; three disconnected blobs are three guesses.
 *
 * Why it matters beyond blue links: an LLM answering "who does reels for
 * restaurants in Dallas" is extracting entities, not ranking pages. Explicit
 * areaServed, serviceType and a priced offer catalogue are the difference
 * between being summarised vaguely and being named with specifics.
 *
 * Keep this truthful. Marking up claims the page does not make is the fastest
 * way to get structured data ignored, and inventing a rating would be fraud —
 * there is deliberately no aggregateRating here, because there are no reviews.
 */

const ORG_ID = `${SITE.url}/#organization`;
const PARENT_ID = "https://www.funasia.net/#organization";
const SITE_ID = `${SITE.url}/#website`;
const BUSINESS_ID = `${SITE.url}/#localbusiness`;

/** The questions a prospect actually asks, answered in the page's own words. */
export const FAQ = [
  {
    q: "What does Reelative Media do?",
    a: "Reelative Media is a short-form video and social media agency in Dallas–Fort Worth. We plan, shoot and edit a month of reels, graphics and captions from a single shoot day, publish them across Instagram, Facebook, YouTube Shorts and TikTok, and report on what worked.",
  },
  {
    q: "How does one shoot produce a month of content?",
    a: "The stories are planned before the camera arrives. A strategy call sets the offers, audience and content angles, the shoot day works from a 12-shot list across people, products, demonstrations and customer moments, and every reel is then cut for Instagram, Facebook and YouTube before it is scheduled.",
  },
  {
    q: "Which areas do you serve?",
    a: "Dallas–Fort Worth and the surrounding North Texas metroplex, including Dallas, Fort Worth, Plano, Irving, Arlington, Frisco and Richardson.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "Local businesses that need to stay visible every month — restaurants, clinics, retail stores, salons, professional services and events.",
  },
  {
    q: "Do you offer multilingual content?",
    a: "Yes. Reelative Media is a FunAsia Network company, so South Asian language adaptations and distribution through FunAsia radio and social are available alongside English content.",
  },
  {
    q: "How do I get started?",
    a: `The first conversation is a practical content audit rather than a sales presentation. Email ${SITE.salesEmail}, call ${SITE.phone}, or leave a name and number on the site and a strategist calls back within one business day.`,
  },
];

export function buildGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        email: SITE.salesEmail,
        telephone: SITE.phoneE164,
        logo: { "@type": "ImageObject", url: `${SITE.url}/logo/reelative-media.png`, width: 1052, height: 240 },
        parentOrganization: { "@id": PARENT_ID },
        areaServed: { "@type": "Place", name: "Dallas–Fort Worth, Texas" },
        knowsAbout: [
          "short-form video production",
          "social media marketing",
          "Instagram Reels",
          "YouTube Shorts",
          "content strategy",
          "multilingual marketing",
        ],
      },
      {
        /* The parent as a real node with its stations as sameAs, not a bare
           name string. This is the cheapest fix available for an entity
           problem: "Reelative Media" currently collides in search with
           reelative.media, an unrelated video agency in Germany. Tying this
           one to a network of DFW radio stations that demonstrably exist is
           what separates the two for anything resolving the name. */
        "@type": "Organization",
        "@id": PARENT_ID,
        name: "FunAsia Network",
        url: "https://www.funasia.net/",
        description: "South Asian radio, social and events network serving Dallas–Fort Worth.",
        sameAs: [...new Set(FUNASIA_BRANDS.map((b) => b.href))],
        subOrganization: { "@id": ORG_ID },
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-US",
      },
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": BUSINESS_ID,
        name: SITE.name,
        description: SITE.description,
        url: SITE.url,
        telephone: SITE.phoneE164,
        email: SITE.salesEmail,
        image: `${SITE.url}/posters/hero-16x9.jpg`,
        priceRange: "$$",
        parentOrganization: { "@id": PARENT_ID },
        address: { "@type": "PostalAddress", addressRegion: "TX", addressCountry: "US", addressLocality: "Dallas–Fort Worth" },
        areaServed: [
          { "@type": "City", name: "Dallas" },
          { "@type": "City", name: "Fort Worth" },
          { "@type": "City", name: "Plano" },
          { "@type": "City", name: "Irving" },
          { "@type": "City", name: "Arlington" },
          { "@type": "City", name: "Frisco" },
          { "@type": "City", name: "Richardson" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Content services",
          itemListElement: SERVICES.map((s) => ({
            "@type": "OfferCatalog",
            name: s.title,
            itemListElement: s.items.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item, serviceType: item, provider: { "@id": ORG_ID } },
            })),
          })),
        },
      },
      {
        "@type": "Service",
        name: "Monthly short-form content programme",
        serviceType: "Short-form video production and social media management",
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Place", name: "Dallas–Fort Worth, Texas" },
        description:
          "One planned shoot day per month produces a month of reels, graphics and captions, distributed across Instagram, Facebook, YouTube Shorts and TikTok, with a monthly scorecard of what to keep, stop, test and amplify.",
      },
      {
        // Google retired FAQ rich results for most sites in 2023, so this is not
        // here for a SERP accordion. It is here because a question/answer pair is
        // the cleanest shape for an answer engine to lift verbatim, and the
        // markup makes the pairing explicit rather than inferred from headings.
        "@type": "FAQPage",
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "HowTo",
        name: "How the Reelative Media content system works",
        description: "Four steps from strategy call to monthly scorecard.",
        step: SYSTEM_STEPS.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: `${s.body} ${s.detail}`,
        })),
      },
    ],
  };
}
