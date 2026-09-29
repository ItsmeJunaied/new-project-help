import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
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
        {/* The title and the form, together, at the top — the page exists to
            collect a brief and everything that used to sit above it now sits
            beside it or below it. */}
        <ContactDetails />
        {/* Then what happens to the brief once it has been sent. */}
        <ContactTimeline />
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
