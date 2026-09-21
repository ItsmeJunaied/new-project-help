import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import CaseDetailHero from "@/components/sections/CaseDetailHero";
import CaseDetailBody from "@/components/sections/CaseDetailBody";
import Testimonials from "@/components/sections/Testimonials";
import ImageShowcase from "@/components/sections/ImageShowcase";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import { PUBLISHED_CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";
import { breadcrumbJsonLd, buildMetadata, caseStudyJsonLd } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return PUBLISHED_CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

// Draft entries exist in the data file but must never resolve to a page, so
// anything outside the list above 404s rather than rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) return { title: "Case study not found", robots: { index: false, follow: true } };

  return buildMetadata({
    title: study.title,
    description: study.metaDescription,
    path: `/case-study/${study.slug}`,
    image: study.hero.src,
    keywords: study.keywords,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  const path = `/case-study/${study.slug}`;

  return (
    <>
      <Header activeLabel="CASE STUDY" />
      <main id="main">
        <CaseDetailHero study={study} />
        <CaseDetailBody study={study} />
        <Testimonials />
        <ImageShowcase
          heightClassName="h-[420px] sm:h-[600px] lg:h-[1056px]"
          nodeId="156:10558"
        />
        <Faq />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-study" },
            { name: study.cardTitle, path },
          ]),
          caseStudyJsonLd({
            name: study.title,
            description: study.metaDescription,
            path,
            image: study.hero.src,
          }),
        ]}
      />
    </>
  );
}
