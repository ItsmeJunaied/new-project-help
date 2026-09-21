"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { coverImage, formatPostDate, postHref, type BlogPost } from "@/lib/blog";

type BlogProps = {
  /** Articles to show. Fetched by the page, so this stays a client component. */
  posts: BlogPost[];
  /** Total published articles, for the counter beside the intro. */
  totalPosts?: number;
  label?: string;
  /** The divider and subtitle row only appear on the home page. */
  showIntro?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  sectionClassName?: string;
  containerClassName?: string;
  groupClassName?: string;
  cardClassName?: string;
  /** Card artwork ratio — the related-posts variant is a little wider. */
  imageClassName?: string;
  nodeId?: string;
  id?: string;
};

export default function Blog({
  posts,
  totalPosts,
  label = "[ LATEST ARTICLES ]",
  showIntro = true,
  ctaLabel = "Explore more",
  ctaHref = "/blog",
  sectionClassName = "bg-bg px-6 py-[80px] lg:px-0 lg:py-[100px]",
  containerClassName = "max-w-[1296px] gap-[48px] lg:gap-[80px]",
  groupClassName = "gap-[48px] lg:gap-[80px]",
  cardClassName = "sm:w-[418.66px]",
  imageClassName = "aspect-[419/560]",
  nodeId = "156:7407",
  id = "blog",
}: BlogProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".blog-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".blog-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".blog-divider", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      const grid = sectionRef.current?.querySelector(".blog-grid") ?? null;

      // Each card uncovers its own artwork before the text fades up, so the row
      // reads as three separate reveals rather than one block.
      gsap.utils.toArray<HTMLElement>(".blog-card").forEach((card, i) => {
        const cardTrigger = reveal(grid, { start: "top 88%" });

        gsap.from(card.querySelector(".blog-card-frame"), {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1,
          ease: "power3.out",
          delay: i * 0.12,
          scrollTrigger: cardTrigger,
        });

        gsap.from(card.querySelector(".blog-card-body"), {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: i * 0.12 + 0.25,
          scrollTrigger: cardTrigger,
        });

        if (prefersReducedMotion()) return;

        gsap.fromTo(
          card.querySelector(".blog-card-image"),
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      gsap.from(".blog-cta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(document.querySelector(".blog-cta"), { start: "top 95%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      data-node-id={nodeId}
      className={`w-full ${sectionClassName}`}
    >
      <div className={`mx-auto flex w-full flex-col ${containerClassName}`}>
        <div className={`flex w-full flex-col ${groupClassName}`}>
          <div className="flex w-full flex-col gap-[40px]">
            <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
              <p className="blog-meta font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111] lg:w-[178px]">
                {label}
              </p>
              <div className="w-full lg:max-w-[907.2px] lg:pr-[275.16px]">
                <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1] tracking-[-3px] text-[#111]">
                  <span className="block overflow-hidden">
                    <span className="blog-heading-inner block">Notes From Our</span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="blog-heading-inner block">Engineering Floor</span>
                  </span>
                </h2>
              </div>
            </div>

            {showIntro ? (
              <>
                <div className="blog-divider h-px w-full bg-[#e6e9dd]" />

                <div className="flex w-full items-start lg:pl-[388.81px]">
                  <div className="flex w-full flex-col items-start justify-between gap-6 lg:max-w-[907.2px] lg:flex-row lg:items-start">
                    <p className="blog-meta font-display text-[20px] leading-[24px] tracking-[-0.25px] text-[#707070] lg:pr-[8.72px]">
                      Architecture decisions, delivery lessons and the trade-offs behind
                      the systems we ship.
                    </p>
                    <p className="blog-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
                      BLOGS [{totalPosts ?? posts.length}]
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="blog-grid flex w-full flex-col items-start justify-center gap-[20px] sm:flex-row">
            {posts.map((post) => (
              <article
                key={post.slug}
                className={`blog-card group flex w-full flex-col items-start gap-[24px] ${cardClassName}`}
              >
                <Link
                  href={postHref(post)}
                  className={`blog-card-frame relative w-full overflow-clip ${imageClassName}`}
                >
                  <Image
                    src={coverImage(post)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 639px) 100vw, 419px"
                    className="blog-card-image scale-[1.08] object-cover transition-transform duration-700 group-hover:scale-[1.14]"
                  />
                </Link>

                <div className="blog-card-body flex w-full flex-col items-start gap-[16px]">
                  <h3 className="line-clamp-3 w-full font-display text-[24px] font-medium leading-[31.2px] tracking-[-0.75px] text-[#111]">
                    <Link href={postHref(post)} className="transition-opacity hover:opacity-70">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex w-full items-center gap-[8px]">
                    <span className="size-[8px] min-h-[8px] min-w-[8px] shrink-0 bg-[#dc7936]" />
                    <time
                      dateTime={post.publishedAt}
                      className="font-body text-[16px] leading-[16px] tracking-[-0.25px] text-[#707070]"
                    >
                      {formatPostDate(post.publishedAt)}
                    </time>
                    <span className="size-[4px] shrink-0 rounded-[1000px] bg-ash-muted" />
                    <span className="font-body text-[16px] leading-[16px] tracking-[-0.25px] text-[#707070]">
                      {post.readingTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <Link
            href={ctaHref}
            className="blog-cta group flex max-w-[1296px] items-center justify-center gap-[8.01px] rounded-[1000px] border border-ash-muted px-[32px] py-[16px] transition-colors hover:border-[#111]"
          >
            <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-[#111]">
              {ctaLabel}
            </span>
            <span className="relative size-[22px] shrink-0 transition-transform duration-500 group-hover:rotate-90">
              <Image src="/icons/icon-blog-plus.svg" alt="" fill className="object-contain" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
