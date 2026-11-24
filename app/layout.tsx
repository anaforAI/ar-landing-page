import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RequestAccessProvider } from "@/components/ui/RequestAccess";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = localFont({
  variable: "--font-newsreader",
  display: "swap",
  src: [
    { path: "./fonts/newsreader-latin.woff2", style: "normal", weight: "400" },
    { path: "./fonts/newsreader-italic-latin.woff2", style: "italic", weight: "400" },
  ],
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});
const hanken = localFont({
  variable: "--font-hanken",
  display: "swap",
  src: [{ path: "./fonts/hanken-grotesk-latin.woff2", style: "normal", weight: "400 600" }],
  fallback: ["system-ui", "sans-serif"],
});
const geistMono = localFont({
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
  src: [{ path: "./fonts/geist-mono-latin.woff2", style: "normal", weight: "400 500" }],
  fallback: ["ui-monospace", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    applicationName: site.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: site.name,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
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
