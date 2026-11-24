import { getTranslations } from "next-intl/server";
import { BrandSvg } from "@/components/brand/BrandSvg";
import { RequestAccessButton } from "@/components/ui/RequestAccess";
import { GithubMark, JiraMark, MeetMark, MiroMark } from "@/components/ui/icons";
import { parseEm } from "@/lib/rich";
import { HeroField } from "@/components/visuals/HeroField";

export async function Hero() {
  const t = await getTranslations("hero");
  const tokens = parseEm(t.raw("title") as string);
  let i = 0;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-[120px] lg:pt-[148px]">
      <div className="container-text text-center">
        <p className="eyebrow hero-fade" style={{ ["--d" as string]: "0ms" }}>
          {t("eyebrow")}
        </p>
        <h1 id="hero-title" className="display h-hero mx-auto mt-7 max-w-[1000px]">
          {tokens.map((tok, k) => {
            if (/^\s+$/.test(tok.text)) return tok.text;
            const w = (
              <span key={k} className="hero-word" style={{ ["--i" as string]: i++ }}>
                {tok.text}
              </span>
            );
            return tok.em ? <em key={k}>{w}</em> : w;
          })}
        </h1>
        <p className="lead hero-fade mx-auto mt-8 max-w-[680px]" style={{ ["--d" as string]: "320ms" }}>
          {t("subtitle")}
        </p>
        <div
          className="hero-fade mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ ["--d" as string]: "420ms" }}
        >
          <RequestAccessButton>{t("primary")}</RequestAccessButton>
          <a href="#how" className="btn btn-outline">
            {t("secondary")}
          </a>
        </div>
      </div>

      {/* Visual: a calm field of sand blocks; one block opens into the symbol and reveals an insight. */}
      <div className="container-wide mt-12 lg:mt-14">
        <div className="hero-fade relative" style={{ ["--d" as string]: "500ms" }}>
          <HeroField>
            <figure
              aria-label={t("visualAlt")}
              className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:gap-8"
            >
              <div className="hero-tile relative grid h-[104px] w-[104px] place-items-center rounded-[12px] bg-paper">
                <span aria-hidden="true" className="hero-tile-sand absolute inset-[24px] rounded-[4px] bg-sand" />
                <BrandSvg
                  file="anafor-symbol-teal.svg"
                  decorative
                  className="hero-symbol relative block h-[56px] w-[56px] [&>svg]:h-full [&>svg]:w-full"
                />
              </div>
              <span aria-hidden="true" className="hero-connector hidden h-px w-12 bg-teal md:block" />
              <figcaption className="hero-insight card relative w-full max-w-[400px] p-6 text-left">
                <QuarterMark />
                <p className="ui-label flex items-center gap-2 text-teal">
                  <span className="marker marker-verified" aria-hidden="true" />
                  {t("insightLabel")}
                </p>
                <p className="mt-4 text-[18px] leading-[1.45] tracking-[-0.01em] text-ink">
                  {t("insightText")}
                </p>
                <p className="ui-label mt-5 border-t border-sand pt-4 text-stone">
                  {t("insightEvidenceLabel")}: {t("insightEvidence")}
                </p>
              </figcaption>
            </figure>
          </HeroField>
        </div>
      </div>

      <div className="container-text pb-20 pt-14 lg:pb-28">
        <div
          className="hero-fade flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-stone"
          style={{ ["--d" as string]: "700ms" }}
        >
          <span className="ui-label">{t("integrationsLabel")}</span>
          <span className="flex items-center gap-2 text-[15px]">
            <GithubMark aria-hidden="true" /> GitHub
          </span>
          <span className="flex items-center gap-2 text-[15px]">
            <JiraMark aria-hidden="true" /> Jira
          </span>
          <span className="flex items-center gap-2 text-[15px]">
            <MeetMark aria-hidden="true" /> Google Meet
          </span>
          <span className="flex items-center gap-2 text-[15px]">
            <MiroMark aria-hidden="true" /> Miro
          </span>
        </div>
      </div>
    </section>
  );
}

/** The lifted quarter as a small corner mark for insights. Geometry from the symbol (104 grid). */
function QuarterMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="64 0 40 40"
      className="absolute right-4 top-4 h-4 w-4 text-teal"
      fill="currentColor"
    >
      <path d="M64 0H100A4 4 0 0 1 104 4V40A40 40 0 0 1 64 0Z" />
    </svg>
  );
}
