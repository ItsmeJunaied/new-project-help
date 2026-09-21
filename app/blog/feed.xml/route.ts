import { getPosts, postHref, postPlainText } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

// Same window as the blog itself, so a scheduled post reaches the feed on its
// date without a deploy.
export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed. Readers, newsletter tools and aggregators all expect this at a
 * predictable path, and it is the cheapest distribution a blog has — the whole
 * October run becomes syndicatable the day each post lands.
 */
export async function GET() {
  const posts = await getPosts();
  const updated = posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}${postHref(post)}`;
      const body = postPlainText(post);
      const description = post.metaDescription || post.excerpt;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
      <content:encoded><![CDATA[${body}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(`${siteConfig.name} — Blog`)}</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escapeXml(
      "Architecture decisions, delivery lessons and the trade-offs behind the systems we ship.",
    )}</description>
    <language>en</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
