import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Evidence } from "@/components/sections/Evidence";
import { Leaders } from "@/components/sections/Leaders";
import { Results } from "@/components/sections/Results";
import { Trust } from "@/components/sections/Trust";
import { Pricing } from "@/components/sections/Pricing";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <HowItWorks />
        <Evidence />
        <Leaders />
        <Results />
        <Trust />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
