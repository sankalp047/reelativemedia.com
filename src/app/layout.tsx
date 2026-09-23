import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Parallax } from "@/components/ui/Parallax";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { SITE } from "@/lib/site";
import { Analytics } from "@/components/providers/Analytics";
import { buildGraph } from "@/lib/schema";

/**
 * Two families, one job each, four variable files — lighter than the single
 * two-axis Roboto Flex file this replaces.
 *
 * Newsreader is the VOICE: hero, page H1s, section headlines, the statement,
 * prices, the footer wordmark. Instrument Sans is everything a customer has to
 * read in order to buy something: body, ledes, card titles, table cells, nav,
 * buttons. The division is absolute — a price in Newsreader, its terms in
 * Instrument Sans. The moment package inclusions get set in the serif the site
 * becomes a lookbook and stops selling.
 *
 * Newsreader replaced Bodoni Moda, which was beautiful at 100px and tiring
 * everywhere else: a Didone's hairlines go spindly the moment the size drops,
 * which is why the old scale needed a hard 24px floor and a low-DPI weight
 * bump to survive. Newsreader is a variable text face with real optical sizes
 * from 6 to 72, so it holds its colour from a 12px label to a 188px hero
 * without either crutch — readable first, elegant second.
 *
 * Never pass a static `weight` array alongside `axes`: next/font throws
 * "Axes can only be defined for variable fonts when the weight property is
 * nonexistent or set to `variable`". `wght` is the default variable axis on
 * both families and is included automatically.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  // NOT --font-sans: that name collides with Tailwind v4's own @theme token.
  variable: "--font-sans-v",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: "%s · Reelative Media" },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: "Reelative Media",
    locale: "en_US",
    type: "website",
    images: [{ url: "/posters/hero-16x9.jpg", width: 1280, height: 720 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/posters/hero-16x9.jpg"],
  },
  // One page, so the canonical is unambiguous — but it still has to be stated,
  // or every ?utm_source= and ?fbclid= variant is a separate URL to a crawler.
  alternates: { canonical: "/" },
  keywords: [
    "short-form video agency Dallas",
    "social media agency Fort Worth",
    "Instagram Reels for restaurants DFW",
    "content marketing Dallas-Fort Worth",
    "video production for small business Texas",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show full text and video previews. The defaults truncate,
      // and a truncated snippet is a worse answer for an AI Overview to quote.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "Reelative Media", url: SITE.url }],
  creator: "Reelative Media",
  publisher: "FunAsia Network",
  category: "Marketing & Advertising",
};

export const viewport: Viewport = {
  // The nav bar is cloud, so the browser chrome above it matches the bar rather
  // than the page ground behind it.
  themeColor: "#F7F9FC",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${newsreader.variable} ${sans.variable} h-full`}>
      {/* NO bg-midnight / text-cloud utility here: globals.css already paints
          html and body midnight and sets the body type to cloud. As a class it
          made `.bg-midnight :focus-visible` match every focusable element on the
          site, so the focus ring was pink even on the light bands (2.94 on
          mist) and the violet-on-light rule never fired once. */}
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        {/* The custom cursor (a dot that grew into a labelled circle over
            anything carrying data-cursor) is gone, along with the `cursor: none`
            that hid the real pointer. It replaced a control every visitor
            already knows how to read with one only this site uses, and it
            lagged behind the real pointer position by design. The `data-cursor`
            attributes left on a few elements are inert. */}
        <Parallax />
        <div className="grain" aria-hidden="true" />
        <Analytics />
        {/* One @graph of connected entities — see src/lib/schema.ts. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildGraph()) }}
        />
      </body>
    </html>
  );
}
