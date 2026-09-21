import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ListingHero from "@/components/sections/ListingHero";
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
        <ListingHero
          title="Get in touch"
          asideTitle="{ Contact US }"
          asideBody="— Send us the problem and we'll send back a scope, an estimate and an honest answer"
          metaLeft="©Contact"
          metaRight="//001 Selected"
          nodeId="156:11115"
          spacingClassName="pb-[48px] pt-[40px] lg:pb-[80px] lg:pt-[75px]"
        />
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
