import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, the server action endpoint and any file with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
