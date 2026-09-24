import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import BlogArticle from "@/components/sections/BlogArticle";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";
import NewsletterBand from "@/components/sections/NewsletterBand";
import { getPost, getPosts, relatedPosts } from "@/lib/blog";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

const PATH = "/blog/saas-mvp-scope";
const PUBLISHED = "2026-06-01";
const TITLE = "How We Scope a SaaS MVP That Ships in 8–12 Weeks";

const DESCRIPTION =
  "The process we run before a line of code is written: start from the deadline, settle tenancy, billing and access first, ship in two-week slices, and say no before invoicing.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: "/images/blog-detail-hero.jpg",
  type: "article",
  publishedTime: PUBLISHED,
  keywords: [
    "SaaS MVP scope",
    "MVP development timeline",
    "software project estimation",
  ],
});

// Matches BLOG_REVALIDATE in lib/blog.ts — Next only accepts a literal here.
export const revalidate = 60;

export default async function BlogDetailPage() {
  // This article keeps its hand-built layout, but its "more blog" row is drawn
  // from the API like every other post's, so it never links to a stale three.
  const all = await getPosts();
  const self = await getPost("saas-mvp-scope");
  const related = self ? relatedPosts(self, all, 3) : all.slice(0, 3);

  return (
    <>
      <Header activeLabel="BLOG" />
      <main id="main">
        <BlogArticle />
        <Blog
          posts={related}
          label="[ More blog ]"
          showIntro={false}
          ctaLabel="Back to Blog"
          ctaHref="/blog"
          sectionClassName="bg-[#f4f4f4] px-6 py-[80px] lg:px-[40px] lg:pb-[165px] lg:pt-[163px]"
          containerClassName="max-w-[1440px] gap-[48px] lg:gap-[100px]"
          groupClassName="gap-[48px] lg:gap-[60px]"
          cardClassName="sm:w-[467px]"
          imageClassName="aspect-[467/560]"
          nodeId="156:10266"
          id="more-blog"
        />
        <NewsletterBand source={PATH} />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: TITLE, path: PATH },
          ]),
          articleJsonLd({
            headline: TITLE,
            description: DESCRIPTION,
            path: PATH,
            image: "/images/blog-detail-hero.jpg",
            datePublished: PUBLISHED,
            author: "Junaied Hossain",
          }),
        ]}
      />
    </>
  );
}
