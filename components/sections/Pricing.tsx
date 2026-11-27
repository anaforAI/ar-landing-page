import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { RequestAccessButton } from "@/components/ui/RequestAccess";

export async function Pricing() {
  const t = await getTranslations("pricing");
  const tiers = [
    { k: t("trial"), d: t("trialText") },
    { k: t("base"), d: t("baseText") },
    { k: t("usage"), d: t("usageText") },
  ];
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y border-t border-sand">
      <div className="container-text">
        <SectionHeader id="pricing-title" eyebrow={t("eyebrow")} title={t.raw("title") as string} body={t("body")} />
        <Reveal className="card mt-14 grid overflow-hidden md:mt-20 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={tier.k}
              className={`flex flex-col p-7 md:p-8 ${i > 0 ? "border-t border-sand md:border-l md:border-t-0" : ""}`}
            >
              <p className="ui-label text-stone">
                {String(i + 1).padStart(2, "0")} · {tier.k}
              </p>
              <p className="mt-6 text-[17px] leading-[1.5]">{tier.d}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-[28ch] text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">{t("price")}</p>
          <RequestAccessButton className="btn btn-primary mt-8">{t("cta")}</RequestAccessButton>
        </Reveal>
      </div>
    </section>
  );
}
