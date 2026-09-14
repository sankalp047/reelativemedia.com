import { Nav } from "@/components/home/Nav";
import { Hero } from "@/components/home/Hero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { Work } from "@/components/home/Work";
import { Statement } from "@/components/home/Statement";
import { System } from "@/components/home/System";
import { Services } from "@/components/home/Services";
import { Proof } from "@/components/home/Proof";
import { Packages } from "@/components/home/Packages";
import { FunAsia } from "@/components/home/FunAsia";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative">
        <Hero />
        <TrustMarquee />
        <Work />
        <Statement />
        <System />
        <Services />
        <Proof />
        <Packages />
        <FunAsia />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
