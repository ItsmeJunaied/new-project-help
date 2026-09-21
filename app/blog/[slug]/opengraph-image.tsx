import { ImageResponse } from "next/og";

import { getPost, getPosts } from "@/lib/blog";
import { OG_COLORS, OG_CONTENT_TYPE, OG_SIZE, ogFonts, ogTitleSize } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const alt = "Project Help article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Per-article card. Posts published from the admin rarely have a cover image
 * sized for social, and a shared generic card gets far fewer clicks than one
 * carrying the headline — so each article generates its own.
 */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.filter((post) => !post.local).map((post) => ({ slug: post.slug }));
}

export default async function BlogOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? "Project Help";
  const tag = post?.tags[0] ?? "Insight";
  const date = post
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: OG_COLORS.background,
          padding: "72px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 20, height: 20, background: OG_COLORS.accent }} />
          <span style={{ fontSize: 26, fontWeight: 500, color: OG_COLORS.text, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </span>
          <span style={{ fontSize: 26, fontWeight: 500, color: OG_COLORS.muted }}>/</span>
          <span style={{ fontSize: 26, fontWeight: 500, color: OG_COLORS.muted }}>{tag}</span>
        </div>

        <span
          style={{
            fontSize: ogTitleSize(title),
            fontWeight: 600,
            color: OG_COLORS.text,
            lineHeight: 1.08,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 24, fontWeight: 500, color: OG_COLORS.muted }}>{date}</span>
          <span style={{ fontSize: 24, fontWeight: 500, color: OG_COLORS.accent }}>
            {siteConfig.url.replace("https://", "")}/blog
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
