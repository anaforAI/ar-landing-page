import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LeaderTabs, type LeaderTab } from "@/components/visuals/LeaderTabs";
import { Reveal } from "@/components/motion/Reveal";

export async function Leaders() {
  const t = await getTranslations("leaders");
  const tc = await getTranslations("common");
  const te = await getTranslations("evidence");
  const states = te.raw("states") as { key: string; label: string }[];
  return (
    <section id="leaders" aria-labelledby="leaders-title" className="section-y relative border-t border-sand">
      <div className="container-text">
        <SectionHeader id="leaders-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} />
        <Reveal className="mt-14 md:mt-20">
          <LeaderTabs
            tabs={t.raw("tabs") as LeaderTab[]}
            tabsLabel={t("tabsLabel")}
            sampleLabel={tc("sampleData")}
            stateLabels={Object.fromEntries(states.map((s) => [s.key, s.label]))}
          />
        </Reveal>
      </div>
    </section>
  );
}
