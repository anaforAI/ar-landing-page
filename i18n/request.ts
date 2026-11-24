import { getRequestConfig } from "next-intl/server";
import { resolveLocale } from "./config";

export default getRequestConfig(async () => {
  const locale = resolveLocale(process.env.NEXT_PUBLIC_LOCALE);
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
