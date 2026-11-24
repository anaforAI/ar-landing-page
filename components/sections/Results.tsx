import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";

export async function Results() {
  const t = await getTranslations("results");
  const items = t.raw("items") as { lead: string; rest: string }[];
  return (
    <section aria-labelledby="results-title" className="on-dark section-y bg-ink text-paper">
      <div className="container-text">
        <SectionHeader id="results-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} titleClassName="max-w-[960px]" />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-[12px] bg-paper/12 md:mt-24 md:grid-cols-2">
          {items.map((it, i) => (
            <li key={it.lead} className="bg-ink">
              <Reveal delay={(i % 2) * 0.08} className="h-full p-7 md:p-10">
                <p className="ui-label text-teal-light">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-6 text-[22px] leading-[1.35] tracking-[-0.02em] md:text-[24px]">
                  <span className="font-medium text-paper">{it.lead}</span>{" "}
                  <span className="text-paper/65">{it.rest}</span>
                </p>
                {/*
                  [METRIC] — space reserved for a real, verified customer metric for this outcome.
                  Do not fill with invented numbers. Example once available:
                  <p className="display mt-8 text-[56px] text-teal-light">[METRIC]</p>
                  <p className="ui-label mt-2 text-paper/55">[METRIC_DESCRIPTION] · [SOURCE]</p>
                */}
              </Reveal>
            </li>
          ))}
        </ol>

        {/*
          [CUSTOMER QUOTE] — reserved for a real, approved customer quote. Do not fabricate.
          <figure className="mx-auto mt-24 max-w-[880px] text-center">
            <blockquote className="display text-[36px] leading-[1.2]">“[CUSTOMER QUOTE]”</blockquote>
            <figcaption className="ui-label mt-6 text-paper/60">[NAME] · [ROLE], [COMPANY]</figcaption>
          </figure>
        */}
      </div>
    </section>
  );
}
