import { getTranslations } from "next-intl/server";
import { BrandSvg } from "@/components/brand/BrandSvg";
import { HeaderClient } from "./HeaderClient";
import { site } from "@/lib/site";

export async function Header() {
  const t = await getTranslations();
  const links = [
    { href: "#example", label: t("nav.example") },
    { href: "#how", label: t("nav.how") },
    { href: "#intelligence", label: t("nav.intelligence") },
    { href: "#trust", label: t("nav.trust") },
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
        language: t("nav.language"),
      }}
      logo={<BrandSvg file="anafor-lockup-horizontal-ink.svg" decorative className="block h-[26px] w-auto [&>svg]:h-full [&>svg]:w-auto" />}
      logoDark={<BrandSvg file="anafor-lockup-horizontal-white.svg" decorative className="block h-[26px] w-auto [&>svg]:h-full [&>svg]:w-auto" />}
    />
  );
}
