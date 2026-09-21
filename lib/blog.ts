/**
 * Blog content comes from the existing Project Help API, which is the same
 * service the current live site reads and the same one the admin writes to. A
 * post scheduled for a future date is filtered out server-side, so the site
 * needs no cron of its own — publishing happens by the clock.
 */

import { BACKEND_URL } from "@/lib/backend";

/** Legacy content shape (pre block-editor): heading + plain-text paragraphs. */
export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogTextBlock = {
  id: string;
  type: "text";
  html: string;
};

export type BlogImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt?: string;
  caption?: string;
};

export type BlogContentBlock = BlogTextBlock | BlogImageBlock;

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  tags: string[];
  author: string;
  readingTime: string;
  coverImageUrl: string | null;
  content: (BlogContentBlock | BlogSection)[];
  published: boolean;
  publishedAt: string;
  updatedAt: string;
  /** True for posts rendered from this repo rather than the API. */
  local?: boolean;
  /** Only set on local posts — their body lives in a page component. */
  href?: string;
};

export function isContentBlock(item: BlogContentBlock | BlogSection): item is BlogContentBlock {
  return "type" in item;
}

/**
 * The one article written before the blog was wired to the API. It keeps its
 * own hand-built page (it is the design reference for article layout), but it
 * still belongs in the index and the sitemap, so it is merged into the list
 * like any other post.
 */
export const LOCAL_POSTS: BlogPost[] = [
  {
    id: "local-saas-mvp-scope",
    slug: "saas-mvp-scope",
    title: "How We Scope a SaaS MVP That Ships in 8–12 Weeks",
    excerpt:
      "The process we run before a line of code is written: start from the deadline, settle tenancy, billing and access first, ship in two-week slices, and say no before invoicing.",
    metaDescription:
      "The process we run before a line of code is written: start from the deadline, settle tenancy, billing and access first, ship in two-week slices, and say no before invoicing.",
    tags: ["SaaS", "Delivery"],
    author: "Junaied Hossain",
    readingTime: "6 min read",
    coverImageUrl: "/images/blog-detail-hero.jpg",
    content: [],
    published: true,
    publishedAt: "2026-06-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
    local: true,
    href: "/blog/saas-mvp-scope",
  },
];

/**
 * Covers that ship with this repo, used when a post has no image of its own.
 * Picked by slug rather than at random so a given post keeps the same tile
 * across renders — otherwise the grid would reshuffle on every revalidate.
 */
const FALLBACK_COVERS = [
  "/images/blog-list-wide.jpg",
  "/images/blog-webflow-agency-templates.webp",
  "/images/blog-webflow-saas-templates.webp",
  "/images/blog-webflow-quality-rating.webp",
];

function hash(value: string) {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) total = (total * 31 + value.charCodeAt(i)) >>> 0;
  return total;
}

/**
 * Real cover photo for a post: the explicit cover, else the first inline image
 * block, else one of this repo's stock covers. Authors routinely add photos to
 * the body without setting the cover field, and the grid is image-led — an
 * empty tile would break the layout, so there is always a picture.
 */
export function coverImage(post: BlogPost): string {
  if (post.coverImageUrl) return post.coverImageUrl;

  const inline = post.content.find(
    (item): item is BlogImageBlock => isContentBlock(item) && item.type === "image",
  );
  if (inline?.url) return inline.url;

  return FALLBACK_COVERS[hash(post.slug) % FALLBACK_COVERS.length];
}

export function postHref(post: BlogPost) {
  return post.href ?? `/blog/${post.slug}`;
}

export function formatPostDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Plain text of a post body, for reading time and article JSON-LD wordCount. */
export function postPlainText(post: BlogPost) {
  return post.content
    .map((item) => {
      if (!isContentBlock(item)) {
        return [item.heading ?? "", ...item.paragraphs].join(" ");
      }
      if (item.type === "image") return item.caption ?? "";
      return item.html.replace(/<[^>]+>/g, " ");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Revalidate window shared by every blog route. A minute is short enough that a
 * scheduled post appears promptly once its date passes, and long enough that
 * the API is not hit once per visitor.
 */
export const BLOG_REVALIDATE = 60;

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${BACKEND_URL}${path}`, {
      next: { revalidate: BLOG_REVALIDATE, tags: ["blog"] },
    });
    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    // The API is a separate service; a blip there must degrade the blog, not
    // take the whole site's build or render down with it.
    return fallback;
  }
}

/** Published posts, newest first, with this repo's own articles merged in. */
export async function getPosts(): Promise<BlogPost[]> {
  const remote = await fetchJson<BlogPost[]>("/blog", []);

  return [...remote, ...LOCAL_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const local = LOCAL_POSTS.find((post) => post.slug === slug);
  if (local) return local;

  return fetchJson<BlogPost | null>(`/blog/${slug}`, null);
}

/**
 * Up to `limit` posts to show under an article. Same tag first — those are the
 * ones a reader is most likely to want next, and it is what builds the topical
 * cluster search engines reward — then the newest of whatever is left.
 */
export function relatedPosts(post: BlogPost, all: BlogPost[], limit = 3): BlogPost[] {
  const others = all.filter((item) => item.slug !== post.slug);
  const tags = new Set(post.tags);

  const scored = others
    .map((item) => ({ item, shared: item.tags.filter((tag) => tags.has(tag)).length }))
    .sort((a, b) => {
      if (b.shared !== a.shared) return b.shared - a.shared;
      return new Date(b.item.publishedAt).getTime() - new Date(a.item.publishedAt).getTime();
    });

  return scored.slice(0, limit).map((entry) => entry.item);
}

/**
 * URL-safe form of a tag, used for /blog/tag/[tag]. Tags are free text typed in
 * the admin, so "AI/ML" and "CI/CD" both contain a slash and would otherwise
 * produce a nested route.
 */
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findTag(slug: string, posts: BlogPost[]) {
  return allTags(posts).find((tag) => tagSlug(tag) === slug) ?? null;
}

export function postsByTag(tag: string, posts: BlogPost[]) {
  return posts.filter((post) => post.tags.includes(tag));
}

/** Every tag in use, most-used first, for the index filter row. */
export function allTags(posts: BlogPost[]): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}
