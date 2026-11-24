import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { site } from "@/lib/site";

export async function Pricing() {
  const t = await getTranslations("pricing");
  const tiers = [
    { k: t("trial"), d: t("trialText"), price: null },
    { k: t("base"), d: t("baseText"), price: t("price") }, // [PRICE] — base subscription per organization
    { k: t("usage"), d: t("usageText"), price: t("price") }, // [PRICE] — AI usage unit price
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
              {tier.price && <p className="mt-6 text-[15px] text-stone">{tier.price}</p>}
              <p className={`text-[17px] leading-[1.5] ${tier.price ? "mt-3" : "mt-6"}`}>{tier.d}</p>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-10">
          <a href={`mailto:${site.contactEmail}`} className="btn btn-outline">
            {t("cta")}
            <ArrowRight className="btn-arrow" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
