import type { Metadata } from "next";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ListingHero from "@/components/sections/ListingHero";
import BlogGrid from "@/components/sections/BlogGrid";
import BlogTagLinks from "@/components/sections/BlogTagLinks";
import NewsletterBand from "@/components/sections/NewsletterBand";
import Footer from "@/components/sections/Footer";
import { allTags, getPosts } from "@/lib/blog";
import { blogListJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog & News",
  description:
    "Architecture decisions, delivery lessons and the trade-offs behind the systems we ship — written by the engineers who build them.",
  path: "/blog",
  keywords: [
    "software development blog",
    "SaaS architecture articles",
    "DevOps handover guide",
  ],
});

// Matches BLOG_REVALIDATE in lib/blog.ts — Next only accepts a literal here.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPosts();
  const tags = allTags(posts);

  return (
    <>
      <Header activeLabel="BLOG" />
      <main id="main">
        <ListingHero
          title="Blog & News"
          asideTitle="{ Blog }"
          asideBody="Architecture decisions, delivery lessons and the trade-offs behind the systems we ship"
          metaLeft="© Blog"
          metaRight={`//${String(posts.length).padStart(3, "0")} Selected`}
          nodeId="156:9936"
          spacingClassName="pb-[48px] pt-[40px] lg:pb-[58px] lg:pt-[77px]"
        />
        <BlogTagLinks tags={tags} />
        <BlogGrid posts={posts} />
        <NewsletterBand source="/blog" />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          blogListJsonLd(
            posts.map((post) => ({
              title: post.title,
              path: post.href ?? `/blog/${post.slug}`,
              datePublished: post.publishedAt,
            })),
          ),
        ]}
      />
    </>
  );
}
