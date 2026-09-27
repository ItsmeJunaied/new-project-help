import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import AboutHero from "@/components/sections/AboutHero";
import ServicesIntro from "@/components/sections/ServicesIntro";
import AboutFilm from "@/components/sections/AboutFilm";
import AboutApproach from "@/components/sections/AboutApproach";
import AboutCapabilities from "@/components/sections/AboutCapabilities";
import TechStack from "@/components/sections/TechStack";
import ImageShowcase from "@/components/sections/ImageShowcase";
import AboutTeam from "@/components/sections/AboutTeam";
import Awards from "@/components/sections/Awards";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Project Help is a Bangladesh-based custom software development company founded in 2021 — SaaS platforms and MVPs, ERP, CRM and enterprise systems, web and mobile applications, eCommerce, AI/ML and AI agents, cloud, APIs and business automation. Senior engineers, two-week delivery slices, and code you own from the first commit.",
  path: "/about",
  keywords: [
    "about Project Help",
    "software company Bangladesh",
    "custom software team Dhaka",
    "SaaS and MVP development company",
    "ERP CRM enterprise software development",
    "AI agents and AI/ML development",
    "technology stack .NET Laravel Node Next.js Rust Flutter",
  ],
});

const STATEMENT_LINES = ["Solutions that", "make your", "business better"];

export default function AboutPage() {
  return (
    <>
      <Header activeLabel="ABOUT US" />
      <main id="main">
        <AboutHero />
        <ServicesIntro lines={STATEMENT_LINES} id="approach" nodeId="156:8682" />
        <AboutFilm
          src="/videos/about-film.mp4"
          poster="/images/about-film-poster.webp"
        />
        <AboutApproach />
        <AboutCapabilities />
        <TechStack />
        <ImageShowcase
          src="/images/about-showcase.jpg"
          alt="The Project Help team working together in the office"
          heightClassName="h-[420px] sm:h-[600px] lg:h-[1080px]"
          nodeId="156:8709"
        />
        <AboutTeam />
        <Awards spacingClassName="py-[80px] lg:pb-[160px] lg:pt-[160px]" />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about" },
        ])}
      />
    </>
  );
}
