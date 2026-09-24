"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RuleList from "@/components/ui/RuleList";
import ShareRow from "@/components/ui/ShareRow";
import {
  coverImage,
  formatPostDate,
  isContentBlock,
  type BlogContentBlock,
  type BlogPost,
  type BlogSection,
} from "@/lib/blog";

/**
 * Article body from the API, drawn in the layout the designed article uses:
 * a 546px sidebar carrying the intro and byline, a hairline rule, and the body
 * column beside it. Content arrives either as rich-text/image blocks from the
 * current editor or as the older heading + paragraphs shape, so both render.
 */
function ContentItem({ item }: { item: BlogContentBlock | BlogSection }) {
  if (!isContentBlock(item)) {
    return (
      <div className="flex w-full flex-col gap-[18px]">
        {item.heading && (
          <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-pure-black">
            {item.heading}
          </h2>
        )}
        {item.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark"
          >
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  if (item.type === "image") {
    return (
      <figure className="w-full">
        {/* Inline post images have no fixed aspect ratio and come from
            Cloudinary at arbitrary sizes, so this is a plain img with explicit
            dimensions rather than a fill <Image> in a guessed box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.alt ?? ""}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-cover"
        />
        {item.caption && (
          <figcaption className="mt-[12px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#707070]">
            {item.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return <div className="prose-content w-full" dangerouslySetInnerHTML={{ __html: item.html }} />;
}

type BlogPostArticleProps = {
  post: BlogPost;
  /** Absolute URL of this article, for the share buttons. */
  url: string;
};

export default function BlogPostArticle({ post, url }: BlogPostArticleProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".article-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.15 });
      gsap.from(".article-aside", { y: 24, opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.4 });
      gsap.from(".article-hero", { y: 48, opacity: 0, duration: 1, ease: "power3.out", delay: 0.3 });

      gsap.utils.toArray<HTMLElement>(".article-block").forEach((block) => {
        gsap.from(block, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 92%" }),
        });
      });

      gsap.from(".article-divider", {
        scaleY: 0,
        duration: 1.2,
        ease: "power2.inOut",
        transformOrigin: "top center",
        scrollTrigger: reveal(
          sectionRef.current?.querySelector(".article-columns") ?? null,
          { start: "top 82%" },
        ),
      });
    },
    { scope: sectionRef },
  );

  const cover = coverImage(post);

  return (
    <section className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[159px] lg:pt-[90px]" ref={sectionRef}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-0">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <h1 className="article-title font-display text-[clamp(2.5rem,4.7vw,68px)] font-medium leading-[1.1] tracking-[-1.5px] text-black lg:min-w-0 lg:max-w-[917px] lg:flex-1">
            {post.title}
          </h1>

          <RuleList
            title="{ BLOG  DETAILS }"
            body={post.excerpt}
            className="article-aside w-full lg:h-[150px] lg:w-auto"
            contentClassName="lg:w-[322px]"
          />
        </div>

        <div className="article-hero mt-[40px] w-full lg:mt-[70px]">
          <ParallaxImage
            src={cover}
            alt={post.title}
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="relative h-[280px] w-full sm:h-[440px] lg:h-[679px]"
          />
        </div>

        <div className="article-columns relative mt-[56px] flex w-full flex-col gap-[56px] lg:mt-[67px] lg:flex-row lg:gap-0">
          <div className="flex w-full flex-col gap-[24px] lg:w-[546px] lg:shrink-0">
            <div className="article-block flex w-full flex-col gap-[18px]">
              <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-pure-black">
                Introduction
              </h2>
              <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
                {post.excerpt}
              </p>
            </div>

            <div className="article-block flex w-full flex-col">
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <p className="flex h-[55px] items-center font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-primary-green">
                {post.tags[0] ?? "Insight"}
              </p>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <p className="flex h-[54px] items-center font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                {formatPostDate(post.publishedAt)}
                <span className="ml-[12px] font-body text-[16px] font-normal tracking-[-0.16px] text-[#707070]">
                  {post.readingTime}
                </span>
              </p>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <p className="flex h-[58px] items-center font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                {post.author}
              </p>
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />

              <div className="mt-[16px] flex w-full flex-col items-start gap-6">
                <ShareRow title="Share Article" url={url} text={post.title} />
              </div>

              {post.tags.length > 0 && (
                <div className="mt-[28px] flex w-full flex-wrap items-center gap-[8px]">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[100px] border border-[#e7e7e7] px-[14px] py-[6px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#707070]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <span
            aria-hidden
            className="article-divider hidden self-stretch bg-[#e7e7e7] lg:ml-[31px] lg:mr-[31px] lg:block lg:w-px"
          />

          <div className="flex w-full min-w-0 flex-col gap-[28px] lg:max-w-[832px] lg:flex-1">
            {post.content.map((item, index) => (
              <div key={(isContentBlock(item) && item.id) || index} className="article-block w-full">
                <ContentItem item={item} />
              </div>
            ))}

            <div className="article-block mt-[24px] flex w-full flex-col items-start gap-[18px] bg-[#151515] px-[32px] py-[36px] lg:mt-[36px] lg:px-[40px]">
              <p className="w-full font-display text-[24px] font-medium leading-[1.25] tracking-[-0.5px] text-white">
                Building something like this?
              </p>
              <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#c8c8c8]">
                Tell us what you are trying to ship and by when. We will come back with a
                scope, a fixed estimate and the parts we think you should cut.
              </p>
              <Link
                href="/contact"
                className="mt-[6px] flex items-center gap-[8px] rounded-[100px] bg-primary-green px-[24px] py-[12px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-opacity hover:opacity-85"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
