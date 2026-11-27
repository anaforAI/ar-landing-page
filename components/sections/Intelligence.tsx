import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Em } from "@/components/ui/Em";
import { BrandSvg } from "@/components/brand/BrandSvg";
import { EngineExplorer, type Capability } from "@/components/visuals/EngineExplorer";
import type { EngineLabels } from "@/components/visuals/EngineVisual";

export async function Intelligence() {
  const t = await getTranslations("intelligence");
  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-title"
      className="on-dark relative overflow-hidden bg-ink pb-20 text-paper lg:pb-36"
    >
      {/* Follows How it works (also dark): a hairline separates the two chapters. */}
      <div className="container-text border-t border-paper/12 pt-20 lg:pt-36">
        <SectionHeader
          id="intelligence-title"
          eyebrow={t("eyebrow")}
          title={t.raw("title") as string}
          body={t("body")}
        />

        <EngineExplorer
          capabilities={t.raw("capabilities") as Capability[]}
          labels={t.raw("domains") as EngineLabels}
          listLabel={t("capabilitiesLabel")}
          stageLabel={t("stageLabel")}
          introSteps={t.raw("introSteps") as string[]}
          pauseLabel={t("pause")}
          playLabel={t("play")}
          symbol={<BrandSvg file="anafor-symbol-white.svg" decorative />}
        />

        <div className="mt-24 border-t border-paper/12 pt-16 md:mt-32 md:pt-24">
          <Reveal>
            <p className="display h-section max-w-[980px]">
              <Em source={t.raw("closing") as string} />
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead mt-8 max-w-[640px]">{t("closingBody")}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-12 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="ui-label text-paper/55">{t("purposeLabel")}</span>
            <span className="text-[17px] text-teal-light">{t("purpose")}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
