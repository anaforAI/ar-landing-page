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
        <Hero />
        <Problem />
        <Example />
        <HowItWorks />
        <Evidence />
        <Intelligence />
        <Leaders />
        <Results />
        <Trust />
        <Foundations />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
