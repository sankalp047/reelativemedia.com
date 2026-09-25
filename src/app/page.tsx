import { Hero } from "@/components/home/Hero";
import { Segments } from "@/components/home/Segments";
import { System } from "@/components/home/System";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { FilmStrip } from "@/components/home/FilmStrip";
import { Packages } from "@/components/home/Packages";
import { FunAsia } from "@/components/home/FunAsia";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      {/* The reels, straight after the hero. This slot held the "Consistency
          and creativity" statement, which was removed on request. Segments is a
          SERVER component: it reads the live video list from Cloudflare Stream
          and falls back to the committed list if that call fails. */}
      <Segments />
      <System />
      <WhatWeDo />
      <FilmStrip />
      {/* The "04 — Results" band is PARKED, not deleted. It held three
          hardcoded client reels, and all three now come from Cloudflare and
          play from the carousel near the top of the page, so this section was
          showing the same videos a second time. The component is untouched in
          src/components/home/Proof.tsx — restore it by uncommenting this line
          and its import. */}
      {/* <Proof /> */}
      <Packages />
      <FunAsia />
      <FinalCTA />
    </main>
  );
}
