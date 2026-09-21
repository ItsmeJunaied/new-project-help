import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import ListingHero from "@/components/sections/ListingHero";
import BlogGrid from "@/components/sections/BlogGrid";
import BlogTagLinks from "@/components/sections/BlogTagLinks";
import NewsletterBand from "@/components/sections/NewsletterBand";
import Footer from "@/components/sections/Footer";
import { allTags, findTag, getPosts, postsByTag, tagSlug } from "@/lib/blog";
import { blogListJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

// Matches BLOG_REVALIDATE in lib/blog.ts — Next only accepts a literal here.
export const revalidate = 60;

/**
 * A page per topic.
 *
 * The index filters in the browser, which is fine for a reader and useless for
 * search: there is no URL to rank, and no way to link to "everything we have
 * written about DevOps". These are those URLs.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return allTags(posts).map((tag) => ({ tag: tagSlug(tag) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag: slug } = await params;
  const posts = await getPosts();
  const tag = findTag(slug, posts);

  if (!tag) return { title: "Topic not found", robots: { index: false, follow: true } };

  const count = postsByTag(tag, posts).length;

  return buildMetadata({
    title: `${tag} articles`,
    description: `Every article we have published on ${tag} — ${count} ${
      count === 1 ? "piece" : "pieces"
    } on architecture, delivery and the trade-offs behind them.`,
    path: `/blog/tag/${slug}`,
    keywords: [tag, `${tag} articles`, `${tag} software development`],
  });
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag: slug } = await params;
  const posts = await getPosts();
  const tag = findTag(slug, posts);

  if (!tag) notFound();

  const matching = postsByTag(tag, posts);

  return (
    <>
      <Header activeLabel="BLOG" />
      <main id="main">
        <ListingHero
          title={tag}
          asideTitle="{ Topic }"
          asideBody={`Everything we have published on ${tag}`}
          metaLeft="© Blog"
          metaRight={`//${String(matching.length).padStart(3, "0")} Selected`}
          nodeId="156:9936"
          spacingClassName="pb-[48px] pt-[40px] lg:pb-[58px] lg:pt-[77px]"
        />

        <BlogTagLinks tags={allTags(posts)} activeTag={tag} />
        <BlogGrid posts={matching} />
        <NewsletterBand source={`/blog/tag/${slug}`} />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: tag, path: `/blog/tag/${slug}` },
          ]),
          blogListJsonLd(
            matching.map((post) => ({
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
