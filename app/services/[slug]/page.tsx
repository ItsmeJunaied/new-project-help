import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ServiceDetailHero from "@/components/sections/ServiceDetailHero";
import ServiceDetailContent from "@/components/sections/ServiceDetailContent";
import RelatedServices from "@/components/sections/RelatedServices";
import Contact from "@/components/sections/Contact";
import FeedbackTicker from "@/components/sections/FeedbackTicker";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { getService, SERVICES } from "@/lib/services";
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from "@/lib/seo";

/**
 * One page per service. These were seven separate pages on the live site and a
 * single hand-built page here; the layout is the one that page already used, so
 * /services/saas-platform-development renders exactly as before.
 */
export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) return { title: "Service not found" };

  return buildMetadata({
    title: service.title,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const path = `/services/${service.slug}`;

  return (
    <>
      <Header activeLabel="SERVICES" />
      <main id="main">
        <ServiceDetailHero service={service} />
        <ServiceDetailContent service={service} />
        <RelatedServices currentSlug={service.slug} />
        <Contact />
        <FeedbackTicker spacingClassName="lg:mt-[161px] lg:mb-[103px]" />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.metaDescription,
            path,
          }),
        ]}
      />
    </>
  );
}
