import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/JsonLd";
import Header from "@/components/sections/Header";
import BlogPostArticle from "@/components/sections/BlogPostArticle";
import Blog from "@/components/sections/Blog";
import NewsletterBand from "@/components/sections/NewsletterBand";
import Footer from "@/components/sections/Footer";
import {
  coverImage,
  getPost,
  getPosts,
  postPlainText,
  relatedPosts,
} from "@/lib/blog";
import { blogPostingJsonLd, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// Matches BLOG_REVALIDATE in lib/blog.ts — Next only accepts a literal here.
export const revalidate = 60;

/**
 * Prerender every post that exists at build time; anything published later —
 * including the scheduled queue — renders on first request and is then cached
 * like the rest. `dynamicParams` stays at its default of true for exactly that.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.filter((post) => !post.local).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Article not found", robots: { index: false, follow: true } };
  }

  return buildMetadata({
    title: post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: coverImage(post),
    type: "article",
    publishedTime: post.publishedAt,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const all = await getPosts();
  const related = relatedPosts(post, all, 3);
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const body = postPlainText(post);

  return (
    <>
      <Header activeLabel="BLOG" />
      <main id="main">
        <BlogPostArticle post={post} url={url} />

        {related.length > 0 && (
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
        )}

        <NewsletterBand source={`/blog/${post.slug}`} />
      </main>
      <Footer />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
          blogPostingJsonLd({
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            path: `/blog/${post.slug}`,
            image: coverImage(post),
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: post.author,
            keywords: post.tags,
            wordCount: body ? body.split(" ").length : undefined,
          }),
        ]}
      />
    </>
  );
}
