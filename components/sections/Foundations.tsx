import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

/** Purpose, Intelligence, Trust: the three statements the brand stands on. */
export async function Foundations() {
  const t = await getTranslations("foundations");
  const items = t.raw("items") as { key: string; title: string; body: string }[];
  return (
    <section aria-labelledby="foundations-title" className="border-t border-sand py-20 md:py-28">
      <div className="container-text">
        <h2 id="foundations-title" className="eyebrow">
          {t("label")}
        </h2>
        <ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-6">
          {items.map((it, i) => (
            <li key={it.key}>
              <Reveal delay={i * 0.08} className="border-t border-ink pt-6">
                <p className="ui-label text-teal">{it.key}</p>
                <p className="display mt-4 text-[28px] leading-[1.15] md:text-[32px]">{it.title}</p>
                <p className="mt-3 text-[15px] text-stone">{it.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal className="mt-14">
          <p className="text-[15px] text-stone">{t("tagline")}</p>
        </Reveal>
      </div>
    </section>
  );
}
