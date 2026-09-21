import type { MetadataRoute } from "next";

import { allTags, getPosts, tagSlug } from "@/lib/blog";
import { CASE_STUDY_SLUGS } from "@/lib/case-studies";
import { JOBS } from "@/lib/careers";
import { SERVICE_SLUGS } from "@/lib/services";
import { siteConfig } from "@/lib/site";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
};

// Sitemaps are cached like a page, and the blog list behind this one is on a
// one-minute window — so a scheduled post enters the sitemap on its own the
// hour it goes live, without a deploy.
export const revalidate = 3600;

const STATIC_ROUTES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  ...SERVICE_SLUGS.map((slug) => ({
    path: `/services/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/case-study", changeFrequency: "monthly", priority: 0.9 },
  ...CASE_STUDY_SLUGS.map((slug) => ({
    path: `/case-study/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/career", changeFrequency: "weekly", priority: 0.6 },
  ...JOBS.map((job) => ({
    path: `/career/${job.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  })),
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getPosts();

  const entries: Entry[] = [
    ...STATIC_ROUTES,
    // Each article carries its own last-modified date, which is the signal
    // that actually drives re-crawling — a blanket "now" on every URL teaches
    // crawlers to ignore the field.
    ...posts.map((post) => ({
      path: post.href ?? `/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: new Date(post.updatedAt || post.publishedAt),
    })),
    // One page per topic. They are thin while a tag has a single post, so they
    // sit below the articles themselves in priority.
    ...allTags(posts).map((tag) => ({
      path: `/blog/tag/${tagSlug(tag)}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];

  return entries.map((entry) => ({
    url: entry.path === "/" ? siteConfig.url : `${siteConfig.url}${entry.path}`,
    lastModified: entry.lastModified ?? now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
