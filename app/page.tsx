import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesIntro from "@/components/sections/ServicesIntro";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Awards from "@/components/sections/Awards";
import ImageShowcase from "@/components/sections/ImageShowcase";
import Faq from "@/components/sections/Faq";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import FeedbackTicker from "@/components/sections/FeedbackTicker";
import TeamCta from "@/components/sections/TeamCta";
import Footer from "@/components/sections/Footer";
import { getPosts } from "@/lib/blog";
import { faqPlainText } from "@/lib/faqs";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Project Help — Custom Software Development Company",
  description:
    "Project Help builds SaaS platforms, eCommerce systems, cloud infrastructure and AI/ML applications — engineered to scale, secure by default, and shipped on time.",
  path: "/",
  keywords: [
    "custom software development company",
    "SaaS platform development",
    "eCommerce development company",
    "DevOps and cloud consulting",
    "AI ML development services",
  ],
});

// The latest-articles row reads the same API the blog does, so a post
// scheduled for a future date surfaces on the home page by itself.
// Matches BLOG_REVALIDATE in lib/blog.ts — Next only accepts a literal here.
export const revalidate = 60;

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <FeaturedWork />
        <ServicesIntro />
        <Services />
        <Testimonials />
        <Awards />
        <ImageShowcase />
        <Faq />
        <Blog posts={posts.slice(0, 3)} totalPosts={posts.length} />
        <Contact />
        <FeedbackTicker />
        <TeamCta />
      </main>
      <Footer />
      <JsonLd data={faqJsonLd(faqPlainText())} />
    </>
  );
}
