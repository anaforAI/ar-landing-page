export const locales = ["en", "pt-BR"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/**
 * The site is statically rendered in one locale per build.
 * Set NEXT_PUBLIC_LOCALE=pt-BR to build the Portuguese version.
 * To serve both from one deployment, move app/ under app/[locale]/
 * and add next-intl routing (see README).
 */
export function resolveLocale(value: string | undefined): Locale {
  return (locales as readonly string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}
