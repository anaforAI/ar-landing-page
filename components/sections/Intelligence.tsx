import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Em } from "@/components/ui/Em";

export async function Intelligence() {
  const t = await getTranslations("intelligence");
  const caps = t.raw("capabilities") as { name: string; body: string }[];
  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-title"
      className="on-dark section-y relative bg-ink text-paper"
    >
      <div className="container-text">
        <SectionHeader
          id="intelligence-title"
          eyebrow={t("eyebrow")}
          title={t.raw("title") as string}
          body={t("body")}
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[12px] bg-paper/12 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {caps.map((c, i) => (
            <li key={c.name} className="bg-ink">
              <Reveal delay={(i % 4) * 0.06} className="h-full p-6 md:p-7">
                <p className="ui-label text-teal-light">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 text-[19px] font-medium leading-snug tracking-[-0.01em]">{c.name}</h3>
                <p className="mt-3 text-[15px] leading-[1.5] text-paper/65">{c.body}</p>
              </Reveal>
            </li>
          ))}
          <li className="bg-teal">
            <Reveal delay={0.18} className="on-teal flex h-full items-end p-6 md:p-7">
              <p className="display text-[24px] leading-[1.2] text-paper">
                <Em source={t.raw("statement") as string} />
              </p>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}
