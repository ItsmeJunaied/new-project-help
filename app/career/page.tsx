import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ListingHero from "@/components/sections/ListingHero";
import CareerIntro from "@/components/sections/CareerIntro";
import CareerBenefits from "@/components/sections/CareerBenefits";
import CareerRoles from "@/components/sections/CareerRoles";
import CareerGallery from "@/components/sections/CareerGallery";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { JOBS } from "@/lib/careers";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Careers at Project Help — engineering, DevOps, design and content. Ownership end to end, work across SaaS, cloud and AI/ML, and delivery planned without crunch. No roles are open right now; send your CV and we will write when one is.",
  path: "/career",
  keywords: [
    "software jobs Bangladesh",
    "remote developer jobs Dhaka",
    "Project Help careers",
  ],
});

export default function CareerPage() {
  return (
    <>
      <Header activeLabel="CAREER" />
      <main id="main">
        {/* The hero counted six openings by hand. It now counts the list, so
            it cannot promise roles that are not below it. */}
        <ListingHero
          title={JOBS.length > 0 ? "open roles" : "work with us"}
          asideTitle="{ CAREER }"
          asideBody="Own your features end to end, work across SaaS, cloud and AI/ML, and ship on timelines that respect your time outside work."
          metaLeft="© CAREER"
          metaRight={`//${String(JOBS.length).padStart(3, "0")} Open`}
          nodeId="156:11169"
          spacingClassName="pb-[48px] pt-[40px] lg:pb-[57px] lg:pt-[75px]"
        />
        <CareerIntro />
        <CareerBenefits />
        <CareerRoles />
        <CareerGallery />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/career" },
        ])}
      />
    </>
  );
}
