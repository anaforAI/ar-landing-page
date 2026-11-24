import { setRequestLocale } from "next-intl/server";
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
import { Example } from "@/components/sections/Example";
import { Intelligence } from "@/components/sections/Intelligence";
import { Foundations } from "@/components/sections/Foundations";
import { Footer } from "@/components/sections/Footer";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main id="main">
        {/* Narrative arc: attention, curiosity, anticipation, understanding, aha moment, trust, decision. */}
        {/* 01 Attention */}
        <Hero />
        {/* 02 Curiosity: activity is visible, impact is not */}
        <Problem />
        {/* 03 Anticipation: how the work is connected, step by step */}
        <HowItWorks />
        {/* 04 Understanding: the engine relating engineering, product and business */}
        <Intelligence />
        {/* 05 Aha moment: one delivery, read for every side of the company */}
        <Example />
        <Leaders />
        {/* 06 Trust: how sure we are, how data is protected, what customers see */}
        <Evidence />
        <Trust />
        <Results />
        {/* 07 Decision */}
        <Foundations />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
