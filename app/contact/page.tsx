import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ContactHero from "@/components/sections/ContactHero";
import ContactDetails from "@/components/sections/ContactDetails";
import ContactProof from "@/components/sections/ContactProof";
import ContactTimeline from "@/components/sections/ContactTimeline";
import ContactCoverage from "@/components/sections/ContactCoverage";
import ContactFaq from "@/components/sections/ContactFaq";
import ContactClosing from "@/components/sections/ContactClosing";
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

/**
 * The page follows the supplied concept section for section, in its order, with
 * only the header and the footer left as ours.
 */
export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main">
        {/* Hero: the headline and the standfirst … */}
        <ContactHero />
        {/* … then the brief tray it runs into — the aside and the form. */}
        <ContactDetails />
        {/* Reviews. */}
        <ContactProof />
        {/* Process: seven steps with the wire running through them. */}
        <ContactTimeline />
        {/* Global reach: the dotted map, the markets and the figures. */}
        <ContactCoverage />
        {/* A contact-specific FAQ rather than the shared one: these answer
            what happens if you send the form, not what the company does. */}
        <ContactFaq />
        {/* Closing CTA: back up to the form, the ribbons, the wordmark. */}
        <ContactClosing />
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
