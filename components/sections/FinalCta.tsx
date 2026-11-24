import { getTranslations } from "next-intl/server";
import { RevealHeading } from "@/components/motion/RevealHeading";
import { Reveal } from "@/components/motion/Reveal";
import { RequestAccessButton } from "@/components/ui/RequestAccess";

export async function FinalCta() {
  const t = await getTranslations("cta");
  return (
    <section aria-labelledby="cta-title" className="on-dark on-teal relative overflow-hidden bg-teal text-paper">
      {/* The lifted quarter, large and cropped in the corner. Geometry from the symbol (104 grid). */}
      <svg
        aria-hidden="true"
        viewBox="64 0 40 40"
        className="pointer-events-none absolute -right-[12%] -top-[22%] h-[520px] w-[520px] md:-right-[6%] md:-top-[30%] md:h-[760px] md:w-[760px]"
      >
        <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" fill="none" stroke="var(--anafor-teal-light)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="container-text relative py-28 md:py-44">
        <RevealHeading
          id="cta-title"
          source={t.raw("title") as string}
          className="display max-w-[900px] text-[clamp(3rem,1.8rem+5vw,6rem)] leading-[1.02]"
        />
        <Reveal delay={0.2} className="mt-12">
          <RequestAccessButton className="btn btn-cream">{t("button")}</RequestAccessButton>
        </Reveal>
      </div>
    </section>
  );
}
