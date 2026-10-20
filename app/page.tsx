import { Nav } from "@/components/layout/nav";
import { StickyBar } from "@/components/layout/sticky-bar";
import { Footer, FloatingWhatsApp } from "@/components/layout/footer";
import { Enhancements } from "@/components/enhancements";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { Preloader } from "@/components/preloader";
import { ProofBand } from "@/components/sections/proof-band";
import { Credentials } from "@/components/sections/credentials";
import { Readings } from "@/components/sections/readings";
import { Problem } from "@/components/sections/problem";
import { Method } from "@/components/sections/method";
import { Baseline } from "@/components/sections/baseline";
import { Lab } from "@/components/sections/lab";
import { WhoWeHelp } from "@/components/sections/who-we-help";
import { Programmes } from "@/components/sections/programmes";
import { Founder } from "@/components/sections/founder";
import { FoundersProgramme } from "@/components/sections/founders-programme";
import { Results } from "@/components/sections/results";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Preloader />
      <a
        href="#main"
        className="sr-only z-[80] bg-orange px-4 py-3 font-medium text-carbon focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        {/* Proof first: who is behind it, then what clients get back. */}
        <ProofBand />
        <Founder />
        <Credentials />
        <Results />
        <Problem />
        <Method />
        <Baseline />
        <Lab />
        <Readings />
        <WhoWeHelp />
        <Programmes />
        <FoundersProgramme />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
      <FloatingWhatsApp />
      <Enhancements />
      <JsonLd />
    </>
  );
}
