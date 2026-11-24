import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { EvidenceChip, type EvidenceState } from "@/components/ui/EvidenceChip";
import { GithubMark } from "@/components/ui/icons";
import { Em } from "@/components/ui/Em";

type View = {
  key: string;
  label: string;
  audience: string;
  state: EvidenceState;
  items: string[];
  source: string;
};

/** A concrete example: one technical delivery, read for engineering, product and leadership. */
export async function Example() {
  const t = await getTranslations("example");
  const tc = await getTranslations("common");
  const te = await getTranslations("evidence");
  const states = te.raw("states") as { key: EvidenceState; label: string }[];
  const stateLabel = Object.fromEntries(states.map((s) => [s.key, s.label])) as Record<EvidenceState, string>;
  const views = t.raw("views") as View[];
  const deliverables = t.raw("deliverables") as { title: string; body: string }[];

  return (
    <section id="example" aria-labelledby="example-title" className="section-y border-t border-sand">
      <div className="container-text">
        <SectionHeader id="example-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} body={t("body")} />

        <Reveal className="mt-14 md:mt-20">
          <figure className="card overflow-hidden" aria-label={`${t("mockTitle")}, ${tc("sampleData")}`}>
            <div className="flex items-center justify-between gap-4 border-b border-sand px-5 py-3.5 md:px-7">
              <p className="text-[14px] font-medium tracking-[-0.01em]">{t("mockTitle")}</p>
              <span className="ui-label rounded-[4px] border border-sand px-2 py-1 text-stone">{tc("sampleData")}</span>
            </div>

            <div className="p-5 md:p-7">
              {/* The input: a plain technical delivery. */}
              <div className="rounded-[10px] bg-ink p-5 text-paper md:flex md:items-center md:justify-between md:gap-8 md:p-6">
                <div>
                  <p className="ui-label flex items-center gap-2 text-paper/60">
                    <GithubMark aria-hidden="true" width={14} height={14} />
                    {t("sourceLabel")} · {t("prMeta")}
                  </p>
                  <p className="mt-2 text-[18px] leading-snug tracking-[-0.01em] md:text-[20px]">{t("prTitle")}</p>
                </div>
                <p className="ui-label mt-4 shrink-0 text-paper/55 md:mt-0 md:max-w-[260px] md:text-right">
                  {t("prLinks")}
                </p>
              </div>

              <div className="flex items-center gap-3 py-5 pl-5 md:pl-6" aria-hidden="true">
                <span className="h-8 w-px bg-teal" />
                <span className="ui-label text-teal">{t("readsAs")}</span>
              </div>

              {/* The output: the same delivery, three readings. */}
              <ol className="grid gap-4 md:grid-cols-3">
                {views.map((v, i) => (
                  <li key={v.key}>
                    <Reveal delay={0.1 + i * 0.12} className="flex h-full flex-col rounded-[10px] border border-sand bg-paper p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-[17px] font-medium tracking-[-0.01em]">{v.label}</h3>
                        <EvidenceChip state={v.state} label={stateLabel[v.state]} size="sm" />
                      </div>
                      <p className="ui-label mt-1 text-stone">{v.audience}</p>
                      <ul className="mt-5 space-y-3 border-t border-sand pt-5">
                        {v.items.map((it) => (
                          <li key={it} className="flex gap-3 text-[15px] leading-[1.45]">
                            <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-teal" />
                            {it}
                          </li>
                        ))}
                      </ul>
                      <p className="ui-label mt-auto pt-6 text-stone">{v.source}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>

              <p className="mt-6 flex items-start gap-2 text-[14px] leading-[1.5] text-stone">
                <span className="marker marker-hypothesis mt-[5px] text-teal" aria-hidden="true" />
                {t("note")}
              </p>
            </div>
          </figure>
        </Reveal>

        <Reveal className="mt-14 max-w-[880px] md:mt-20">
          <p className="display text-[28px] leading-[1.2] md:text-[36px]">
            <Em source={t.raw("takeaway") as string} />
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <Reveal y={0}>
            <h3 className="eyebrow">{t("deliverablesLabel")}</h3>
          </Reveal>
          <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.map((d, i) => (
              <li key={d.title}>
                <Reveal delay={i * 0.06} className="border-t border-ink pt-5">
                  <p className="text-[18px] font-medium tracking-[-0.01em]">{d.title}</p>
                  <p className="mt-2 text-[15px] leading-[1.5] text-stone">{d.body}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
