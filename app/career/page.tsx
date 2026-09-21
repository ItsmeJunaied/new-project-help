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
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Open roles at Project Help — engineering, DevOps, design and content. Ownership end to end, work across SaaS, cloud and AI/ML, and delivery planned without crunch.",
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
        <ListingHero
          title="open roles"
          asideTitle="{ CAREER }"
          asideBody="Own your features end to end, work across SaaS, cloud and AI/ML, and ship on timelines that respect your time outside work."
          metaLeft="© CAREER"
          metaRight="//006 Open"
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
