import { Hero } from "@/components/home/Hero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { FilmStrip } from "@/components/home/FilmStrip";
import { Statement } from "@/components/home/Statement";
import { System } from "@/components/home/System";
import { WhatWeDo } from "@/components/home/WhatWeDo";
// import { Proof } from "@/components/home/Proof";
import { Packages } from "@/components/home/Packages";
import { FunAsia } from "@/components/home/FunAsia";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <TrustMarquee />
      <Statement />
      <System />
      <WhatWeDo />
      <FilmStrip />
      {/* Results is parked until there are real testimonials to show — all three
          cards are still "to be filmed" placeholders. To restore: uncomment the
          import and the line below, then set Packages back to "05 — Packages"
          and FunAsia back to "06 — The FunAsia advantage". */}
      {/* <Proof /> */}
      <Packages />
      <FunAsia />
      <FinalCTA />
    </main>
  );
}
