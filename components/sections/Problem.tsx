import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Fragments } from "@/components/visuals/Fragments";

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
    </section>
  );
}
