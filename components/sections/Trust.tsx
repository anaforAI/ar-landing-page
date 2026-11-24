import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Em } from "@/components/ui/Em";
import { FilterIcon, HiddenIcon, NoScoreIcon, RolesIcon } from "@/components/ui/icons";

const ICONS = [NoScoreIcon, FilterIcon, HiddenIcon, RolesIcon];

/** The lifted quarter, used as a small bullet. */
function Quarter() {
  return (
    <svg aria-hidden="true" viewBox="64 0 40 40" className="h-3 w-3 text-teal" fill="currentColor">
      <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
    </svg>
  );
}

export async function Trust() {
  const t = await getTranslations("trust");
  const commitments = t.raw("commitments") as { name: string; body: string }[];
  const items = t.raw("items") as string[];
  return (
    <section id="trust" aria-labelledby="trust-title" className="section-y border-t border-sand">
      <div className="container-text">
        <SectionHeader id="trust-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} body={t("body")} />

        <Reveal y={0} className="mt-16 md:mt-24">
          <h3 className="eyebrow">{t("commitmentsLabel")}</h3>
        </Reveal>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c, i) => (
            <li key={c.name}>
              <Reveal delay={(i % 4) * 0.06} className="card h-full p-6">
                <Quarter />
                <h4 className="mt-5 text-[17px] font-medium leading-snug tracking-[-0.01em]">{c.name}</h4>
                <p className="mt-2 text-[15px] leading-[1.5] text-stone">{c.body}</p>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={0.18} className="flex h-full items-end rounded-[12px] border border-ink p-6">
              <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.01em]">{t("everyPlan")}</p>
            </Reveal>
          </li>
        </ul>

        <Reveal className="on-dark mt-16 rounded-[16px] bg-ink px-6 py-14 text-center text-paper md:mt-24 md:px-12 md:py-20">
          <p className="display mx-auto max-w-[880px] text-[32px] leading-[1.12] md:text-[52px]">
            <Em source={t.raw("message") as string} />
          </p>
          <p className="lead mx-auto mt-6 max-w-[560px]">{t("messageBody")}</p>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <Reveal y={0}>
            <h3 className="eyebrow">{t("title2")}</h3>
          </Reveal>
          <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((it, i) => {
              const Icon = ICONS[i];
              return (
                <li key={it}>
                  <Reveal delay={i * 0.06} className="border-t border-sand pt-6">
                    <Icon className="text-teal" />
                    <p className="mt-5 text-[17px] leading-[1.45] tracking-[-0.01em]">{it}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
