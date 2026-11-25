import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, localeHref } from "@/i18n/routing";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RequestAccessProvider } from "@/components/ui/RequestAccess";
import { site } from "@/lib/site";
import "../globals.css";

const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  src: [
    { path: "../fonts/newsreader-latin.woff2", style: "normal", weight: "400" },
    { path: "../fonts/newsreader-italic-latin.woff2", style: "italic", weight: "400" },
  ],
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});
const hanken = localFont({
  variable: "--font-hanken",
  display: "swap",
  src: [{ path: "../fonts/hanken-grotesk-latin.woff2", style: "normal", weight: "400 600" }],
  fallback: ["system-ui", "sans-serif"],
});
const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  src: [{ path: "../fonts/geist-mono-latin.woff2", style: "normal", weight: "400 500" }],
  fallback: ["ui-monospace", "monospace"],
});

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const og = { url: "/og.png", width: 1280, height: 640, alt: t("ogAlt") };
  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    applicationName: site.name,
    alternates: {
      canonical: localeHref(locale as "en"),
      languages: { en: "/", "pt-BR": "/pt-BR", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: localeHref(locale as "en"),
      locale: locale === "pt-BR" ? "pt_BR" : "en_US",
      siteName: site.name,
      images: [og],
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [og.url],
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#F5F3EE",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & Params>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");
  const tm = await getTranslations("meta");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/anafor-symbol-ink.svg`,
    slogan: "Intelligence through information.",
    description: tm("description"),
    email: site.contactEmail,
    sameAs: [site.links.linkedin],
  };

  return (
    <html lang={locale} className={`${newsreader.variable} ${hanken.variable} ${geistMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {t("skipToContent")}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>
            <RequestAccessProvider>{children}</RequestAccessProvider>
          </MotionProvider>
        </NextIntlClientProvider>
        <SmoothScroll />
      </body>
    </html>
  );
}
