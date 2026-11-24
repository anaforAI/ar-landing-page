"use client";

import { useLocale } from "next-intl";
import { localeHref, routing, type Locale } from "@/i18n/routing";

const SHORT: Record<Locale, { label: string; name: string }> = {
  en: { label: "EN", name: "English" },
  "pt-BR": { label: "PT", name: "Português" },
};

/** EN | PT. Each option links to the statically generated page for that language. */
export function LanguageSwitch({ label, dark = false, className = "" }: { label: string; dark?: boolean; className?: string }) {
  const current = useLocale() as Locale;
  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center text-[14px] font-medium">
        {routing.locales.map((l, i) => {
          const active = l === current;
          return (
            <li key={l} className="flex items-center">
              {i > 0 && (
                <span aria-hidden="true" className={dark ? "text-paper/30" : "text-sand"}>
                  |
                </span>
              )}
              <a
                href={localeHref(l)}
                hrefLang={l}
                lang={l}
                aria-current={active ? "true" : undefined}
                aria-label={SHORT[l].name}
                className={`inline-flex min-h-[44px] min-w-[36px] items-center justify-center rounded-[4px] px-1.5 transition-colors ${
                  active
                    ? dark
                      ? "text-paper"
                      : "text-ink"
                    : dark
                      ? "text-paper/55 hover:text-paper"
                      : "text-stone hover:text-ink"
                }`}
              >
                {SHORT[l].label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
