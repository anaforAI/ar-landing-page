import { getTranslations } from "next-intl/server";
import { BrandSvg } from "@/components/brand/BrandSvg";
import { HeaderClient } from "./HeaderClient";
import { site } from "@/lib/site";

export async function Header() {
  const t = await getTranslations();
  const links = [
    { href: "#problem", label: t("nav.problem") },
    { href: "#how", label: t("nav.how") },
    { href: "#evidence", label: t("nav.evidence") },
    { href: "#leaders", label: t("nav.leaders") },
    { href: "#pricing", label: t("nav.pricing") },
  ];
  return (
    <HeaderClient
      links={links}
      appUrl={site.appUrl}
      labels={{
        nav: t("nav.label"),
        home: t("nav.home"),
        open: t("nav.openMenu"),
        close: t("nav.closeMenu"),
        signIn: t("common.signIn"),
        request: t("common.requestAccess"),
      }}
      logo={<BrandSvg file="anafor-lockup-horizontal-ink.svg" decorative className="block h-[26px] w-auto [&>svg]:h-full [&>svg]:w-auto" />}
      logoDark={<BrandSvg file="anafor-lockup-horizontal-white.svg" decorative className="block h-[26px] w-auto [&>svg]:h-full [&>svg]:w-auto" />}
    />
  );
}
