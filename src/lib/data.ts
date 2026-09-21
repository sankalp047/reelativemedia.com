/**
 * All site copy and data. Source of truth: "REELATIVE MEDIA - CLIENT PITCH" deck
 * (20 slides, PDF received 16 Sep 2026). Anything marked PLACEHOLDER is not real.
 */

export type Category =
  | "Restaurants"
  | "Medical & Dental"
  | "Jewelry & Retail"
  | "Real Estate"
  | "Professional Services";

export const CATEGORIES: Category[] = [
  "Restaurants",
  "Medical & Dental",
  "Jewelry & Retail",
  "Real Estate",
  "Professional Services",
];

export type Reel = {
  id: string;
  client: string;
  city: string;
  category: Category;
  views?: string;
  duration: string;
  src: string;
  poster: string;
  placeholder: boolean;
};

/**
 * PLACEHOLDER REELS. Every entry below is a generated gradient clip, not client work.
 * Replace `src`/`poster` with re-encoded client reels (mp4 9:16 < 6 MB + jpg/webp poster)
 * and set `placeholder: false`.
 */
export const REELS: Reel[] = [
  { id: "01", client: "Restaurant client", city: "Frisco", category: "Restaurants", views: "1.2M views", duration: "00:22", src: "/video/reel-01.mp4", poster: "/posters/reel-01.jpg", placeholder: true },
  { id: "02", client: "Dental clinic", city: "Plano", category: "Medical & Dental", views: "480K views", duration: "00:31", src: "/video/reel-02.mp4", poster: "/posters/reel-02.jpg", placeholder: true },
  { id: "03", client: "Jewelry boutique", city: "Irving", category: "Jewelry & Retail", views: "2.1M views", duration: "00:18", src: "/video/reel-03.mp4", poster: "/posters/reel-03.jpg", placeholder: true },
  { id: "04", client: "Real estate team", city: "Prosper", category: "Real Estate", duration: "00:44", src: "/video/reel-04.mp4", poster: "/posters/reel-04.jpg", placeholder: true },
  { id: "05", client: "Law office", city: "Dallas", category: "Professional Services", views: "210K views", duration: "00:27", src: "/video/reel-05.mp4", poster: "/posters/reel-05.jpg", placeholder: true },
  { id: "06", client: "Chaat house", city: "Richardson", category: "Restaurants", views: "890K views", duration: "00:15", src: "/video/reel-06.mp4", poster: "/posters/reel-06.jpg", placeholder: true },
  { id: "07", client: "Med spa", city: "Southlake", category: "Medical & Dental", duration: "00:29", src: "/video/reel-07.mp4", poster: "/posters/reel-07.jpg", placeholder: true },
  { id: "08", client: "Bridal retailer", city: "Carrollton", category: "Jewelry & Retail", views: "1.6M views", duration: "00:21", src: "/video/reel-08.mp4", poster: "/posters/reel-08.jpg", placeholder: true },
  { id: "09", client: "Mortgage advisor", city: "McKinney", category: "Real Estate", duration: "00:36", src: "/video/reel-09.mp4", poster: "/posters/reel-09.jpg", placeholder: true },
  { id: "10", client: "CPA firm", city: "Irving", category: "Professional Services", views: "95K views", duration: "00:40", src: "/video/reel-10.mp4", poster: "/posters/reel-10.jpg", placeholder: true },
  { id: "11", client: "Biryani kitchen", city: "Plano", category: "Restaurants", views: "3.4M views", duration: "00:12", src: "/video/reel-11.mp4", poster: "/posters/reel-11.jpg", placeholder: true },
  { id: "12", client: "Pediatric dentist", city: "Frisco", category: "Medical & Dental", views: "320K views", duration: "00:25", src: "/video/reel-12.mp4", poster: "/posters/reel-12.jpg", placeholder: true },
];

/* ------------------------------------------------------------------ */
/* Business types we make content for                                  */
/* ------------------------------------------------------------------ */

export type Segment = {
  id: string;
  name: string;
  category: Category;
  reel: string;
  graphic: string;
  action: string;
  image: string;
};

/**
 * Pre-launch, the homepage shows the kinds of business Reelative makes content
 * for rather than a portfolio it does not have yet. The imagery is subject and
 * mood photography (interiors and objects, never people) so it cannot be
 * mistaken for delivered client work. Swap this for real reels once the first
 * shoots land.
 */
