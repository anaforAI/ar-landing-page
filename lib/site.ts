/**
 * Site-wide configuration. Values in [BRACKETS] are placeholders — see README.
 */
export const site = {
  name: "Anafor",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://anafor.tech",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "#", // [APP_URL] — "Sign in" target
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@anafor.tech",
  links: {
    linkedin: "https://www.linkedin.com/company/anaforai/",
    about: "#", // [ABOUT_URL]
    privacy: "#", // [PRIVACY_URL]
    terms: "#", // [TERMS_URL]
  },
  /** Signature under the footer lockup. Set url to turn it into a link. */
  builtBy: { name: "FAPP Engineering", url: "" }, // [FAPP_URL]
};
