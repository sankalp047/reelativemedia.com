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

/** PLACEHOLDER client logos. Replace with monochrome white SVGs. */
export const CLIENT_LOGOS = Array.from({ length: 8 }, (_, i) => ({
  id: `client-${i + 1}`,
  label: `Client logo ${String(i + 1).padStart(2, "0")}`,
}));

export const FUNASIA_BRANDS = [
  { id: "funasia", name: "FunAsia", meta: "Radio · Social · Events", href: "https://funasia.net" },
  { id: "sangam", name: "Radio Sangam", meta: "104.1 FM / 104.9 HD4", href: "https://funasia.net" },
  { id: "caravan", name: "Radio Caravan", meta: "DFW", href: "https://funasia.net" },
  { id: "vanakkam", name: "Vanakkam FM", meta: "104.9 HD2", href: "https://funasia.net" },
] as const;

export const SYSTEM_STEPS = [
  {
    n: "01",
    title: "Strategy call",
    body: "Offers, priorities, audience and content angles.",
    visual: "checklist",
  },
  {
    n: "02",
    title: "Planned shoot",
    body: "People, products, demonstrations and customer moments.",
    visual: "shotlist",
  },
  {
    n: "03",
    title: "Month of assets",
    body: "Reels, graphics, captions and platform variants.",
    visual: "grid",
  },
  {
    n: "04",
    title: "Clear scorecard",
    body: "What worked, what changed and what comes next.",
    visual: "chart",
  },
] as const;

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

export type Package = {
  name: string;
  price: string;
  highlighted?: boolean;
  lines: { label: string; value: string }[];
};

export const PACKAGES: Package[] = [
  {
    name: "Launch",
    price: "$995",
    lines: [
      { label: "Reels", value: "4" },
      { label: "Graphics", value: "4" },
      { label: "Content capture", value: "Guided / quarterly" },
      { label: "Paid campaigns", value: "Add-on" },
      { label: "FunAsia boost", value: "Add-on" },
    ],
  },
  {
    name: "Growth",
    price: "$1,750",
    lines: [
      { label: "Reels", value: "8" },
      { label: "Graphics", value: "8" },
      { label: "Content capture", value: "1 local shoot" },
      { label: "Paid campaigns", value: "Add-on" },
      { label: "FunAsia boost", value: "Add-on" },
    ],
  },
  {
    name: "Scale",
    price: "$2,950",
    highlighted: true,
    lines: [
      { label: "Reels", value: "12" },
      { label: "Graphics", value: "12" },
      { label: "Content capture", value: "2 local shoots" },
      { label: "Paid campaigns", value: "Managed" },
      { label: "FunAsia boost", value: "Add-on" },
    ],
  },
  {
    name: "Smart Reach",
    price: "$4,500",
    lines: [
      { label: "Reels", value: "16" },
      { label: "Graphics", value: "12" },
      { label: "Content capture", value: "2 local shoots" },
      { label: "Paid campaigns", value: "Managed" },
      { label: "FunAsia boost", value: "Included allowance" },
    ],
  },
];

export const ADDONS = [
  "Extra reel $200",
  "Half-day shoot $650",
  "Landing page $1,250+",
  "Local SEO + reviews $500/mo",
  "Paid media management 15% / $500 min",
  "Multilingual adaptation $95/asset",
];

export const BUSINESS_TYPES = [
  "Restaurant",
  "Medical / Dental",
  "Jewelry / Retail",
  "Real Estate",
  "Professional Services",
  "Other",
];
