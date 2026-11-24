import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Fragments } from "@/components/visuals/Fragments";
import { ArrowRight } from "@/components/ui/icons";

export async function Problem() {
  const t = await getTranslations("problem");
  const voices = t.raw("voices") as { role: string; quote: string }[];
  const f = t.raw("fragments") as Record<string, string>;

  return (
    <section id="problem" aria-labelledby="problem-title" className="section-y relative">
      <div className="container-text">
        <SectionHeader id="problem-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} body={t("body")} />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[12px] border border-sand bg-sand md:mt-24 md:grid-cols-3">
          {voices.map((v, i) => (
            <li key={v.role} className="bg-paper">
              <Reveal delay={i * 0.08} className="h-full p-7 md:p-8">
                <p className="ui-label text-stone">{v.role}</p>
                <p className="display mt-5 text-[26px] leading-[1.2] md:text-[28px]">“{v.quote}”</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-wide mt-20 md:mt-32">
        <Fragments labels={f} />
      </div>

      {/* Curiosity gap: hand the question over to How it works. */}
      <div className="container-text mt-16 md:mt-24">
        <Reveal className="flex flex-col items-start gap-5 md:flex-row md:items-baseline md:justify-between">
          <p className="display max-w-[720px] text-[28px] leading-[1.2] md:text-[36px]">{t("bridge")}</p>
          <a href="#how" className="link-underline inline-flex min-h-[44px] shrink-0 items-center gap-2 text-[16px] font-medium">
            {t("bridgeLink")}
            <ArrowRight aria-hidden="true" width={16} height={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
