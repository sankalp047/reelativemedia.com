import { Hero } from "@/components/home/Hero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { FilmStrip } from "@/components/home/FilmStrip";
import { Statement } from "@/components/home/Statement";
import { System } from "@/components/home/System";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { Proof } from "@/components/home/Proof";
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
      {/* Three client reels, video only. The quote/name/business captions that
          used to sit under each card were placeholder text and have been
          removed rather than invented — see the note on TESTIMONIALS in
          src/lib/data.ts for how to add real attribution back. */}
      <Proof />
      <Packages />
      <FunAsia />
      <FinalCTA />
    </main>
  );
}
