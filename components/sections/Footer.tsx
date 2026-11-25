import { getTranslations } from "next-intl/server";
import { BrandSvg } from "@/components/brand/BrandSvg";
import { site } from "@/lib/site";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const cols: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
    {
      title: t("product"),
      links: [
        { href: "#how", label: tn("how") },
        { href: "#intelligence", label: tn("intelligence") },
        { href: "#example", label: tn("example") },
        { href: "#leaders", label: tn("leaders") },
        { href: "#evidence", label: tn("evidence") },
        { href: "#trust", label: tn("trust") },
        { href: "#pricing", label: tn("pricing") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: site.links.about, label: t("about") },
        { href: `mailto:${site.contactEmail}`, label: t("contact") },
        { href: site.links.linkedin, label: t("linkedin"), external: true },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: site.links.privacy, label: t("privacy") },
        { href: site.links.terms, label: t("terms") },
      ],
    },
  ];
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="container-text py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            {/* Institutional signature with the slogan, from the official file. */}
            <BrandSvg
              file="anafor-lockup-institutional-white.svg"
              className="block w-[240px] md:w-[280px] [&>svg]:h-auto [&>svg]:w-full"
            />
            <p className="mt-6 text-[14px] text-paper/55">
              by{" "}
              {site.builtBy.url ? (
                <a href={site.builtBy.url} className="link-underline text-paper/80 hover:text-paper" rel="noopener">
                  {site.builtBy.name}
                </a>
              ) : (
                <span className="text-paper/80">{site.builtBy.name}</span>
              )}
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {cols.map((c) => (
              <div key={c.title}>
                <h2 className="ui-label text-paper/50">{c.title}</h2>
                <ul className="mt-5 space-y-1">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="link-underline inline-flex min-h-[44px] items-center text-[15px] text-paper/80 hover:text-paper"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-paper/12 pt-6">
          <p className="ui-label text-paper/50">{t("copyright", { year: new Date().getFullYear() })}</p>
          <LanguageSwitch label={tn("language")} dark />
        </div>
      </div>
    </footer>
  );
}
