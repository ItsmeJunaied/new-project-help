import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ServicesHero from "@/components/sections/ServicesHero";
import Services from "@/components/sections/Services";
import RelatedServices from "@/components/sections/RelatedServices";
import Testimonials from "@/components/sections/Testimonials";
import ImageShowcase from "@/components/sections/ImageShowcase";
import WorkingProcess from "@/components/sections/WorkingProcess";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { SERVICES } from "@/lib/services";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Software Development Services",
  description:
    "SaaS platforms, eCommerce systems, DevOps and cloud infrastructure, AI/ML applications, mobile apps and cybersecurity — delivered in two-week slices with code you own.",
  path: "/services",
  keywords: [
    "software development services",
    "SaaS development company",
    "eCommerce development services",
    "DevOps consulting",
    "AI ML development",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <Header activeLabel="SERVICES" />
      <main id="main">
        <ServicesHero />
        {/* The 374px of bottom padding this used to carry was room for the
            stack's last card to finish unsticking. There is no stack now. */}
        <Services spacingClassName="py-[80px] lg:pb-[150px] lg:pt-[127px]" />
        {/* Straight after the cards: what we build, then how the building is
            run. It answers the question the cards raise rather than pre-empting
            it, and it is still far above the footer. */}
        <WorkingProcess />
        <RelatedServices currentSlug="" />
        <Testimonials />
        <ImageShowcase
          heightClassName="h-[420px] sm:h-[600px] lg:h-[1080px]"
          nodeId="156:7822"
        />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...SERVICES.map((service) =>
            serviceJsonLd({
              name: service.title,
              description: service.metaDescription,
              path: `/services/${service.slug}`,
            }),
          ),
        ]}
      />
    </>
  );
}