export const SEGMENTS: Segment[] = [
  { id: "restaurants", name: "Restaurants", category: "Restaurants",
    reel: "Dish reveal or chef story", graphic: "Weekend offer", action: "Reserve or visit",
    image: "/images/segments/restaurants.webp" },
  { id: "cafes", name: "Chaat houses & caf\u00e9s", category: "Restaurants",
    reel: "The counter at rush hour", graphic: "New item drop", action: "Order or visit",
    image: "/images/segments/cafes.webp" },
  { id: "dental", name: "Dental practices", category: "Medical & Dental",
    reel: "The dentist answers one FAQ", graphic: "Service explainer", action: "Book an appointment",
    image: "/images/segments/dental.webp" },
  { id: "medspa", name: "Med spas & aesthetics", category: "Medical & Dental",
    reel: "A treatment explained end to end", graphic: "Package or seasonal offer", action: "Book a consultation",
    image: "/images/segments/medspa.webp" },
  { id: "jewellery", name: "Jewellery stores", category: "Jewelry & Retail",
    reel: "Product close-up or craftsmanship", graphic: "Collection launch", action: "Visit or message",
    image: "/images/segments/jewellery.webp" },
  { id: "bridal", name: "Bridal & occasion wear", category: "Jewelry & Retail",
    reel: "Fitting-room reveal", graphic: "Season lookbook", action: "Book an appointment",
    image: "/images/segments/bridal.webp" },
  { id: "realestate", name: "Real estate teams", category: "Real Estate",
    reel: "Property tour or local insight", graphic: "Buyer or seller tip", action: "Schedule a consultation",
    image: "/images/segments/realestate.webp" },
  { id: "mortgage", name: "Mortgage & lending", category: "Real Estate",
    reel: "One question answered plainly", graphic: "Rate or checklist card", action: "Get pre-approved",
    image: "/images/segments/mortgage.webp" },
  { id: "law", name: "Law firms", category: "Professional Services",
    reel: "Expert answers a real question", graphic: "Myth versus fact", action: "Call or submit a lead",
    image: "/images/segments/law.webp" },
  { id: "accounting", name: "Accounting & tax", category: "Professional Services",
    reel: "One deadline explained", graphic: "Filing checklist", action: "Book a call",
    image: "/images/segments/accounting.webp" },
];

export const SEGMENTS_NOTE =
  "Concepts for the businesses we serve. Your shoot becomes the first real set.";

/**
 * PLACEHOLDER client logos. The marquee row that used these was removed on
 * 17 Sep 2026 — placeholder chips read as filler next to real brand names.
 * Kept here so the row can be restored once real client SVGs arrive.
 */
export const CLIENT_LOGOS = Array.from({ length: 8 }, (_, i) => ({
  id: `client-${i + 1}`,
  label: `Client logo ${String(i + 1).padStart(2, "0")}`,
}));

/** The FunAsia Network brands, as shown on the deck's "FunAsia advantage" slide. Logos pending. */
/* Each station's own site. These were all pointing at funasia.net as a
   placeholder; every href below was checked and returns 200 with no redirect.
   Radio Caravan is the exception — no separate site was supplied for it, so it
   still resolves to the network. Swap it when there is one. */
export const FUNASIA_BRANDS = [
  { id: "funasia", name: "FunAsia", meta: "Radio · Social · Events", href: "https://www.funasia.net/" },
  { id: "sangam", name: "Radio Sangam", meta: "104.1 FM · 104.9 FM HD4", href: "https://telugusangam.net/" },
  { id: "vanakkam", name: "Vanakkam FM", meta: "104.9 FM HD2", href: "https://vanakkamfm.net/" },
  { id: "caravan", name: "Radio Caravan", meta: "DFW", href: "https://www.funasia.net/" },
  { id: "apna-punjab", name: "Apna Punjab", meta: "104.9 FM HD3", href: "https://apnapunjab.net/" },
] as const;

/* ------------------------------------------------------------------ */
/* The opportunity + the problem                                       */
/* ------------------------------------------------------------------ */

export const OPPORTUNITY = {
  stat: "8.5M",
  statLabel: "people in the DFW metro",
  line: "Make sure they remember your business when they are ready to act.",
  points: [
    {
      title: "Platform reach is growing",
      body: "Share of U.S. adults using each platform continues to grow. Your audience is already there.",
    },
    {
      title: "One story, every platform",
      body: "One story can now travel across Instagram, Facebook, YouTube, TikTok, Google and WhatsApp.",
    },
  ],
} as const;

export const PROBLEMS = [
  { title: "No time", body: "Posting gets pushed behind customers, staff and operations." },
  { title: "No system", body: "Ideas, footage, approvals and publishing live in different places." },
  { title: "No clear story", body: "The feed looks busy but does not build trust or drive action." },
  { title: "No useful reporting", body: "Views arrive without an explanation of what to repeat or change." },
] as const;

