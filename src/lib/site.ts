export const SITE = {
  name: "Reelative Media",
  title: "Reelative Media — Short-form content and social media for DFW businesses",
  description:
    "Short-form reels, smarter distribution and measurable growth for Dallas–Fort Worth businesses. A FunAsia Network company.",
  url: "https://reelativemedia.com",
  phone: "469-424-3188",
  phoneTel: "tel:+14694243188",
  phoneE164: "+1-469-424-3188",
  /** The ONE address on the site. There used to be a second
   *  (hello@reelativemedia.com) shown only in the footer, which meant a visitor
   *  reading the footer wrote somewhere different from a visitor reading the
   *  contact section. Deleted rather than pointed at the same value, so the two
   *  cannot drift apart again. Also the fallback recipient if LEAD_INBOX is
   *  unset. */
  salesEmail: "sales@funasia.net",
  address: "Dallas–Fort Worth, Texas",
} as const;

/* The site is a single page, so these are in-page anchors rather than routes,
   with one exception flagged `external` below.
   Button/FooterLink switch on the leading "/" to decide between client-side
   navigation and a plain anchor, and a plain anchor is what lets Lenis
   smooth-scroll to the section. "About" is gone because the landing page has no
   About section; FunAsia is the nearest thing and already has its own entry. */
/** `external` is typed even though nothing uses it today: NavItem still knows
 *  how to render an off-site link with target and rel, and losing the type
 *  would mean the next person who adds one gets a silent `unknown`. */
export const NAV_LINKS: readonly { label: string; href: string; external?: boolean }[] = [
  { label: "Work", href: "#work" },
  { label: "System", href: "#system" },
  { label: "Packages", href: "#packages" },
  /* NOTHING IN THE NAV LEAVES THE SITE ANY MORE. A "FunAsia" item used to sit
     here linking to funasia.net, which sent visitors away from the page that is
     trying to win the enquiry. The network is still credited in its own section
     and throughout the footer, where it reads as provenance rather than an
     invitation to leave. */
];

/** Every indexable route, used by the sitemap. One page, one entry. */
export const ROUTES = ["/"] as const;
