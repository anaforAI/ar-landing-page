/**
 * Site-wide configuration. Values in [BRACKETS] are placeholders — see README.
 */
export const site = {
  name: "Anafor",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anafor.ai", // [SITE_URL]
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "#", // [APP_URL] — "Sign in" target
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@anafor.ai", // [CONTACT_EMAIL]
  links: {
    about: "#", // [ABOUT_URL]
    privacy: "#", // [PRIVACY_URL]
    terms: "#", // [TERMS_URL]
  },
  /** Signature under the footer lockup. Set url to turn it into a link. */
  builtBy: { name: "FAPP Engineering", url: "" }, // [FAPP_URL]
};
