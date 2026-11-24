import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HowSteps } from "@/components/visuals/HowSteps";
import { BrandSvg } from "@/components/brand/BrandSvg";

export async function HowItWorks() {
  const t = await getTranslations("how");
  return (
    <section id="how" aria-labelledby="how-title" className="on-dark section-y relative bg-ink text-paper">
      <div className="container-text">
        <SectionHeader id="how-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} />
        <HowSteps
          steps={t.raw("steps") as { number: string; title: string; body: string }[]}
          v={t.raw("visuals") as Record<string, string | string[]>}
          progressLabel={t("progressLabel")}
          symbol={<BrandSvg file="anafor-symbol-white.svg" decorative />}
        />
        <p className="ui-label mt-20 border-t border-paper/15 pt-8 text-teal-light md:mt-28">
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
