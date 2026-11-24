import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { EvidenceChip } from "@/components/ui/EvidenceChip";
import { AssistantDemo } from "@/components/visuals/AssistantDemo";

type State = { key: "verified" | "inferred" | "hypothesis"; label: string; body: string; example: string };

export async function Evidence() {
  const t = await getTranslations("evidence");
  const tc = await getTranslations("common");
  const states = t.raw("states") as State[];
  const principles = t.raw("principles") as string[];
  const demo = t.raw("demo") as Record<string, unknown>;
  const labels = Object.fromEntries(states.map((s) => [s.key, s.label])) as Record<State["key"], string>;

  return (
    <section id="evidence" aria-labelledby="evidence-title" className="section-y relative border-t border-sand">
      <div className="container-text">
        <SectionHeader id="evidence-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} />

        <ul className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
          {states.map((s, i) => (
            <li key={s.key}>
              <Reveal delay={i * 0.08} className="card card-lift flex h-full flex-col p-7">
                <EvidenceChip state={s.key} label={s.label} />
                <p className="mt-5 text-[20px] font-medium leading-snug tracking-[-0.02em]">{s.body}</p>
                <p className="mt-auto pt-8 text-[15px] leading-[1.5] text-stone">
                  <span className="ui-label mb-2 block">e.g.</span>
                  {s.example}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <Reveal>
              <h3 className="eyebrow">{t("principlesLabel")}</h3>
            </Reveal>
            <ul className="mt-6 grid gap-3">
              {principles.map((p, i) => (
                <li key={p}>
                  <Reveal
                    delay={i * 0.08}
                    className="relative rounded-[8px] border border-sand bg-paper px-5 py-4 pr-10 text-[17px] leading-[1.45]"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="64 0 40 40"
                      className="absolute right-3 top-3 h-3 w-3 text-teal"
                      fill="currentColor"
                    >
                      <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
                    </svg>
                    {p}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={0.1}>
              <AssistantDemo demo={demo} stateLabels={labels} sampleLabel={tc("sampleData")} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
