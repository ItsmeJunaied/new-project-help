import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ContactHero from "@/components/sections/ContactHero";
import ContactPaths from "@/components/sections/ContactPaths";
import ContactTimeline from "@/components/sections/ContactTimeline";
import ContactDetails from "@/components/sections/ContactDetails";
import ContactChannels from "@/components/sections/ContactChannels";
import Faq from "@/components/sections/Faq";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Send Project Help your brief and get a written scope, a fixed estimate and an honest answer within 4 business hours. Email ${siteConfig.email}.`,
  path: "/contact",
  keywords: [
    "contact software development company",
    "hire developers Bangladesh",
    "software project quote",
  ],
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main">
        <ContactHero />
        {/* The four routes first, because the page's job is to get you to one
            of them and only one of them is the form. */}
        <ContactPaths />
        {/* Then what happens to a brief, before being asked to write one. */}
        <ContactTimeline />
        <ContactDetails />
        <ContactChannels />
        <Faq />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />
    </>
  );
}
