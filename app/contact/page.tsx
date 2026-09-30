import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ContactHero from "@/components/sections/ContactHero";
import ContactProof from "@/components/sections/ContactProof";
import ContactPaths from "@/components/sections/ContactPaths";
import ContactTimeline from "@/components/sections/ContactTimeline";
import ContactDetails from "@/components/sections/ContactDetails";
import ContactCoverage from "@/components/sections/ContactCoverage";
import ContactFaq from "@/components/sections/ContactFaq";
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
        {/* Centred headline, round call to action, two ribbons. */}
        <ContactHero />
        {/* Proof on the left, the brief on a black card on the right. */}
        <ContactDetails />
        {/* Who has already sent one, and the work that came out of it. */}
        <ContactProof />
        {/* Four routes to the same engineers; the call is the recommended one. */}
        <ContactPaths />
        {/* From first message to launch. */}
        <ContactTimeline />
        {/* The globe, with the figures riding over it. */}
        <ContactCoverage />
        {/* A contact-specific FAQ rather than the shared one: these answer
            what happens if you send the form, not what the company does. */}
        <ContactFaq />
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
