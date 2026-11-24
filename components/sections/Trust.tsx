import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { FilterIcon, HiddenIcon, NoScoreIcon, RolesIcon } from "@/components/ui/icons";

const ICONS = [NoScoreIcon, FilterIcon, HiddenIcon, RolesIcon];

export async function Trust() {
  const t = await getTranslations("trust");
  const items = t.raw("items") as string[];
  return (
    <section aria-labelledby="trust-title" className="section-y">
      <div className="container-text">
        <SectionHeader id="trust-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} />
        <ul className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <li key={it}>
                <Reveal delay={i * 0.06} className="border-t border-sand pt-6">
                  <Icon className="text-teal" />
                  <p className="mt-5 text-[18px] leading-[1.45] tracking-[-0.01em]">{it}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
