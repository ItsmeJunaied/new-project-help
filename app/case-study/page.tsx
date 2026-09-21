import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ListingHero from "@/components/sections/ListingHero";
import CaseStudyGrid from "@/components/sections/CaseStudyGrid";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import FeedbackTicker from "@/components/sections/FeedbackTicker";
import Footer from "@/components/sections/Footer";
import { PUBLISHED_CASE_STUDIES } from "@/lib/case-studies";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Delivery platforms, clinic records, point-of-sale and eCommerce systems — the problem, the decisions we made, and what changed for the client after launch.",
  path: "/case-study",
  keywords: [
    "software development case studies",
    "eCommerce platform case study",
    "clinic management system case study",
  ],
});

export default function CaseStudyPage() {
  return (
    <>
      <Header activeLabel="CASE STUDY" />
      <main id="main">
        <ListingHero
          title="our Project"
          asideTitle="{ CASE STUDY }"
          asideBody="The problem, the decisions we made, and what actually changed for the client after launch"
          metaLeft="© PROJECT"
          metaRight={`//${String(PUBLISHED_CASE_STUDIES.length).padStart(3, "0")} Selected`}
          nodeId="156:9410"
        />
        <CaseStudyGrid />
        <Faq />
        <Contact />
        <FeedbackTicker spacingClassName="lg:mt-[180px] lg:mb-[180px]" />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-study" },
        ])}
      />
    </>
  );
}