export const PROBLEM_CALLOUT = "Reelative Media gives you the team, calendar and rhythm to stay visible every month.";

/* ------------------------------------------------------------------ */
/* The system                                                          */
/* ------------------------------------------------------------------ */

export const SYSTEM_STEPS = [
  {
    n: "01",
    title: "Strategy call",
    body: "Offers, priorities, audience and content angles.",
    detail: "A month planned as four weeks, seven days each, before anyone picks up a camera.",
    visual: "checklist",
  },
  {
    n: "02",
    title: "Planned shoot",
    body: "People, products, demonstrations and customer moments.",
    detail: "One shoot day works from a 12-shot list across those four categories.",
    visual: "shotlist",
  },
  {
    n: "03",
    title: "Month of assets",
    body: "Reels, graphics, captions and platform variants.",
    detail: "Every reel is cut for Instagram, Facebook and YouTube before it is scheduled.",
    visual: "grid",
  },
  {
    n: "04",
    title: "Clear scorecard",
    body: "What worked, what changed and what comes next.",
    detail: "Each piece is sorted into keep, stop, test or amplify for the next month.",
    visual: "chart",
  },
] as const;

export const SYSTEM_CLOSING = "One strategist. One calendar. One approval window.";

export const WEEKS = [
  { n: "01", title: "Plan", body: "Themes, scripts, shot list and calendar." },
  { n: "02", title: "Capture", body: "On-site shoot and first edit batch." },
  { n: "03", title: "Publish", body: "Approved assets go live and campaigns begin." },
  { n: "04", title: "Learn", body: "Results review and next-month priorities." },
] as const;

export const SERVICE_RHYTHM = ["48-hour client approval", "First edits within 3 business days", "Two revision rounds"] as const;

export const SERVICES = [
  {
    key: "create",
    title: "Create",
    tint: "violet",
    items: ["Short-form reels", "Motion and static graphics", "Scripts and captions", "Multilingual adaptations"],
  },
  {
    key: "distribute",
    title: "Distribute",
    tint: "magenta",
    items: ["Instagram and Facebook", "YouTube Shorts", "TikTok where suitable", "Google and WhatsApp assets"],
    platforms: ["IG", "FB", "YT", "TT", "G", "WA"],
  },
  {
    key: "amplify",
    title: "Amplify",
    tint: "orange",
    items: ["Paid social campaigns", "Landing pages and lead tracking", "FunAsia radio and social", "Events and creator partnerships"],
  },
] as const;

export const SERVICES_CALLOUT = "Start with consistent content. Add media only where it improves the business result.";

/* ------------------------------------------------------------------ */
/* Content strategy + examples                                         */
/* ------------------------------------------------------------------ */

export const CONTENT_JOBS = [
  { icon: "educate", title: "Educate", body: "Answer the questions customers ask before they buy.", tags: ["Tips", "FAQs", "How-to"] },
  { icon: "prove", title: "Prove", body: "Show the quality, process and people behind the business.", tags: ["Demos", "Reviews", "Results"] },
  { icon: "promote", title: "Promote", body: "Give the audience a timely reason to visit, call or message.", tags: ["Offers", "Launches", "Events"] },
  { icon: "humanize", title: "Humanize", body: "Build familiarity with the owners, team and community.", tags: ["Stories", "Culture", "Moments"] },
] as const;

export const CONTENT_JOBS_CALLOUT = "The monthly calendar balances all four, so the brand remains useful, credible, timely and human.";

export const CONTENT_EXAMPLES = [
  { business: "Restaurant", reel: "Dish reveal or chef story", graphic: "Weekend offer", action: "Reserve or visit" },
  { business: "Medical / dental", reel: "Doctor answers one FAQ", graphic: "Service explainer", action: "Book an appointment" },
  { business: "Jewelry / retail", reel: "Product close-up or craftsmanship", graphic: "Launch or seasonal collection", action: "Visit or message" },
  { business: "Real estate", reel: "Property tour or local insight", graphic: "Buyer / seller tip", action: "Schedule a consultation" },
  { business: "Professional services", reel: "Expert answers a real question", graphic: "Checklist or myth vs. fact", action: "Call or submit a lead" },
] as const;

export const CONTENT_EXAMPLES_QUOTE =
  "The strongest content comes from the real questions, products, people and moments already inside your business.";

/* ------------------------------------------------------------------ */
/* Results                                                             */
/* ------------------------------------------------------------------ */

