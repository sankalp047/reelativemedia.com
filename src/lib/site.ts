export const SITE = {
  name: "Reelative Media",
  title: "Reelative Media — Short-form content and social media for DFW businesses",
  description:
    "Short-form reels, smarter distribution and measurable growth for Dallas–Fort Worth businesses. A FunAsia Network company.",
  url: "https://reelativemedia.com",
  phone: "469-424-3188",
  phoneTel: "tel:+14694243188",
  phoneE164: "+1-469-424-3188",
  email: "hello@reelativemedia.com",
  /** Where enquiries actually land. Shown on the page as the direct-email option
   *  and used as the fallback recipient if LEAD_INBOX is unset. */
  salesEmail: "sales@funasia.net",
  address: "Dallas–Fort Worth, Texas",
} as const;

/* The site is a single page, so these are in-page anchors rather than routes,
   with one exception flagged `external` below.
   Button/FooterLink switch on the leading "/" to decide between client-side
   navigation and a plain anchor, and a plain anchor is what lets Lenis
   smooth-scroll to the section. "About" is gone because the landing page has no
   About section; FunAsia is the nearest thing and already has its own entry. */
export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "System", href: "#system" },
  { label: "Packages", href: "#packages" },
  /* The one nav item that leaves the site. www., not the bare domain: bare
     funasia.net answers with a 301 to www, so linking it costs every visitor a
     redirect for nothing. Matches the footer's station links. */
  { label: "FunAsia", href: "https://www.funasia.net/", external: true },
] as const;

/** Every indexable route, used by the sitemap. One page, one entry. */
export const ROUTES = ["/"] as const;
