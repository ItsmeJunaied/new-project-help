import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import Analytics from "@/components/analytics/Analytics";
import JsonLd from "@/components/JsonLd";
import AmbientAudio from "@/components/ui/AmbientAudio";
import FloatingActions from "@/components/ui/FloatingActions";
import ScrollProgress from "@/components/ui/ScrollProgress";
import RouteTransition from "@/components/ui/RouteTransition";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Inter carries body copy on every page, so it preloads with the document.
const interDisplay = Inter({
  variable: "--font-inter-display",
  subsets: ["latin"],
  display: "swap",
});

// The mono and alt faces appear only in the footer, so they load on demand
// instead of competing with the two faces that render above the fold.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "custom software development company",
    "SaaS platform development",
    "eCommerce development",
    "DevOps and cloud infrastructure",
    "AI ML application development",
    "software company Bangladesh",
    "Project Help",
  ],
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/blog/feed.xml", title: "Project Help — Blog" }] },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  formatDetection: { email: false, address: false, telephone: false },
  // Google Search Console HTML-tag verification. Omitted entirely when unset,
  // so a preview deploy never claims ownership of the production property.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#fffdfb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${interDisplay.variable} ${jetBrainsMono.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body className="bg-bg text-black font-body">
        {/* Skip link: the header's nav is the fourth stop on every page, and
            these pages are long. Visible only once focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-[16px] focus:top-[16px] focus:z-50 focus:rounded-[100px] focus:bg-black focus:px-[20px] focus:py-[12px] focus:font-body focus:text-[15px] focus:text-white"
        >
          Skip to content
        </a>

        <ScrollProgress />
        <RouteTransition>{children}</RouteTransition>
        <FloatingActions />
        <AmbientAudio />

        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Analytics />
      </body>
    </html>
  );
}