/**
 * The results strip that used these was removed on 17 Sep 2026: two of the four
 * numbers were still `[X]` placeholders, which read worse than showing nothing.
 * The two real facts (3 days to first edits, 48-hour approval) still appear on
 * /system as SERVICE_RHYTHM. Kept so the strip can return with real numbers.
 */
export type Stat = {
  value: number | null;
  prefix?: string;
  suffix: string;
  label: string;
  placeholder?: boolean;
};

export const STATS: Stat[] = [
  { value: null, suffix: "M", label: "views generated for clients", placeholder: true },
  { value: null, suffix: "+", label: "reels delivered", placeholder: true },
  { value: 3, suffix: " days", label: "first edits after capture" },
  { value: 48, suffix: " hr", label: "client approval window" },
];

export const SCORECARD = [
  { title: "Attention", items: ["Reach", "Views", "Watch-through"] },
  { title: "Engagement", items: ["Shares", "Saves", "Comments"] },
  { title: "Action", items: ["Clicks", "Calls", "Messages and leads"] },
  { title: "Business", items: ["Appointments", "Visits", "Sales when tracked"] },
] as const;

export const SCORECARD_CALLOUT = "No dashboard overload. Your strategist explains what to keep, stop, test and amplify next month.";

/** PLACEHOLDER testimonials. Three filmed client testimonials are required before launch. */
export const TESTIMONIALS = [
  {
    id: "t1",
    quote: "Placeholder quote. Real testimonial to be filmed with a restaurant owner.",
    name: "Owner name",
    business: "Restaurant",
    city: "Frisco, TX",
    language: "English",
    src: "/video/testimonial-01.mp4",
    poster: "/posters/testimonial-01.jpg",
  },
  {
    id: "t2",
    quote: "Placeholder quote. Real testimonial to be filmed with a clinic director.",
    name: "Owner name",
    business: "Dental clinic",
    city: "Plano, TX",
    language: "Hindi · English subtitles",
    src: "/video/testimonial-02.mp4",
    poster: "/posters/testimonial-02.jpg",
  },
  {
    id: "t3",
    quote: "Placeholder quote. Real testimonial to be filmed with a retail owner.",
    name: "Owner name",
    business: "Jewelry boutique",
    city: "Irving, TX",
    language: "English",
    src: "/video/testimonial-03.mp4",
    poster: "/posters/testimonial-03.jpg",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Packages (deck slide 9) + optional services (slide 10)              */
/* ------------------------------------------------------------------ */

export const PACKAGE_ROWS = [
  { key: "reels", label: "Reels" },
  { key: "graphics", label: "Graphics" },
  { key: "capture", label: "Content capture" },
  { key: "paid", label: "Paid campaigns" },
  { key: "boost", label: "FunAsia boost · radio" },
] as const;

export type PackageRowKey = (typeof PACKAGE_ROWS)[number]["key"];

export type Package = {
  slug: string;
  name: string;
  price: string;
  highlighted?: boolean;
  rows: Record<PackageRowKey, string>;
};

/** Reel counts are shown exactly as the deck states them ("2 + 1"). */
export const PACKAGES: Package[] = [
  {
    slug: "launch",
    name: "Launch",
    price: "$995",
    rows: { reels: "2 + 1", graphics: "4", capture: "Guided / quarterly", paid: "Add-on", boost: "Add-on" },
  },
  {
    slug: "growth",
    name: "Growth",
    price: "$1,750",
    rows: { reels: "3 + 1", graphics: "8", capture: "1 local shoot", paid: "Add-on", boost: "Add-on" },
  },
  {
    slug: "scale",
    name: "Scale",
    price: "$2,950",
    highlighted: true,
    rows: { reels: "4 + 2", graphics: "10", capture: "1 local shoot", paid: "Managed", boost: "Add-on" },
  },
  {
    slug: "smart-reach",
    name: "Smart Reach",
    price: "$3,950",
    rows: { reels: "5 + 2", graphics: "12", capture: "1 local shoot", paid: "Managed", boost: "Included in package" },
  },
  {
    slug: "accelerate",
    name: "Accelerate",
    price: "$5,950",
    rows: { reels: "6 + 1 podcast", graphics: "12", capture: "2 local shoots", paid: "Managed", boost: "Included in package" },
  },
];

export const PACKAGE_FINE_PRINT = ["6-month minimum", "Ad spend and premium radio and media inventory quoted separately"] as const;

export const ADDONS = [
  { name: "Extra reel", price: "$200" },
  { name: "Half-day local shoot", price: "$650" },
  { name: "Landing page", price: "$1,250+" },
  { name: "Local SEO + review support", price: "$500/mo" },
  { name: "Paid media management", price: "15% / $500 min" },
  { name: "Multilingual adaptation", price: "$95/asset" },
] as const;

export const ADDONS_CALLOUT = "Also available: FunAsia radio campaigns, social amplification, event activations and creator partnerships.";

/** Deck slides 15–17: "Expanded services, available as upcharge add-ons." */
export const EXPANDED_SERVICES = [
  {
    key: "growth",
    title: "Growth & conversion services",
    tagline: "Turn attention into revenue.",
    items: [
      { icon: "trend", title: "Lead conversion & sales growth", body: "Targeted funnels, CRM integration and follow-up sequences designed to turn leads into paying customers." },
      { icon: "people", title: "Social media & brand community management", body: "Full-service account management, community engagement and brand voice consistency across all platforms." },
      { icon: "cart", title: "E-commerce marketing & sales growth", body: "Product-focused campaigns, retargeting and conversion optimization to drive online sales." },
      { icon: "bars", title: "Performance lead generation", body: "Data-driven paid campaigns built to generate qualified leads at a measurable cost per acquisition." },
    ],
  },
  {
    key: "presence",
    title: "Digital presence services",
    tagline: "Build the foundation your brand deserves.",
    items: [
      { icon: "globe", title: "Website design & development", body: "Custom-built, mobile-optimized websites designed to convert visitors into customers." },
      { icon: "search", title: "SEO & search visibility", body: "On-page optimization, local SEO and content strategy to rank where your customers are searching." },
      { icon: "star", title: "Online reputation management", body: "Monitor, respond and build your brand's review presence across Google, Yelp and social platforms." },
      { icon: "video", title: "Video production & video advertising", body: "High-quality video assets for ads, websites and social, produced and optimized for maximum impact." },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/* Recommended start + onboarding                                      */
/* ------------------------------------------------------------------ */

export const NINETY_DAYS = [
  { days: "Days 1–30", title: "Foundation", body: "Brand and channel audit, content themes, first shoot, publishing rhythm." },
  { days: "Days 31–60", title: "Optimization", body: "Repeat winning formats, test hooks and offers, refine publishing times, build engagement." },
  { days: "Days 61–90", title: "Growth", body: "Amplify top content, launch paid tests, track calls and leads, plan the next quarter." },
] as const;

export const NINETY_DAYS_CALLOUT = "By day 90, your business has a repeatable content system and real performance evidence.";

export const ONBOARDING = [
  { title: "Choose your package", body: "Select the monthly output and channels that match your goals." },
  { title: "Complete the brand profile", body: "Share offers, audience, voice, visual assets and approvals." },
  { title: "Connect the channels", body: "Provide secure access to the agreed social and analytics accounts." },
  { title: "Approve the first calendar", body: "Confirm the themes, scripts, shoot date and publishing rhythm." },
  { title: "Start creating", body: "Receive the first content batch within three business days of capture." },
] as const;

export const ONBOARDING_CALLOUT = "You continue running the business. Reelative runs the content system.";

/* ------------------------------------------------------------------ */
/* Why Reelative + why now                                             */
/* ------------------------------------------------------------------ */

export const WHY_REELATIVE = [
  { icon: "pin", title: "Local capture", body: "A DFW team that can come to your business and find the real story." },
  { icon: "globe", title: "Multicultural fluency", body: "Creative that understands language, culture and community context." },
  { icon: "radio", title: "Media amplification", body: "Access to FunAsia radio brands, social channels, talent and events." },
  { icon: "people", title: "One accountable team", body: "Strategy, production, publishing and reporting in one workflow." },
] as const;

export const WHY_NOW = {
  lead: {
    title: "The DFW market is moving fast",
    body: "8.5 million people. Growing platform adoption. Competitors posting daily. Every month without a content system is visibility left on the table.",
  },
  points: [
    {
      title: "Organic reach rewards consistency",
      body: "Algorithms favor accounts that publish regularly. A structured monthly system compounds in ways sporadic posting never can.",
    },
    {
      title: "Trust is built before the purchase",
      body: "Customers research before they buy. A credible, active social presence is now a prerequisite, not a bonus.",
    },
    {
      title: "Paid media works better with great content",
      body: "Ad spend goes further when the creative is strong. Organic content builds the asset library that makes paid campaigns more effective.",
    },
  ],
} as const;

export const BUSINESS_TYPES = [
  "Restaurant",
  "Medical / Dental",
  "Jewelry / Retail",
  "Real Estate",
  "Professional Services",
  "Other",
];
