import { defineRouting } from "next-intl/routing";

/**
 * English at "/", Portuguese at "/pt-BR". Both are statically generated.
 * No automatic detection: the visitor chooses with the EN | PT switch.
 */
export const routing = defineRouting({
  locales: ["en", "pt-BR"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeHref = (locale: Locale) => (locale === routing.defaultLocale ? "/" : `/${locale}`);
